'use client';

import { useState, useEffect } from 'react';

export function Clock() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })
      );
      setDate(
        now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
      );
    };
    updateClock();
    const timerId = setInterval(updateClock, 1000); // Update every second
    return () => clearInterval(timerId);
  }, []);

  if (!time || !date) {
    return <div className="w-48 h-7 rounded-md bg-muted/50 animate-pulse" />;
  }

  return (
    <div className="flex flex-col items-end text-sm tv:text-base font-medium text-foreground/80 leading-tight">
      <span>{time}</span>
      <span className="text-xs text-muted-foreground">{date}</span>
    </div>
  );
}
