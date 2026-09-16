'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Film, Tv, MonitorPlay, Video, ExternalLink } from 'lucide-react';
import { searchLocalContent } from '@/lib/content-database';
import { toSlug } from '@/lib/utils';
import Link from 'next/link';

const platformLinks = {
  'Desi Cinemas': (title: string) => `https://desicinemas.to/movies/${toSlug(title)}/`,
  'Bollyzone': (title: string) => `https://www.bollyzone.to/category/${toSlug(title)}/`,
  'PlayDesi!': (title: string) => `https://playdesi.info/series/${toSlug(title)}/`,
  'Dailymotion': (title: string) => `https://www.dailymotion.com/search/${toSlug(title)}`,
};

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length >= 2) {
      const matches = searchLocalContent(query);
      setResults(matches);
      setIsOpen(matches.length > 0);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div ref={containerRef} className="relative" id="search-bar">
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus-within:border-primary/50 focus-within:bg-white/10 transition-all">
        <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search movies, shows..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-32 lg:w-48 tv:w-64"
          id="search-input"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 min-w-[320px] bg-card/95 backdrop-blur-md border border-border/50 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-[100]">
          <div className="p-2 space-y-1 max-h-[400px] overflow-y-auto">
            {results.map((title) => (
              <div
                key={title}
                className="rounded-lg p-3 hover:bg-primary/10 focus-within:bg-primary/10 transition-colors"
              >
                <p className="font-medium text-sm text-foreground mb-2">{title}</p>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(platformLinks).map(([platform, linkFn]) => (
                    <Link
                      key={platform}
                      href={linkFn(title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md bg-white/5 border border-white/10 text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {platform}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
