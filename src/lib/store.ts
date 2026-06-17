import { DashboardState, DEFAULT_DASHBOARD_STATE } from './types';

const STORAGE_KEY = 'dashboard_state';

/**
 * Loads the dashboard state from localStorage, handling migrations from old keys.
 */
export function loadState(): DashboardState {
  if (typeof window === 'undefined') return DEFAULT_DASHBOARD_STATE;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Basic merge to ensure missing fields in old versions get default values
      return { ...DEFAULT_DASHBOARD_STATE, ...parsed };
    }

    // Migration: If no new state exists, check for old keys
    const oldPlatform = localStorage.getItem('lastVisitedPlatform');
    const oldSearches = localStorage.getItem('savedSearches');
    
    let migrated = false;
    const initialState = { ...DEFAULT_DASHBOARD_STATE };

    if (oldPlatform) {
      try {
        initialState.lastVisitedPlatform = JSON.parse(oldPlatform);
        migrated = true;
      } catch (e) {
        console.warn('Failed to migrate lastVisitedPlatform', e);
      }
    }

    if (oldSearches) {
      try {
        initialState.savedSearches = JSON.parse(oldSearches);
        migrated = true;
      } catch (e) {
        console.warn('Failed to migrate savedSearches', e);
      }
    }

    if (migrated) {
      // Save the migrated state immediately
      saveState(initialState);
      // Clean up old keys (optional, but good for tidiness)
      // localStorage.removeItem('lastVisitedPlatform');
      // localStorage.removeItem('savedSearches');
    }

    return initialState;
  } catch (error) {
    console.error('Failed to load dashboard state:', error);
    return DEFAULT_DASHBOARD_STATE;
  }
}

/**
 * Saves the dashboard state to localStorage.
 */
export function saveState(state: DashboardState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save dashboard state:', error);
  }
}
