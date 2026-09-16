'use client';

import { SiteStatus } from '@/hooks/use-site-status';
import { cn } from '@/lib/utils';

interface StatusDotProps {
  status: SiteStatus;
  className?: string;
}

export function StatusDot({ status, className }: StatusDotProps) {
  const colors: Record<SiteStatus, string> = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    checking: 'bg-yellow-500 animate-pulse',
    unknown: 'bg-gray-500',
  };

  const labels: Record<SiteStatus, string> = {
    online: 'Site is online',
    offline: 'Site may be down',
    checking: 'Checking...',
    unknown: 'Status unknown',
  };

  return (
    <span
      className={cn('inline-block w-2.5 h-2.5 rounded-full flex-shrink-0', colors[status], className)}
      title={labels[status]}
      aria-label={labels[status]}
    />
  );
}
