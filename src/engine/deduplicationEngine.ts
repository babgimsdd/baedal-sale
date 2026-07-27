import { Event } from './types';

/**
 * 5. Deduplication Engine
 * Identifies duplicate events across platforms or collectors based on:
 * Same Platform + Same Title + Same Period (startDate ~ endDate).
 * Retains the most recent / highest verified version.
 */
export function deduplicateEvents(events: Event[]): { uniqueEvents: Event[]; removedCount: number } {
  const seenMap = new Map<string, Event>();
  let removedCount = 0;

  events.forEach((event) => {
    // Generate unique signature key
    const normalizeTitle = event.title.replace(/\s+/g, '').toLowerCase();
    const normalizePeriod = `${event.startDate.split('T')[0]}_${event.endDate.split('T')[0]}`;
    const key = `${event.platform.toLowerCase()}_${event.brand.toLowerCase()}_${normalizeTitle}_${normalizePeriod}`;

    if (seenMap.has(key)) {
      removedCount++;
      const existing = seenMap.get(key)!;
      // Replace if newly fetched event has higher discount amount/rate or fresher timestamp
      const newScore = (event.discountAmount || 0) + (event.discountRate || 0);
      const existingScore = (existing.discountAmount || 0) + (existing.discountRate || 0);

      if (newScore > existingScore || new Date(event.updatedAt).getTime() > new Date(existing.updatedAt).getTime()) {
        seenMap.set(key, event);
      }
    } else {
      seenMap.set(key, event);
    }
  });

  return {
    uniqueEvents: Array.from(seenMap.values()),
    removedCount,
  };
}
