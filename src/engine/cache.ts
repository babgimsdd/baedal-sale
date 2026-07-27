import { Event } from './types';

export interface CacheEntry<T> {
  timestamp: number;
  data: T;
  ttlMs: number;
}

/**
 * 9. In-Memory & Storage Data Cache Engine
 * Caches collected events and validation results per platform to prevent redundant network fetches.
 */
export class DataCache {
  private memoryCache: Map<string, CacheEntry<any>> = new Map();

  public get<T>(key: string): T | null {
    const entry = this.memoryCache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttlMs) {
      this.memoryCache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  public set<T>(key: string, data: T, ttlMinutes: number = 30): void {
    this.memoryCache.set(key, {
      timestamp: Date.now(),
      data,
      ttlMs: ttlMinutes * 60 * 1000,
    });
  }

  public clear(): void {
    this.memoryCache.clear();
  }
}

export const dataCache = new DataCache();
