'use client';

import { useDashboard } from '@/hooks/use-dashboard';
import { Smartphone, SmartphoneNfc } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface SyncStatusProps {
  onPairClick: () => void;
}

export function SyncStatus({ onPairClick }: SyncStatusProps) {
  const { isOnline, connectedDevices } = useDashboard();

  const phoneCount = connectedDevices.length;

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        {/* Connected phone icons */}
        {phoneCount > 0 && connectedDevices.map((device) => (
          <Tooltip key={device.id}>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 border border-white/10">
                <Smartphone className="w-3.5 h-3.5" style={{ color: device.color }} />
                <span className="text-[10px] font-bold uppercase tracking-wider hidden tv:inline-block" style={{ color: device.color }}>
                  {device.name}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-popover text-popover-foreground">
              <p>{device.name} — Connected</p>
            </TooltipContent>
          </Tooltip>
        ))}

        {/* Main sync button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onPairClick}
              className="flex items-center gap-2 text-foreground/80 hover:text-foreground hover:bg-white/10"
            >
              {isOnline ? (
                <>
                  {phoneCount === 0 ? (
                    <SmartphoneNfc className="w-4 h-4 text-green-500 animate-pulse" />
                  ) : (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                  )}
                  <span className="text-xs font-medium uppercase tracking-wider hidden tv:inline-block">
                    {phoneCount > 0 ? `${phoneCount} Active` : 'Pair'}
                  </span>
                </>
              ) : (
                <>
                  <SmartphoneNfc className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs font-medium uppercase tracking-wider hidden tv:inline-block">Offline</span>
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-popover text-popover-foreground">
            <p>{isOnline 
              ? (phoneCount > 0 ? `${phoneCount} phone(s) connected. Click to view pairing code.` : 'Connected. Click to pair a phone.') 
              : 'Disconnected. Click to pair.'}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
