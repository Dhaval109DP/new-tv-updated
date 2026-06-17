'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import usePartySocket from 'partysocket/react';
import { 
  DashboardState, 
  SyncMessage, 
  DEFAULT_DASHBOARD_STATE, 
  DeviceType 
} from '@/lib/types';
import { loadState, saveState } from '@/lib/store';
import { useToast } from './use-toast';

interface DashboardContextType {
  state: DashboardState;
  updateState: (patch: Partial<DashboardState>) => void;
  isOnline: boolean;
  pairCode: string | null;
  setPairCode: (code: string | null) => void;
  deviceType: DeviceType;
  broadcastMessage: (msg: SyncMessage) => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ 
  children, 
  deviceType = 'tv' 
}: { 
  children: ReactNode;
  deviceType?: DeviceType;
}) {
  const [state, setState] = useState<DashboardState>(DEFAULT_DASHBOARD_STATE);
  const [isOnline, setIsOnline] = useState(false);
  const [pairCode, setPairCodeState] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dashboard_pair_code');
    }
    return null;
  });
  const { toast } = useToast();

  const setPairCode = (code: string | null) => {
    setPairCodeState(code);
    if (code) {
      localStorage.setItem('dashboard_pair_code', code);
    } else {
      localStorage.removeItem('dashboard_pair_code');
    }
  };

  // Load initial state from local storage (TV mostly)
  useEffect(() => {
    if (deviceType === 'tv') {
      const stored = loadState();
      setState(stored);
    }
  }, [deviceType]);

  // Generate pair code for TV if none exists
  useEffect(() => {
    if (deviceType === 'tv' && !pairCode) {
      // Simple 6-character alphanumeric code
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      setPairCode(code);
    }
  }, [deviceType, pairCode]);

  const socketRef = React.useRef<WebSocket | null>(null);

  // Connect to the new Render WebSocket server
  useEffect(() => {
    if (!pairCode) return;

    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout>;
    let isComponentMounted = true;

    const connect = () => {
      // Determine WebSocket URL
      // If NEXT_PUBLIC_SYNC_HOST is provided, use it. Otherwise use localhost:1999
      const host = process.env.NEXT_PUBLIC_SYNC_HOST || 'localhost:1999';
      // Use wss:// for https (Netlify/Render), ws:// for localhost
      const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'ws://' : 'wss://';
      const wsUrl = `${protocol}${host}/?room=${pairCode}`;

      ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        if (!isComponentMounted) return;
        setIsOnline(true);
        if (deviceType === 'tv') {
          toast({ title: "Sync Active", description: "Ready to pair with phone.", duration: 3000 });
          // Broadcast state to phones
          const msg: SyncMessage = { type: 'init', state, device: 'tv' };
          ws?.send(JSON.stringify(msg));
        } else {
          // Phone connecting, ask for state
          const msg: SyncMessage = { type: 'join', device: 'phone' };
          ws?.send(JSON.stringify(msg));
        }
      };

      ws.onclose = () => {
        if (!isComponentMounted) return;
        setIsOnline(false);
        socketRef.current = null;
        // Attempt to reconnect after 2 seconds
        reconnectTimer = setTimeout(connect, 2000);
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        ws?.close(); // Force close to trigger reconnect
      };

      ws.onmessage = (event) => {
        if (!isComponentMounted) return;
        try {
          const msg = JSON.parse(event.data) as SyncMessage;
          
          switch (msg.type) {
            case 'init':
            case 'sync':
              setState(msg.state);
              if (deviceType === 'tv') saveState(msg.state);
              break;
              
            case 'update':
              if (msg.timestamp > state.lastModified) {
                setState(prev => {
                  const newState = { ...prev, ...msg.patch, lastModified: msg.timestamp };
                  if (deviceType === 'tv') saveState(newState);
                  return newState;
                });
              }
              break;
              
            case 'join':
              if (deviceType === 'tv') {
                toast({ title: "Phone Connected", description: "Your phone is now syncing.", duration: 3000 });
                const reply: SyncMessage = { type: 'sync', state };
                ws?.send(JSON.stringify(reply));
              }
              break;

            case 'open_url':
              if (deviceType === 'tv') {
                toast({ title: "Opening Link", description: "Opening link from phone...", duration: 3000 });
                window.open(msg.url, '_blank');
              }
              break;
          }
        } catch (err) {
          console.error('Failed to parse sync message', err);
        }
      };
    };

    connect();

    // Cleanup on unmount or pairCode change
    return () => {
      isComponentMounted = false;
      clearTimeout(reconnectTimer);
      if (ws) {
        ws.close();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairCode, deviceType]); // Only re-run if pairCode or deviceType changes

  // Function to broadcast raw messages (like open_url)
  const broadcastMessage = (msg: SyncMessage) => {
    if (isOnline && pairCode && socketRef.current?.readyState === 1) {
      socketRef.current.send(JSON.stringify(msg));
    }
  };

  // Function to update state and broadcast
  const updateState = (patch: Partial<DashboardState>) => {
    const timestamp = Date.now();
    
    // Optimistic local update
    setState(prev => {
      const newState = { 
        ...prev, 
        ...patch, 
        lastModified: timestamp,
        modifiedBy: deviceType 
      };
      if (deviceType === 'tv') saveState(newState);
      return newState;
    });

    // Broadcast if online
    if (isOnline && pairCode && socketRef.current?.readyState === 1) {
      const msg: SyncMessage = { type: 'update', patch, timestamp };
      socketRef.current.send(JSON.stringify(msg));
    }
  };

  return (
    <DashboardContext.Provider 
      value={{ state, updateState, isOnline, pairCode, setPairCode, deviceType, broadcastMessage }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
