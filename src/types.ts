export type MobileTab = 'home' | 'discounts' | 'favorites' | 'alerts' | 'settings' | 'admin';

export type ThemeMode = 'light' | 'dark';

export type DeliveryApp = 
  | '배달의민족'
  | '요기요'
  | '쿠팡이츠'
  | '땡겨요'
  | '먹깨비'
  | '지역 배달앱'
  | '컬리'
  | 'CJ더마켓'
  | '기타 밀키트';

export type DiscountTab = 
  | '오늘의 할인'
  | '오늘의 무료배달'
  | '신규가입 혜택'
  | '카드 할인'
  | '쿠폰'
  | '브랜드 행사'
  | '배달앱 공지사항';

export type FoodCategory = 
  | '전체'
  | '치킨'
  | '피자'
  | '햄버거'
  | '중식'
  | '일식'
  | '분식'
  | '족발/보쌈'
  | '디저트/카페'
  | '밀키트/마트'
  | '기타';

export type SortOption = 
  | 'score_desc'
  | 'discount_desc'
  | 'free_delivery'
  | 'new_user'
  | 'latest';

export interface Region {
  city: string;        // e.g. "서울특별시", "경기도", "부산광역시"
  district: string;    // e.g. "강남구", "성남시 분당구", "해운대구"
  dong?: string;       // e.g. "역삼동"
  fullAddress: string; // e.g. "서울특별시 강남구 역삼동"
  latitude?: number;
  longitude?: number;
}

export type ItemStatus = 'active' | 'expired' | 'stale' | 'link_error' | 'superseded';

export type LinkHealthStatus = '200_OK' | '404_NOT_FOUND' | '403_FORBIDDEN' | '410_GONE' | 'REDIRECTED_HOME' | 'SOLD_OUT' | 'UNCHECKED';

export interface DiscountItem {
  id: string;
  title: string;
  deliveryApp: DeliveryApp;
  tabCategory: DiscountTab;
  foodCategory: FoodCategory;
  brandName?: string;
  discountAmountText?: string; // e.g. "최대 10,000원 할인"
  discountPercent?: number;    // e.g. 25
  isFreeDelivery: boolean;
  isNewUserOnly: boolean;
  cardCompany?: string;       // e.g. "KB국민카드", "신한카드", "카카오페이"
  couponCode?: string;
  minOrderAmount?: string;     // e.g. "15,000원 이상 주문 시"
  period: string;              // e.g. "2026.07.01 ~ 2026.07.31"
  endDate?: string;            // ISO timestamp for D-Day calculation
  officialUrl: string;
  affiliateUrl?: string;       // Affiliate link if available
  noticeContent?: string;      // Detailed terms/announcement
  targetRegions: string[];     // ["전국"], ["서울특별시"], ["서울특별시 강남구"], ["서울특별시 강남구 역삼동"]
  verifiedOfficialSource: string; // e.g. "배달의민족 공식 이벤트"
  
  // Data Engine Mandatory Fields
  source: string;              // Official source publisher, e.g., "배달의민족 공식", "BBQ 자사앱"
  createdAt: string;           // ISO string timestamp
  updatedAt: string;           // ISO string timestamp (for stale calculation)
  expiresAt?: string;          // ISO string timestamp (for auto cleanup)
  status: ItemStatus;          // Item lifecycle status
  linkStatus: LinkHealthStatus; // Health of officialUrl
  score: number;               // Dynamic reliability score (0 ~ 110)
  isBestRate?: boolean;        // Automatically flagged if highest discount for brand
  duplicateOfId?: string;      // Pointing to master item if merged/deduplicated
}

export interface RecentlyViewed {
  discounts: string[];  // Item IDs
  brands: string[];     // Brand names
  categories: FoodCategory[];
}

export interface UserInterests {
  favoriteFoods: FoodCategory[];
  favoriteBrands: string[];
  favoriteApps: DeliveryApp[];
  hiddenApps: DeliveryApp[];
  savedRegions?: Region[];
}

export interface DiscountFilters {
  onlyFreeDelivery: boolean;
  minDiscount50: boolean;
  onlyWithCoupon: boolean;
  endingToday: boolean;
  onlyNewUser: boolean;
  onlyCardDiscount: boolean;
}

export interface PushNotificationConfig {
  enabled: boolean;
  notifyNewDiscount: boolean;
  notifyFreeDelivery: boolean;
  notifyCardDiscount: boolean;
  notifyMyInterestsOnly: boolean;
}

export interface DataEngineLog {
  id: string;
  timestamp: string;  // e.g. "08:03:12"
  category: 'NEW' | 'EXPIRED' | 'STALE' | 'LINK_ERROR' | 'DEDUP' | 'BEST_RATE';
  message: string;
  itemId?: string;
  source?: string;
}

export interface AdminStats {
  totalEvents: number;
  activeEvents: number;
  deactivatedEvents: number;
  linkErrorEvents: number;
  addedToday: number;
  expiringToday: number;
  platformCounts: Record<string, number>;
  averageScore: number;
}

export interface AiSeoRequest {
  topic: string;
  targetApp?: string;
  region?: string;
}

export interface AiSeoResponse {
  title: string;
  description: string;
  keywords: string[];
  summary: string;
}

