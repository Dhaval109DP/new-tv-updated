
'use client';

import Image from 'next/image';

export function Hero() {
  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] tv:h-[55vh] overflow-hidden">
      <Image
        src="https://picsum.photos/seed/hero/1920/1080"
        alt="Hero background"
        fill
        className="object-cover"
        data-ai-hint="movie collage"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent z-10" />
    </div>
  );
}
