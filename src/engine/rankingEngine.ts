import { Event } from './types';
import { RANKING_WEIGHTS } from '../config/rankingWeights';
import { Region } from '../types';
import { locationEngine } from '../services/LocationEngine';

/**
 * 3. Ranking Engine (가중치 설정 기반 점수 산출 및 정렬 엔진)
 */
export function calculateEventScore(event: Event, userRegion?: Region, now: Date = new Date()): number {
  let score = 0;

  // 1. 공식 출처 검증
  if (event.verified) {
    score += RANKING_WEIGHTS.VERIFIED_OFFICIAL;
  }

  // 2. 오늘 업데이트 여부
  const updatedAtDate = event.updatedAt ? new Date(event.updatedAt) : null;
  if (updatedAtDate && isSameDay(updatedAtDate, now)) {
    score += RANKING_WEIGHTS.UPDATED_TODAY;
  }

  // 3. 무료배달 지원 여부
  if (event.freeDelivery) {
    score += RANKING_WEIGHTS.FREE_DELIVERY;
  }

  // 4. 할인율 50% 이상
  if (event.discountRate && event.discountRate >= 50) {
    score += RANKING_WEIGHTS.DISCOUNT_RATE_OVER_50;
  }

  // 5. 오늘 종료 예정 긴급 할인
  const endDate = event.endDate ? new Date(event.endDate) : null;
  if (endDate && isSameDay(endDate, now)) {
    score += RANKING_WEIGHTS.ENDING_TODAY;
  }

  // 6. 쿠폰 코드 존재 여부
  if (event.coupon) {
    score += RANKING_WEIGHTS.COUPON_PRESENT;
  }

  // 7. 신규가입 혜택
  if (event.eventType === 'NEW_USER') {
    score += RANKING_WEIGHTS.NEW_USER_BENEFIT;
  }

  // 8. 카드사 할인
  if (event.eventType === 'CARD_DISCOUNT') {
    score += RANKING_WEIGHTS.CARD_DISCOUNT;
  }

  // 9. 사용자 위치 지원 정확도 매칭
  if (userRegion && locationEngine.isRegionSupported(event.region, userRegion)) {
    score += RANKING_WEIGHTS.LOCATION_MATCH;
  }

  return score;
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * 이벤트를 Ranking 점수 높은 순으로 정렬하고 score 항목을 업데이트합니다.
 */
export function rankEvents(events: Event[], userRegion?: Region): Event[] {
  const now = new Date();
  
  const scoredEvents = events.map((ev) => {
    const calcScore = calculateEventScore(ev, userRegion, now);
    return {
      ...ev,
      score: calcScore,
    };
  });

  return scoredEvents.sort((a, b) => (b.score || 0) - (a.score || 0));
}
