'use client';

import { ContentCarousel } from './content-carousel';
import { PosterCard } from './poster-card';
import { toSlug } from '@/lib/utils';

const trendingShows = [
  { name: 'Pati Patni Aur Panga', href: 'https://www.bollyzone.to/category/pati-patni-aur-panga/', imageUrl: 'https://www.bollyzone.to/wp-content/uploads/2025/07/Pati-Patni-Aur-Panga-Poster.jpg', imageHint: 'comedy drama series' },
];

export function TrendingSection() {
  return (
    <section className="container mx-auto px-6">
        <ContentCarousel title="Trending Now">
            {trendingShows.map((show, index) => (
                <PosterCard 
                    key={show.name}
                    href={show.href}
                    imageUrl={show.imageUrl}
                    name={show.name}
                    imageHint={show.imageHint}
                    priority={index < 3}
                />
            ))}
        </ContentCarousel>
    </section>
  );
}
