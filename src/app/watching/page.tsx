'use client';

import { useState, useEffect, ReactNode } from 'react';
import { AppHeader } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { Skeleton } from '@/components/ui/skeleton';
import { BollyzoneLogo } from '@/components/bollyzone-logo';
import { DesiCinemasLogo } from '@/components/desi-cinemas-logo';
import { PlayDesiLogo } from '@/components/play-desi-logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

interface Platform {
  name: string;
  href: string;
  logo: ReactNode;
}

const favoritePlatforms: Platform[] = [
  { name: 'Desi Cinemas', href: 'https://desicinemas.to/', logo: <DesiCinemasLogo /> },
  { name: 'Bollyzone', href: 'https://www.bollyzone.to/', logo: <BollyzoneLogo /> },
  { name: 'Play Desi!', href: 'https://playdesi.info/', logo: <PlayDesiLogo /> },
];

export default function WatchingPage() {
  const [lastVisited, setLastVisited] = useState<Platform | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This code runs only on the client, after the component has mounted.
    let platformToSet: Platform | null = null;
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
    }
    setLastVisited(platformToSet);
    setIsLoading(false);
  }, []);

  const renderContent = () => {
    if (isLoading) {
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
    if (lastVisited) {
        return <HeroSection lastVisited={lastVisited} />;
    }
    return (
        <div className="flex-1 flex items-center justify-center text-center">
            <div className="max-w-xl">
                <h1 className="text-2xl md:text-3xl font-semibold text-foreground/90 mb-4">You haven't watched anything yet.</h1>
                <p className="text-lg text-muted-foreground mb-8">Go back home to select a platform to watch.</p>
                <Button asChild size="lg">
                    <Link href="/">
                        <Home className="mr-2 h-5 w-5" /> Go to Home
                    </Link>
                </Button>
            </div>
        </div>
    );
  }

  return (
    <div className="bg-background selection:bg-primary selection:text-primary-foreground">
      <AppHeader />
      <main className="flex min-h-screen flex-col">
        {renderContent()}
      </main>
    </div>
  );
}
