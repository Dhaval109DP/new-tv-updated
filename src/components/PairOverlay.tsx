'use client';

import { useDashboard } from '@/hooks/use-dashboard';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { LoaderCircle, Smartphone } from 'lucide-react';
import { useEffect } from 'react';

interface PairOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PairOverlay({ open, onOpenChange }: PairOverlayProps) {
  const { pairCode, isOnline, connectedDevices } = useDashboard();

  // Construct the URL for the phone to scan
  const remoteUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/remote?code=${pairCode}`
    : '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-md border-primary/20 shadow-2xl shadow-primary/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline tracking-wide text-center">Pair Remote</DialogTitle>
          <DialogDescription className="text-center text-base">
            Scan this QR code with your phone to edit the dashboard, or go to <strong>{typeof window !== 'undefined' ? window.location.host + '/remote' : ''}</strong>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center space-y-8 py-6">
          {/* Pair Code Display */}
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pairing Code</span>
            <div className="text-6xl font-bold font-mono tracking-[0.2em] text-primary select-all">
              {pairCode || '......'}
            </div>
          </div>

          {/* QR Code Display */}
          <div className="p-4 bg-white rounded-xl shadow-inner">
            {remoteUrl ? (
              <QRCodeSVG 
                value={remoteUrl} 
                size={200}
                level="H"
                includeMargin={false}
                bgColor="#ffffff"
                fgColor="#000000"
              />
            ) : (
              <div className="w-[200px] h-[200px] bg-gray-200 animate-pulse rounded-lg" />
            )}
          </div>

          {/* Connected Devices */}
          {connectedDevices.length > 0 ? (
            <div className="w-full space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
                Connected Devices ({connectedDevices.length})
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {connectedDevices.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
                    style={{ borderColor: device.color, backgroundColor: `${device.color}15` }}
                  >
                    <Smartphone className="w-3.5 h-3.5" style={{ color: device.color }} />
                    <span className="text-sm font-medium" style={{ color: device.color }}>
                      {device.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              {!isOnline ? (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin text-yellow-500" />
                  <span>Connecting to sync server...</span>
                </>
              ) : (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin text-primary" />
                  <span>Waiting for phone to connect...</span>
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
