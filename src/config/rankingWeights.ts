/**
 * Ranking Engine Score Weights Configuration
 * 대한민국 배달 할인 추천 엔진 가중치 설정을 집중 관리합니다.
 */
export const RANKING_WEIGHTS = {
  VERIFIED_OFFICIAL: 50,    // 공식 출처 검증 이벤트
  DISCOUNT_RATE_OVER_50: 30, // 50% 이상 할인
  UPDATED_TODAY: 20,         // 오늘 업데이트된 이벤트
  ENDING_TODAY: 15,          // 오늘 종료되는 긴급 할인
  FREE_DELIVERY: 10,         // 무료 배달
  COUPON_PRESENT: 10,        // 전용 쿠폰 코드 존재
  NEW_USER_BENEFIT: 10,      // 신규 가입 혜택
  CARD_DISCOUNT: 10,         // 카드사 제휴 할인
  LOCATION_MATCH: 25,        // 사용자 지역 지원 정확도 매칭
};
