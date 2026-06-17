'use client';

import { Clock } from './clock';
import Link from 'next/link';
import { Button } from './ui/button';
import { RefreshCw } from 'lucide-react';
import { SyncStatus } from './SyncStatus';
import { PairOverlay } from './PairOverlay';
import { useState } from 'react';

export function AppHeader() {
  const [showPairOverlay, setShowPairOverlay] = useState(false);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-6 bg-gradient-to-b from-black/70 to-transparent">
          <nav className="flex items-center gap-4">
              <Button asChild variant="ghost" className="text-lg font-semibold text-foreground/80 hover:text-foreground hover:bg-white/10">
                  <Link href="/">Home</Link>
              </Button>
              <Button asChild variant="ghost" className="text-lg font-semibold text-foreground/80 hover:text-foreground hover:bg-white/10">
                  <Link href="/watching">Now Watching</Link>
              </Button>
          </nav>
        <div className="flex items-center gap-4">
          <SyncStatus onPairClick={() => setShowPairOverlay(true)} />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className="text-foreground/80 hover:text-foreground hover:bg-white/10"
            aria-label="Refresh page"
          >
            <RefreshCw className="h-5 w-5" />
            <span className="sr-only">Refresh</span>
          </Button>
          <Clock />
        </div>
      </header>

      <PairOverlay open={showPairOverlay} onOpenChange={setShowPairOverlay} />
    </>
  );
}
