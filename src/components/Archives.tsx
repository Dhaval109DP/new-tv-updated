'use client';

import Link from 'next/link';
import Image from 'next/image';
import { toSlug } from '@/lib/utils';


const finishedShows = [
  { name: 'Laughter Chefs 2', href: `https://www.bollyzone.to/category/${toSlug('Laughter Chefs 2')}/`, imageUrl: 'https://www.bollyzone.to/wp-content/uploads/2025/01/Laughter-Chefs-2-Poster.jpg', imageHint: 'comedy cooking' },
];

export function Archives() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-xl md:text-2xl font-bold font-headline mb-4 text-center text-muted-foreground">From the Archives</h2>
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4">
          {finishedShows.map((show) => (
            <Link
              key={show.name}
              href={show.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-all duration-300 ease-in-out group"
            >
              <div className="w-12 h-18 rounded-md overflow-hidden border-2 border-transparent group-hover:border-primary transition-colors">
                  <Image
                      src={show.imageUrl}
                      alt={`Poster for ${show.name}`}
                      width={50}
                      height={75}
                      className="w-full h-full object-cover"
                      data-ai-hint={show.imageHint}
                  />
              </div>
              <span className="text-sm font-medium group-hover:underline">{show.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
