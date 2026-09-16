'use client';

import { ContentCarousel } from './content-carousel';
import { PosterCard } from './poster-card';
import { useDashboard } from '@/hooks/use-dashboard';

export function TrendingSection() {
  const { state } = useDashboard();
  const showsToDisplay = state.customTrendingShows || [];

  if (showsToDisplay.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-6">
        <ContentCarousel title="Trending Now">
            {showsToDisplay.map((show, index) => (
                <PosterCard 
                    key={show.id || show.name}
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
