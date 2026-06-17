// ============================================================
// Desi Media Hub — Centralized Type Definitions
// ============================================================

// --- Dashboard State (persisted in localStorage + synced via PartyKit) ---

export interface DashboardState {
  /** Schema version for forward-compatible migrations */
  version: number;
  /** Unix timestamp of last modification */
  lastModified: number;
  /** Which device made the last change */
  modifiedBy: 'tv' | 'phone';

  // --- Migrated from old localStorage keys ---
  lastVisitedPlatform: StoredPlatform | null;
  savedSearches: string[];

  // --- Notes ---
  notes: Note[];

  // --- Tasks / Checklist ---
  tasks: Task[];

  // --- Quick Links / Bookmarks ---
  quickLinks: QuickLink[];

  // --- Timers / Countdowns ---
  timers: TimerItem[];

  // --- Announcements (phone → TV messages) ---
  announcements: Announcement[];

  // --- Categories config (visibility, custom featured content) ---
  categoryOverrides: Record<string, CategoryOverride>;

  // --- Trending shows (editable list) ---
  customTrendingShows: TrendingShow[];

  // --- Settings ---
  settings: DashboardSettings;

  // --- AI Recommendations ---
  aiData: AIRecommendationData | null;

  // --- Custom Categories ---
  customCategories: CustomCategory[];

  // --- Casted Links (phone → TV clickable links) ---
  castedLinks: CastedLink[];
}

// --- Sub-types ---

export interface CustomCategory {
  id: string;
  title: string;
  platform: string;
  link: string;
  icon: string; // string identifier for icon
  featuredContent: { title: string; url?: string }[];
  gradient: string;
  visible: boolean;
  order: number;
}

export interface CastedLink {
  id: string;
  url: string;
  title: string;
  sentAt: number;
  bookmarked: boolean;
}

export interface AIRecommendationData {
  history: string;
  results: {
    title: string;
    platform: "Desi Cinemas" | "Bollyzone" | "Play Desi!" | "Dailymotion" | "T-Flix";
    genre: string;
    reason: string;
  }[];
  timestamp: number;
}

export interface StoredPlatform {
  name: string;
  href: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: number;
  updatedAt: number;
  pinned: boolean;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  completedAt: number | null;
}

export interface QuickLink {
  id: string;
  title: string;
  url: string;
  icon?: string;
  color?: string;
  order: number;
}

export interface TimerItem {
  id: string;
  label: string;
  /** Target timestamp (for countdown) or duration in seconds (for timer) */
  targetTime: number;
  type: 'countdown' | 'stopwatch';
  createdAt: number;
  active: boolean;
}

export interface Announcement {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  createdAt: number;
  dismissedAt: number | null;
}

export interface CategoryOverride {
  visible: boolean;
  customFeaturedContent?: { title: string; url?: string }[];
}

export interface TrendingShow {
  id: string;
  name: string;
  href: string;
  imageUrl: string;
  imageHint: string;
  order: number;
}

export interface DashboardSettings {
  theme: 'dark' | 'light';
  accentColor: string;
  widgetVisibility: {
    notes: boolean;
    tasks: boolean;
    quickLinks: boolean;
    timers: boolean;
    announcements: boolean;
    trending: boolean;
    archives: boolean;
    aiRecommendations: boolean;
  };
  widgetOrder: string[];
}

// --- Connected Devices ---

export interface ConnectedDevice {
  id: string;
  name: string;
  color: string;
  connectedAt: number;
}

// Device color palette for up to 6 phones
export const DEVICE_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#ec4899'];

// --- Sync Messages ---

export type SyncMessage =
  | { type: 'init'; state: DashboardState; device: DeviceType }
  | { type: 'join'; device: DeviceType; deviceId?: string; deviceName?: string }
  | { type: 'update'; patch: Partial<DashboardState>; timestamp: number }
  | { type: 'sync'; state: DashboardState }
  | { type: 'device_connected'; device: DeviceType }
  | { type: 'device_disconnected'; device: DeviceType }
  | { type: 'device_list'; devices: ConnectedDevice[] }
  | { type: 'open_url'; url: string }
  | { type: 'request_state' }
  | { type: 'ping' }
  | { type: 'pong' };

export type DeviceType = 'tv' | 'phone';

// --- Default State ---

export const DEFAULT_DASHBOARD_STATE: DashboardState = {
  version: 1,
  lastModified: Date.now(),
  modifiedBy: 'tv',
  lastVisitedPlatform: null,
  savedSearches: [],
  notes: [],
  tasks: [],
  quickLinks: [],
  timers: [],
  announcements: [],
  categoryOverrides: {},
  customTrendingShows: [],
  aiData: null,
  customCategories: [],
  castedLinks: [],
  settings: {
    theme: 'dark',
    accentColor: '#E63946',
    widgetVisibility: {
      notes: true,
      tasks: true,
      quickLinks: true,
      timers: true,
      announcements: true,
      trending: true,
      archives: true,
      aiRecommendations: true,
    },
    widgetOrder: [
      'announcements',
      'quickLinks',
      'notes',
      'tasks',
      'timers',
      'trending',
      'aiRecommendations',
      'archives',
    ],
  },
};
