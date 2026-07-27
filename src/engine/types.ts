export interface DataSourceConfig {
  id: string;
  name: string;
  platform: string;
  brand?: string;
  type: 'PLATFORM' | 'BRAND' | 'MALL';
  officialUrl: string;
  eventPageUrl?: string;
  noticeUrl?: string;
  enabled: boolean;
  updateInterval: number; // 수집 주기 (분)
  parser: string;
  priority: number;
  collectibleStatus: 'AVAILABLE' | 'API_READY' | 'HTML_PARSER' | 'MANUAL_OFFICIAL';
  notes?: string;
}

export type EventType = 
  | 'NEW_USER'          // 신규가입
  | 'FREE_DELIVERY'     // 무료배달
  | 'TIP_DISCOUNT'      // 배달팁 할인
  | 'COUPON'            // 할인 쿠폰
  | 'CARD_DISCOUNT'     // 카드사 할인
  | 'BRAND_EVENT'       // 브랜드 특별전
  | 'LIMITED_TIME'      // 기간 한정 타임딜
  | 'ANNOUNCEMENT';     // 공식 공지사항

export interface Event {
  id: string;
  platform: string;          // 예: "배달의민족", "요기요", "쿠팡이츠", "땡겨요", "마켓컬리", "CJ더마켓", "BBQ"
  brand: string;             // 예: "BBQ", "BHC", "교촌치킨", "도미노피자", "자사공식"
  title: string;             // 프로모션 제목
  description: string;       // 상세 내용
  discountRate?: number;     // 할인율 (%)
  discountAmount?: number;   // 할인 금액 (원)
  freeDelivery: boolean;     // 무료 배달 여부
  coupon?: string;           // 쿠폰 코드
  minimumOrder?: string;     // 최소 주문 금액
  region: string[];          // 적용 지역 (예: ["전국"], ["서울특별시"])
  startDate: string;         // 시작일 (ISO 8601)
  endDate: string;           // 종료일 (ISO 8601)
  eventType: EventType;      // 이벤트 유형
  sourceUrl: string;         // 공식 이벤트 원본 URL
  image?: string;            // 배너 이미지 URL
  verified: boolean;         // 공식 출처 검증 여부 (true)
  updatedAt: string;         // 갱신 일시 (ISO 8601)
  createdAt: string;         // 최초 수집 일시 (ISO 8601)
  status: 'ACTIVE' | 'EXPIRED' | 'DEAD_LINK' | 'REPLACED';
  score?: number;            // 랭킹 점수 (Ranking Engine 산출)
}

export interface CollectorStatus {
  platform: string;
  scheduleMinutes: number;   // 수집 주기 (분)
  lastRunAt: string | null;
  nextRunAt: string | null;
  totalCollected: number;
  successCount: number;
  failureCount: number;
  lastError?: string;
  status: 'IDLE' | 'RUNNING' | 'ERROR';
}

export interface CollectorResult {
  platform: string;
  events: Event[];
  collectedAt: string;
  error?: string;
}

export interface PipelineSummary {
  timestamp: string;
  totalFetched: number;
  validCount: number;
  dedupedCount: number;
  deadLinkCount: number;
  autoReplacedCount: number;
  finalActiveCount: number;
}
