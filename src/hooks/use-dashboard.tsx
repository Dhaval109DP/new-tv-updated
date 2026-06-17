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

  // Connect to PartyKit room using the pair code
  const socket = usePartySocket({
    // Proxies through Next.js rewrites to avoid local network binding issues
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST || (typeof window !== 'undefined' ? window.location.host : '127.0.0.1:3000'),
    room: pairCode || 'default', // Only connect if we have a room
    startClosed: !pairCode, // Don't connect until we have a pair code
    onOpen() {
      setIsOnline(true);
      if (deviceType === 'tv') {
        toast({ title: "Sync Active", description: "Ready to pair with phone.", duration: 3000 });
      }
      // When TV connects, broadcast its state so phones get it immediately
      if (deviceType === 'tv') {
        const msg: SyncMessage = { type: 'init', state, device: 'tv' };
        socket.send(JSON.stringify(msg));
      } else {
        // Phone connecting, ask for state
        const msg: SyncMessage = { type: 'join', device: 'phone' };
        socket.send(JSON.stringify(msg));
      }
    },
    onClose() {
      setIsOnline(false);
    },
    onMessage(event) {
      try {
        const msg = JSON.parse(event.data) as SyncMessage;
        
        switch (msg.type) {
          case 'init':
          case 'sync':
            // Received full state
            setState(msg.state);
            if (deviceType === 'tv') saveState(msg.state);
            break;
            
          case 'update':
            // Received partial update
            if (msg.timestamp > state.lastModified) {
              setState(prev => {
                const newState = { ...prev, ...msg.patch, lastModified: msg.timestamp };
                if (deviceType === 'tv') saveState(newState);
                return newState;
              });
            }
            break;
            
          case 'join':
            // Someone joined, if we're TV, send them our state
            if (deviceType === 'tv') {
              toast({ title: "Phone Connected", description: "Your phone is now syncing.", duration: 3000 });
              const reply: SyncMessage = { type: 'sync', state };
              socket.send(JSON.stringify(reply));
            }
            break;

          case 'open_url':
            // TV automatically opens casted URLs
            if (deviceType === 'tv') {
              toast({ title: "Opening Link", description: "Opening link from phone...", duration: 3000 });
              window.open(msg.url, '_blank');
            }
            break;
        }
      } catch (err) {
        console.error('Failed to parse sync message', err);
      }
    }
  });

  // Reconnect when pair code changes
  useEffect(() => {
    if (pairCode) {
      socket.reconnect();
    }
  }, [pairCode, socket]);

  // Function to broadcast raw messages (like open_url)
  const broadcastMessage = (msg: SyncMessage) => {
    if (isOnline && pairCode) {
      socket.send(JSON.stringify(msg));
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
    if (isOnline && pairCode) {
      const msg: SyncMessage = { type: 'update', patch, timestamp };
      socket.send(JSON.stringify(msg));
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
