/**
 * Personalization Recommendation Weights Configuration
 */
export const RECOMMENDATION_WEIGHTS = {
  BRAND_MATCH: 30,         // 관심 브랜드 일치
  CATEGORY_MATCH: 20,      // 관심 카테고리 일치
  PLATFORM_MATCH: 15,      // 관심 플랫폼 일치
  HIGH_DISCOUNT_PREF: 20,  // 고할인 선호 유저 가산점
  FREE_DELIVERY_PREF: 15,  // 무료배달 선호 유저 가산점
  LOCATION_MATCH: 30,      // 사용자 설정 위치 지원
  RECENTLY_POPULAR_MAX: 20,// 24시간 실시간 인기 가산점 최대치
};
