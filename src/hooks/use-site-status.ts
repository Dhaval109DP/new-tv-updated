'use client';

import { useState, useEffect, useCallback } from 'react';

export type SiteStatus = 'checking' | 'online' | 'offline' | 'unknown';

interface StatusResult {
  url: string;
  status: SiteStatus;
  lastChecked: number;
}

const SITES_TO_CHECK = [
  { name: 'Desi Cinemas', url: 'https://desicinemas.to/' },
  { name: 'Bollyzone', url: 'https://www.bollyzone.to/' },
  { name: 'PlayDesi!', url: 'https://playdesi.info/' },
  { name: 'Dailymotion', url: 'https://www.dailymotion.com/' },
  { name: 'T-Flix', url: 'https://tv.tflix.app/' },
];

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useSiteStatus() {
  const [statuses, setStatuses] = useState<Record<string, StatusResult>>({});

  const checkSite = useCallback(async (name: string, url: string) => {
    // Check cache first
    const cached = statuses[name];
    if (cached && Date.now() - cached.lastChecked < CACHE_TTL) {
      return;
    }

    setStatuses(prev => ({
      ...prev,
      [name]: { url, status: 'checking', lastChecked: Date.now() },
    }));

    try {
      // Use no-cors mode - we can't read the response, but a successful
      // fetch means the server responded (likely online)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      await fetch(url, {
        mode: 'no-cors',
        signal: controller.signal,
        cache: 'no-store',
      });
      
      clearTimeout(timeoutId);
      
      setStatuses(prev => ({
        ...prev,
        [name]: { url, status: 'online', lastChecked: Date.now() },
      }));
    } catch {
      setStatuses(prev => ({
        ...prev,
        [name]: { url, status: 'offline', lastChecked: Date.now() },
      }));
    }
  }, []);

  useEffect(() => {
    // Check all sites on mount
    SITES_TO_CHECK.forEach(site => checkSite(site.name, site.url));

    // Re-check every 5 minutes
    const interval = setInterval(() => {
      SITES_TO_CHECK.forEach(site => checkSite(site.name, site.url));
    }, CACHE_TTL);

    return () => clearInterval(interval);
  }, [checkSite]);

  const getStatus = (platformName: string): SiteStatus => {
    return statuses[platformName]?.status || 'unknown';
  };

  return { statuses, getStatus, refresh: () => SITES_TO_CHECK.forEach(site => checkSite(site.name, site.url)) };
}
