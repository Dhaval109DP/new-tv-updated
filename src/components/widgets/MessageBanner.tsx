'use client';

import { useDashboard } from '@/hooks/use-dashboard';
import { AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';
import { Button } from '../ui/button';

export function MessageBanner() {
  const { state, updateState } = useDashboard();
  const { announcements } = state;

  // Filter out dismissed announcements
  const activeAnnouncements = announcements.filter(a => !a.dismissedAt);

  if (activeAnnouncements.length === 0) return null;

  const handleDismiss = (id: string) => {
    updateState({
      announcements: announcements.map(a => 
        a.id === id ? { ...a, dismissedAt: Date.now() } : a
      )
    });
  };

  return (
    <div className="container mx-auto px-6 mb-8 space-y-4">
      {activeAnnouncements.map(announcement => {
        const isWarning = announcement.type === 'warning';
        const isSuccess = announcement.type === 'success';

        return (
          <div 
            key={announcement.id}
            className={`relative overflow-hidden rounded-xl p-4 flex items-start gap-4 shadow-lg animate-in slide-in-from-top-4 fade-in-0
              ${isWarning ? 'bg-amber-500/10 border border-amber-500/50 text-amber-500' : 
                isSuccess ? 'bg-green-500/10 border border-green-500/50 text-green-500' : 
                'bg-blue-500/10 border border-blue-500/50 text-blue-500'}`}
          >
            <div className="mt-1">
              {isWarning ? <AlertTriangle className="h-6 w-6" /> : 
               isSuccess ? <CheckCircle2 className="h-6 w-6" /> : 
               <Info className="h-6 w-6" />}
            </div>
            <div className="flex-1">
              <p className="text-lg font-medium text-foreground">{announcement.message}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground shrink-0"
              onClick={() => handleDismiss(announcement.id)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
