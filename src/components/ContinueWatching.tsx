'use client';

import { useState, useEffect, ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { BollyzoneLogo } from '@/components/bollyzone-logo';
import { DesiCinemasLogo } from '@/components/desi-cinemas-logo';
import { PlayDesiLogo } from '@/components/play-desi-logo';
import { DailymotionLogo } from '@/components/dailymotion-logo';
import { AppButton } from './app-button';

interface Platform {
  name: string;
  href: string;
  logo: ReactNode;
}

const favoritePlatforms: Platform[] = [
  { name: 'Desi Cinemas', href: 'https://desicinemas.to/', logo: <DesiCinemasLogo /> },
  { name: 'Bollyzone', href: 'https://www.bollyzone.to/', logo: <BollyzoneLogo /> },
  { name: 'Play Desi!', href: 'https://playdesi.info/', logo: <PlayDesiLogo /> },
  { name: 'Dailymotion', href: 'https://www.dailymotion.com/au', logo: <DailymotionLogo /> },
];

export function ContinueWatching() {
  const [lastVisited, setLastVisited] = useState<Platform | null>(null);

  useEffect(() => {
    // This code runs only on the client, after the component has mounted.
    // This avoids a hydration mismatch error by preventing the server-rendered
    // HTML from differing from the initial client render.
    let platformToSet: Platform = favoritePlatforms[1]; // Default to Bollyzone
    try {
      const storedPlatform = localStorage.getItem('lastVisitedPlatform');
      if (storedPlatform) {
        const parsedPlatform: { name: string } = JSON.parse(storedPlatform);
        const foundPlatform = favoritePlatforms.find(p => p.name === parsedPlatform.name);
        if (foundPlatform) {
          platformToSet = foundPlatform;
        }
      }
    } catch (e) {
      console.error("Failed to parse last visited platform from localStorage", e);
      // If parsing fails, we'll just use the default.
    }
    setLastVisited(platformToSet);
  }, []);

  const handlePlatformClick = (platform: Platform) => {
    const storablePlatform = { name: platform.name, href: platform.href };
    localStorage.setItem('lastVisitedPlatform', JSON.stringify(storablePlatform));
    setLastVisited(platform);
  };
  
  if (!lastVisited) {
    return (
        <div className="relative w-full h-[60vh] md:h-[70vh] tv:h-[55vh]">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent z-10" />
            <div className="relative z-20 flex flex-col justify-end h-full p-8 md:p-12 lg:p-16 tv:px-24 tv:py-20">
                <div className="max-w-xl">
                    <Skeleton className="h-9 w-3/4 mb-4" />
                    <Skeleton className="w-64 h-24 tv:w-80 tv:h-32 rounded-xl" />
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="relative z-20 flex flex-col justify-end h-full p-8 md:p-12 lg:p-16 tv:px-24 tv:py-20 -mt-32">
        <div className="max-w-xl">
            <p className="text-2xl md:text-3xl font-semibold text-foreground/90 mb-4">Continue Watching on</p>
            <AppButton 
                name={lastVisited.name} 
                href={lastVisited.href} 
                logo={lastVisited.logo}
                onClick={() => handlePlatformClick(lastVisited)}
            />
        </div>
    </div>
  );
}
