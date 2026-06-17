'use client';

import { useState, useEffect } from 'react';

export function Clock() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
      );
      setDate(
        now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
      );
    };
    updateClock();
    const timerId = setInterval(updateClock, 1000 * 60); // Update every minute
    return () => clearInterval(timerId);
  }, []);

  if (!time || !date) {
    return <div className="w-48 h-7 rounded-md bg-muted/50 animate-pulse" />;
  }

  return (
    <div className="flex items-baseline gap-4 text-xl font-medium text-foreground/80">
      <span>{date}</span>
      <span>{time}</span>
    </div>
  );
}
