import { useMemo, useCallback } from 'react';
import { Event } from '../engine/types';
import { recommendationEngine } from '../services/RecommendationEngine';
import { userProfileEngine } from '../services/UserProfileEngine';

/**
 * React Hook for Personalized Feed and Interaction Analytics
 */
export function usePersonalizedFeed(allEvents: Event[]) {
  // 1. Memoized Personalized Feed
  const personalizedFeed = useMemo(() => {
    return recommendationEngine.getPersonalizedFeed(allEvents);
  }, [allEvents]);

  // 2. Memoized Recently Popular Feed
  const recentlyPopularFeed = useMemo(() => {
    return recommendationEngine.getRecentlyPopularFeed(allEvents, 10);
  }, [allEvents]);

  // 3. Helper to fetch similar events for a target event
  const getSimilarEvents = useCallback(
    (targetEvent: Event, limit: number = 4) => {
      return recommendationEngine.getSimilarEvents(targetEvent, allEvents, limit);
    },
    [allEvents]
  );

  // 4. Interaction Trackers
  const trackView = useCallback((event: Event) => {
    userProfileEngine.trackInteraction(event.id, 'VIEW', event.brand, event.platform, event.eventType);
  }, []);

  const trackClick = useCallback((event: Event) => {
    userProfileEngine.trackInteraction(event.id, 'CLICK', event.brand, event.platform, event.eventType);
  }, []);

  const trackSave = useCallback((event: Event) => {
    userProfileEngine.trackInteraction(event.id, 'SAVE', event.brand, event.platform, event.eventType);
  }, []);

  return {
    personalizedFeed,
    recentlyPopularFeed,
    getSimilarEvents,
    trackView,
    trackClick,
    trackSave,
  };
}
