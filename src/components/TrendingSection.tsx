'use client';

import { ContentCarousel } from './content-carousel';
import { PosterCard } from './poster-card';
import { toSlug } from '@/lib/utils';

const trendingShows = [
  { name: 'Pati Patni Aur Panga', href: 'https://www.bollyzone.to/category/pati-patni-aur-panga/', imageUrl: 'https://www.bollyzone.to/wp-content/uploads/2025/07/Pati-Patni-Aur-Panga-Poster.jpg', imageHint: 'comedy drama series' },
  { name: 'Laughter Chefs 2', href: 'https://www.bollyzone.to/category/laughter-chefs-2/', imageUrl: 'https://www.bollyzone.to/wp-content/uploads/2025/01/Laughter-Chefs-2-Poster.jpg', imageHint: 'comedy cooking show' },
  { name: 'Bigg Boss OTT 3', href: 'https://www.bollyzone.to/category/bigg-boss-ott-3/', imageUrl: 'https://www.bollyzone.to/wp-content/uploads/2024/06/Bigg-Boss-OTT-3.webp', imageHint: 'reality tv show' },
  { name: 'Khatron Ke Khiladi 14', href: 'https://www.bollyzone.to/category/khatron-ke-khiladi-14/', imageUrl: 'https://www.bollyzone.to/wp-content/uploads/2024/07/Khatron-Ke-Khiladi-14.webp', imageHint: 'stunt reality show' },
  { name: 'Panchayat Season 3', href: 'https://playdesi.info/series/panchayat-season-3/', imageUrl: 'https://image.tmdb.org/t/p/w342/2LIxqJuloAniMO8cFev3mfKiQoN.jpg', imageHint: 'comedy drama village' },
  { name: 'Mirzapur', href: 'https://playdesi.info/series/mirzapur/', imageUrl: 'https://image.tmdb.org/t/p/w342/kFDEMqAMXl0k3YAXO7jEi6JhMmB.jpg', imageHint: 'crime thriller' },
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
