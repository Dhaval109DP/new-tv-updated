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
// Map<roomId, Set<WebSocket>>
const rooms = new Map();

wss.on('connection', (ws, req) => {
  // Parse room from URL: e.g. ws://localhost:1999/?room=ABCDEF
  const url = new URL(req.url, `http://${req.headers.host}`);
  const room = url.searchParams.get('room') || 'default';

  // Add connection to room
  if (!rooms.has(room)) {
    rooms.set(room, new Set());
  }
  rooms.get(room).add(ws);

  console.log(`Client connected to room: ${room}. Total clients in room: ${rooms.get(room).size}`);

  ws.on('message', (messageAsString) => {
    // console.log(`Received message in room ${room}: ${messageAsString}`);
    
    // Broadcast to all *other* clients in the same room
    const roomClients = rooms.get(room);
    if (roomClients) {
      for (const client of roomClients) {
        if (client !== ws && client.readyState === 1 /* OPEN */) {
          client.send(messageAsString.toString());
        }
      }
    }
  });

  ws.on('close', () => {
    // Remove connection from room
    const roomClients = rooms.get(room);
    if (roomClients) {
      roomClients.delete(ws);
      console.log(`Client disconnected from room: ${room}. Remaining: ${roomClients.size}`);
      if (roomClients.size === 0) {
        rooms.delete(room);
      }
    }
  });
});

const PORT = process.env.PORT || 1999;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
