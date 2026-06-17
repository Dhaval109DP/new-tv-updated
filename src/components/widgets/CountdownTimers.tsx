'use client';

import { useDashboard } from '@/hooks/use-dashboard';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Timer as TimerIcon, X } from 'lucide-react';
import { Button } from '../ui/button';

export function CountdownTimers() {
  const { state, updateState } = useDashboard();
  const activeTimers = state.timers.filter(t => t.active);

  // Force re-render every second to update the visual countdown
  const [, setTick] = useState(0);
  useEffect(() => {
    if (activeTimers.length === 0) return;
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [activeTimers.length]);

  if (activeTimers.length === 0) return null;

  const handleDismiss = (id: string) => {
    updateState({
      timers: state.timers.map(t => 
        t.id === id ? { ...t, active: false } : t
      )
    });
  };

  const formatTimeRemaining = (targetTime: number) => {
    const diff = targetTime - Date.now();
    if (diff <= 0) return '00:00';
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      {activeTimers.map(timer => {
        const timeRemaining = formatTimeRemaining(timer.targetTime);
        const isDone = Date.now() >= timer.targetTime;

        return (
          <Card 
            key={timer.id} 
            className={`w-64 border-2 shadow-2xl backdrop-blur-md animate-in slide-in-from-right-8 fade-in-0
              ${isDone ? 'bg-destructive/20 border-destructive animate-pulse' : 'bg-card/90 border-primary/50'}`}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isDone ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'}`}>
                  <TimerIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{timer.label}</p>
                  <p className={`text-2xl font-mono font-bold ${isDone ? 'text-destructive' : 'text-foreground'}`}>
                    {timeRemaining}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDismiss(timer.id)}
                className="hover:bg-transparent hover:text-foreground opacity-50 hover:opacity-100 transition-opacity"
              >
                <X className="h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
