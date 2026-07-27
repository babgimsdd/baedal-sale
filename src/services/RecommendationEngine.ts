import { Event } from '../engine/types';
import { calculateEventScore } from '../engine/rankingEngine';
import { userProfileEngine, UserProfile } from './UserProfileEngine';
import { RECOMMENDATION_WEIGHTS } from '../config/recommendationWeights';
import { locationEngine } from './LocationEngine';
import { trendingEngine } from '../engine/trendingEngine';

/**
 * 2. AI Recommendation Engine
 * 사용자 맞춤 추천, 유사 이벤트 추천, 최근 24시간 실시간 인기 이벤트를 자동 산출하고 캐싱합니다.
 */
export class RecommendationEngine {
  private cache: Map<string, { timestamp: number; result: Event[] }> = new Map();
  private CACHE_TTL_MS = 3 * 60 * 1000; // 3분 캐시

  /**
   * 이벤트와 사용자 프로필 간 개인화 맞춤 추천 점수를 계산합니다.
   */
  public calculatePersonalizedScore(event: Event, profile: UserProfile): number {
    let score = calculateEventScore(event, profile.location);

    // 1. 브랜드 선호도 반영
    if (event.brand && profile.brandAffinities[event.brand]) {
      const affinity = Math.min(profile.brandAffinities[event.brand], 10);
      score += (affinity / 10) * RECOMMENDATION_WEIGHTS.BRAND_MATCH;
    }

    // 2. 배달 플랫폼 선호도 반영
    if (event.platform && profile.platformAffinities[event.platform]) {
      const affinity = Math.min(profile.platformAffinities[event.platform], 10);
      score += (affinity / 10) * RECOMMENDATION_WEIGHTS.PLATFORM_MATCH;
    }

    // 3. 무료배달 / 고할인 선호성 가산
    if (event.freeDelivery && profile.clickedEventIds.length > 0) {
      score += RECOMMENDATION_WEIGHTS.FREE_DELIVERY_PREF;
    }

    if (event.discountRate && event.discountRate >= 50) {
      score += RECOMMENDATION_WEIGHTS.HIGH_DISCOUNT_PREF;
    }

    // 4. 위치 지원 여부
    if (profile.location && locationEngine.isRegionSupported(event.region, profile.location)) {
      score += RECOMMENDATION_WEIGHTS.LOCATION_MATCH;
    }

    return score;
  }

  /**
   * 3. Home Feed 용 개인화 추천 리스트 산출 (캐시 적용)
   */
  public getPersonalizedFeed(events: Event[]): Event[] {
    const profile = userProfileEngine.getProfile();
    const cacheKey = `feed_${profile.updatedAt}_${events.length}`;

    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
      return cached.result;
    }

    const scoredEvents = events.map((event) => ({
      ...event,
      personalizedScore: this.calculatePersonalizedScore(event, profile),
    }));

    const sorted = scoredEvents.sort((a, b) => b.personalizedScore - a.personalizedScore);

    this.cache.set(cacheKey, {
      timestamp: Date.now(),
      result: sorted,
    });

    return sorted;
  }

  /**
   * 4. Similar Event (상세 화면 연관 추천: 같은 브랜드/플랫폼/음식)
   */
  public getSimilarEvents(targetEvent: Event, allEvents: Event[], limit: number = 4): Event[] {
    return allEvents
      .filter((e) => e.id !== targetEvent.id && e.status === 'ACTIVE')
      .map((e) => {
        let similarity = 0;
        if (e.brand === targetEvent.brand) similarity += 50;
        if (e.platform === targetEvent.platform) similarity += 30;
        if (e.eventType === targetEvent.eventType) similarity += 20;
        return { event: e, similarity };
      })
      .filter((item) => item.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map((item) => item.event);
  }

  /**
   * 5. Recently Popular (최근 24시간 실시간 인기도 기반 추천)
   */
  public getRecentlyPopularFeed(events: Event[], limit: number = 10): Event[] {
    return trendingEngine.sortEventsByTrending(events, 24).slice(0, limit);
  }
}

export const recommendationEngine = new RecommendationEngine();
