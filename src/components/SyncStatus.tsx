'use client';

import { useDashboard } from '@/hooks/use-dashboard';
import { Smartphone, SmartphoneNfc } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface SyncStatusProps {
  onPairClick: () => void;
}

export function SyncStatus({ onPairClick }: SyncStatusProps) {
  const { isOnline } = useDashboard();

  return (
    <TooltipProvider>
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
                <Smartphone className="w-4 h-4 text-green-500" />
                <span className="text-xs font-medium uppercase tracking-wider hidden tv:inline-block">Sync Active</span>
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
          <p>{isOnline ? 'Connected to sync server. Click to view pairing code.' : 'Disconnected from sync server. Click to pair.'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
