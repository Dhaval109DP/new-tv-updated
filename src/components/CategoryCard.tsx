'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { toSlug } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { StatusDot } from '@/components/StatusDot';
import { SiteStatus } from '@/hooks/use-site-status';

import { Star } from 'lucide-react';

interface ContentLink {
  title: string;
  url?: string;
}

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  link: string;
  platform: string;
  logo?: ReactNode;
  featuredContent?: ContentLink[];
  gradient: string;
  siteStatus?: SiteStatus;
  isPinned?: boolean;
  onTogglePin?: () => void;
}

export function CategoryCard({ icon: Icon, title, link, platform, logo, featuredContent, gradient, siteStatus, isPinned, onTogglePin }: CategoryCardProps) {
    
  const platformLinkGenerators: {[key: string]: (title: string) => string} = {
    'Desi Cinemas': (title: string) => `https://desicinemas.to/movies/${toSlug(title)}/`,
    'Bollyzone': (title: string) => `https://www.bollyzone.to/category/${toSlug(title)}/`,
    'PlayDesi!': (title: string) => `https://playdesi.info/series/${toSlug(title)}/`,
    'Dailymotion': (title: string) => `https://www.dailymotion.com/search/${toSlug(title)}`,
  };

  const generateLink = platformLinkGenerators[platform] || ((title: string) => `https://google.com/search?q=${encodeURIComponent(title)}`);

  return (
    <div className="group relative h-full tv-card-focus" tabIndex={0}>
      <Card className={cn("h-full bg-card/80 backdrop-blur-sm border-border/50 rounded-xl transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-primary/20 group-hover:border-primary/50 focus-within:scale-105 focus-within:shadow-2xl focus-within:shadow-primary/20 focus-within:border-primary/50", gradient)}>
        <Link href={link} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10" aria-label={`Go to ${platform}`} tabIndex={-1}>
          <span className="sr-only">Go to {platform}</span>
        </Link>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Icon className="h-8 w-8 tv:h-10 tv:w-10 text-primary" />
            </div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl tv:text-3xl font-headline tracking-wide">{title}</CardTitle>
              {siteStatus && <StatusDot status={siteStatus} />}
            </div>
          </div>
          {onTogglePin && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onTogglePin();
              }}
              className="relative z-30 p-1 text-muted-foreground hover:text-yellow-400 focus-visible:text-yellow-400 transition-colors"
              title={isPinned ? "Unpin category" : "Pin category to top"}
              aria-label={isPinned ? "Unpin category" : "Pin category to top"}
            >
              <Star className={cn("w-5 h-5", isPinned ? "fill-yellow-400 text-yellow-400" : "")} />
            </button>
          )}
        </CardHeader>
        <CardContent>
          {logo ? (
            <div className="mb-4">{logo}</div>
          ) : (
            <p className="text-lg tv:text-xl text-muted-foreground mb-4">
              Watch the latest on <span className="font-semibold text-foreground">{platform}</span>.
            </p>
          )}
          {featuredContent && featuredContent.length > 0 && (
            <>
              <Separator className="my-4 bg-border/50" />
              <div className="relative z-20 space-y-3">
                <h3 className="font-semibold text-primary tv:text-lg">Featured Content</h3>
                <ul className="space-y-2">
                  {featuredContent.map((content) => (
                    <li key={content.title}>
                      <Link
                        href={content.url ? content.url : generateLink(content.title)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group/sublink text-foreground hover:text-primary focus-visible:text-primary transition-colors text-base tv:text-lg rounded-md"
                      >
                        <span className="font-medium group-hover/sublink:underline underline-offset-4">
                          {content.title}
                           {' \u2192'}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
