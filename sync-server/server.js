const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());

// Basic health check endpoint for Render
app.get('/', (req, res) => {
  res.send('Sync Server is running!');
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Room management
// Map<roomId, Map<WebSocket, { deviceType, deviceId, deviceName }>>
const rooms = new Map();

// Device color palette
const DEVICE_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#ec4899'];

function getDeviceList(room) {
  const roomClients = rooms.get(room);
  if (!roomClients) return [];
  
  const devices = [];
  for (const [, meta] of roomClients) {
    if (meta.deviceType === 'phone') {
      devices.push({
        id: meta.deviceId,
        name: meta.deviceName,
        color: meta.color,
        connectedAt: meta.connectedAt,
      });
    }
  }
  return devices;
}

function broadcastDeviceList(room) {
  const roomClients = rooms.get(room);
  if (!roomClients) return;
  
  const devices = getDeviceList(room);
  const msg = JSON.stringify({ type: 'device_list', devices });
  
  for (const [client] of roomClients) {
    if (client.readyState === 1) {
      client.send(msg);
    }
  }
}

function getNextPhoneName(room) {
  const roomClients = rooms.get(room);
  if (!roomClients) return 'Phone 1';
  
  // Find existing phone numbers
  const usedNumbers = new Set();
  for (const [, meta] of roomClients) {
    if (meta.deviceType === 'phone') {
      const match = meta.deviceName?.match(/Phone (\d+)/);
      if (match) usedNumbers.add(parseInt(match[1]));
    }
  }
  
  // Find the lowest unused number
  let num = 1;
  while (usedNumbers.has(num)) num++;
  return `Phone ${num}`;
}

function getPhoneColor(room) {
  const roomClients = rooms.get(room);
  if (!roomClients) return DEVICE_COLORS[0];
  
  let phoneCount = 0;
  for (const [, meta] of roomClients) {
    if (meta.deviceType === 'phone') phoneCount++;
  }
  return DEVICE_COLORS[phoneCount % DEVICE_COLORS.length];
}

wss.on('connection', (ws, req) => {
  // Parse room from URL: e.g. ws://localhost:1999/?room=ABCDEF
  const url = new URL(req.url, `http://${req.headers.host}`);
  const room = url.searchParams.get('room') || 'default';

  // Add connection to room with empty metadata (filled on first message)
  if (!rooms.has(room)) {
    rooms.set(room, new Map());
  }
  rooms.get(room).set(ws, { deviceType: 'unknown', deviceId: null, deviceName: null, color: null, connectedAt: Date.now() });

  console.log(`Client connected to room: ${room}. Total clients: ${rooms.get(room).size}`);

  ws.on('message', (messageAsString) => {
    const msgStr = messageAsString.toString();
    let parsed;
    try {
      parsed = JSON.parse(msgStr);
    } catch {
      parsed = null;
    }

    // If it's a join message from a phone, update metadata and broadcast device list
    if (parsed && parsed.type === 'join' && parsed.device === 'phone') {
      const meta = rooms.get(room)?.get(ws);
      if (meta) {
        const name = parsed.deviceName || getNextPhoneName(room);
        const color = getPhoneColor(room);
        meta.deviceType = 'phone';
        meta.deviceId = parsed.deviceId || `phone-${Date.now()}`;
        meta.deviceName = name;
        meta.color = color;
        meta.connectedAt = Date.now();

        // Send the assigned identity back to the phone
        ws.send(JSON.stringify({
          type: 'device_assigned',
          deviceId: meta.deviceId,
          deviceName: meta.deviceName,
          color: meta.color,
        }));
      }
      // Broadcast updated device list to everyone
      broadcastDeviceList(room);
    }

    // If it's an init from TV, update metadata
    if (parsed && parsed.type === 'init' && parsed.device === 'tv') {
      const meta = rooms.get(room)?.get(ws);
      if (meta) {
        meta.deviceType = 'tv';
        meta.deviceId = 'tv';
        meta.deviceName = 'TV';
      }
      // Also send the current device list to the TV
      setTimeout(() => broadcastDeviceList(room), 100);
    }

    // Broadcast to all *other* clients in the same room
    const roomClients = rooms.get(room);
    if (roomClients) {
      for (const [client] of roomClients) {
        if (client !== ws && client.readyState === 1 /* OPEN */) {
          client.send(msgStr);
        }
      }
    }
  });

  ws.on('close', () => {
    // Remove connection from room
    const roomClients = rooms.get(room);
    if (roomClients) {
      const meta = roomClients.get(ws);
      const wasPhone = meta?.deviceType === 'phone';
      roomClients.delete(ws);
      console.log(`Client disconnected from room: ${room}. Remaining: ${roomClients.size}`);
      
      if (roomClients.size === 0) {
        rooms.delete(room);
      } else if (wasPhone) {
        // Broadcast updated device list after a phone leaves
        broadcastDeviceList(room);
      }
    }
  });
});

const PORT = process.env.PORT || 1999;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
