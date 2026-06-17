// ============================================================
// Shared platform data & link generators
// Eliminates duplication across components
// ============================================================

import { toSlug } from './utils';

export interface PlatformInfo {
  name: string;
  href: string;
  /** Generates a deep link to content on this platform */
  generateLink: (title: string) => string;
}

/** All supported platforms with their link generators */
export const PLATFORMS: Record<string, PlatformInfo> = {
  'Desi Cinemas': {
    name: 'Desi Cinemas',
    href: 'https://desicinemas.to/',
    generateLink: (title: string) =>
      `https://desicinemas.to/movies/${toSlug(title)}/`,
  },
  'Bollyzone': {
    name: 'Bollyzone',
    href: 'https://www.bollyzone.to/',
    generateLink: (title: string) =>
      `https://www.bollyzone.to/category/${toSlug(title)}/`,
  },
  'Play Desi!': {
    name: 'Play Desi!',
    href: 'https://playdesi.info/',
    generateLink: (title: string) =>
      `https://playdesi.info/series/${toSlug(title)}/`,
  },
  'Dailymotion': {
    name: 'Dailymotion',
    href: 'https://www.dailymotion.com/au',
    generateLink: (title: string) =>
      `https://www.dailymotion.com/search/${toSlug(title)}`,
  },
  'T-Flix': {
    name: 'T-Flix',
    href: 'https://tv.tflix.app/',
    generateLink: (_title: string) => `https://tv.tflix.app/`,
  },
};

/** Convenience: get link generators as a simple object (for backward compat) */
export const platformLinkGenerators: Record<string, (title: string) => string> =
  Object.fromEntries(
    Object.entries(PLATFORMS).map(([key, p]) => [key, p.generateLink])
  );

/** Favorite platforms for "Continue Watching" / platform buttons */
export const FAVORITE_PLATFORMS = [
  { name: 'Desi Cinemas', href: 'https://desicinemas.to/' },
  { name: 'Bollyzone', href: 'https://www.bollyzone.to/' },
  { name: 'Play Desi!', href: 'https://playdesi.info/' },
  { name: 'Dailymotion', href: 'https://www.dailymotion.com/au' },
] as const;
