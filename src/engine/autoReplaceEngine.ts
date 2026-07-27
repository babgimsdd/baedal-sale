import { Event } from './types';

/**
 * 7. Auto Replace Engine
 * Detects expired events (endDate < now).
 * If a newer active event exists for the same Brand + Platform + EventType, automatically replaces it with the new event.
 * If no replacement exists, sets status to 'EXPIRED' so it is excluded from the public feed.
 */
export function processAutoReplacement(events: Event[], nowMs: number = Date.now()): {
  processedEvents: Event[];
  expiredCount: number;
  replacedCount: number;
} {
  let expiredCount = 0;
  let replacedCount = 0;

  // Group active candidates by Platform + Brand
  const activeCandidatesMap = new Map<string, Event[]>();

  events.forEach((item) => {
    const endMs = new Date(item.endDate).getTime();
    if (endMs >= nowMs && item.status !== 'DEAD_LINK') {
      const key = `${item.platform.toLowerCase()}_${item.brand.toLowerCase()}`;
      if (!activeCandidatesMap.has(key)) activeCandidatesMap.set(key, []);
      activeCandidatesMap.get(key)!.push(item);
    }
  });

  const processedEvents = events.map((item) => {
    const endMs = new Date(item.endDate).getTime();
    const isExpired = nowMs > endMs;

    if (isExpired && item.status === 'ACTIVE') {
      expiredCount++;
      const key = `${item.platform.toLowerCase()}_${item.brand.toLowerCase()}`;
      const candidates = activeCandidatesMap.get(key) || [];

      // Find best active candidate
      const replacement = candidates.find(
        (c) => c.id !== item.id && (c.discountAmount || 0) >= (item.discountAmount || 0)
      );

      if (replacement) {
        replacedCount++;
        return {
          ...item,
          status: 'REPLACED' as const,
        };
      } else {
        return {
          ...item,
          status: 'EXPIRED' as const,
        };
      }
    }

    return item;
  });

  return {
    processedEvents,
    expiredCount,
    replacedCount,
  };
}
