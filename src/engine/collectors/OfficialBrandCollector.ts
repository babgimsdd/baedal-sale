import { BaseCollector } from './BaseCollector';
import { Event } from '../types';

export class OfficialBrandCollector extends BaseCollector {
  constructor() {
    super('공식 브랜드 자사앱', 30); // 30분 수집 주기
  }

  protected async fetchOfficialEvents(): Promise<Event[]> {
    const now = new Date().toISOString();
    return [
      {
        id: 'brand-bbq-001',
        platform: 'BBQ 자사앱',
        brand: 'BBQ',
        title: 'BBQ 자사앱 첫 주문 시 황금올리브치킨 4,000원 즉시 할인',
        description: 'BBQ 공식 앱 가입 고객 대상 대표 메뉴 황금올리브치킨 쿠폰 증정.',
        discountAmount: 4000,
        discountRate: 20,
        freeDelivery: false,
        coupon: 'BBQAPPNEW2026',
        minimumOrder: '20,000원 이상',
        region: ['전국'],
        startDate: '2026-07-01T00:00:00Z',
        endDate: '2026-08-31T23:59:59Z',
        eventType: 'NEW_USER',
        sourceUrl: 'https://www.bbq.co.kr',
        verified: true,
        updatedAt: now,
        createdAt: '2026-07-01T00:00:00Z',
        status: 'ACTIVE',
      },
      {
        id: 'brand-bhc-001',
        platform: 'BHC 자사앱',
        brand: 'BHC',
        title: 'BHC 공식 앱 매주 수요일 뿌링클 3,000원 할인데이',
        description: 'BHC 자사 앱 회원 대상 수요일 전용 쿠폰 자동 발행.',
        discountAmount: 3000,
        freeDelivery: false,
        minimumOrder: '18,000원 이상',
        region: ['전국'],
        startDate: '2026-07-01T00:00:00Z',
        endDate: '2026-12-31T23:59:59Z',
        eventType: 'BRAND_EVENT',
        sourceUrl: 'https://www.bhc.co.kr',
        verified: true,
        updatedAt: now,
        createdAt: '2026-07-01T00:00:00Z',
        status: 'ACTIVE',
      },
      {
        id: 'brand-kyochon-001',
        platform: '교촌치킨 자사앱',
        brand: '교촌치킨',
        title: '교촌치킨 멤버십 신규 가입 킹클럽 무료 사이드 쿠폰',
        description: '교촌치킨 자사 앱 킹클럽 멤버십 회원 가입 시 치즈볼 무료 쿠폰 증정.',
        discountAmount: 3500,
        freeDelivery: false,
        minimumOrder: '19,000원 이상',
        region: ['전국'],
        startDate: '2026-07-01T00:00:00Z',
        endDate: '2026-12-31T23:59:59Z',
        eventType: 'NEW_USER',
        sourceUrl: 'https://www.kyochon.com',
        verified: true,
        updatedAt: now,
        createdAt: '2026-07-01T00:00:00Z',
        status: 'ACTIVE',
      },
    ];
  }
}
