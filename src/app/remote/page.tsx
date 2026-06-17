'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoaderCircle, Smartphone } from 'lucide-react';
import { DashboardProvider, useDashboard } from '@/hooks/use-dashboard';

// Separate component to handle search params
function PairForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [code, setCode] = useState(searchParams.get('code') || '');
  const { setPairCode, isOnline, pairCode } = useDashboard();
  const [isConnecting, setIsConnecting] = useState(false);

  // If a code is provided in URL, automatically try to connect
  useEffect(() => {
    const urlCode = searchParams.get('code');
    if (urlCode) {
      setCode(urlCode);
      setPairCode(urlCode);
      setIsConnecting(true);
    }
  }, [searchParams, setPairCode]);

  // When we become online and we have a pair code, redirect to the editor
  useEffect(() => {
    if (isOnline && pairCode) {
      router.push(`/remote/editor?code=${pairCode}`);
    }
  }, [isOnline, pairCode, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length >= 6) {
      setIsConnecting(true);
      setPairCode(code.trim().toUpperCase());
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-20 border-primary/20 shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <Smartphone className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-3xl font-headline tracking-wide">Connect to TV</CardTitle>
        <CardDescription className="text-base mt-2">
          Enter the 6-character code shown on your TV screen to start editing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="e.g. A7K2M9"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="text-center text-3xl tracking-[0.2em] font-mono h-16 uppercase"
              maxLength={6}
              disabled={isConnecting}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full h-14 text-lg"
            disabled={code.length < 6 || isConnecting}
          >
            {isConnecting ? (
              <>
                <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              'Connect'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function RemotePage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <Suspense fallback={<div className="flex justify-center mt-20"><LoaderCircle className="animate-spin text-primary w-10 h-10" /></div>}>
        <DashboardProvider deviceType="phone">
          <PairForm />
        </DashboardProvider>
      </Suspense>
    </div>
  );
}
