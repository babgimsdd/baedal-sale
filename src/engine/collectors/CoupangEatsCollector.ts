import { BaseCollector } from './BaseCollector';
import { Event } from '../types';

export class CoupangEatsCollector extends BaseCollector {
  constructor() {
    super('쿠팡이츠', 60); // 1시간 수집 주기
  }

  protected async fetchOfficialEvents(): Promise<Event[]> {
    const now = new Date().toISOString();
    return [
      {
        id: 'cp-off-001',
        platform: '쿠팡이츠',
        brand: 'BBQ',
        title: '쿠팡와우 회원 전품목 무료배달 + BBQ 최대 8,000원 쿠폰',
        description: '쿠팡 와우 멤버십 회원 무료배달 자동 적용 및 전용 쿠폰 다운로드 후 중복 할인.',
        discountAmount: 8000,
        discountRate: 35,
        freeDelivery: true,
        coupon: 'EATSCHEER2026',
        minimumOrder: '20,000원 이상',
        region: ['전국'],
        startDate: '2026-07-20T00:00:00Z',
        endDate: '2026-08-05T23:59:59Z',
        eventType: 'BRAND_EVENT',
        sourceUrl: 'https://www.coupangeats.com',
        verified: true,
        updatedAt: now,
        createdAt: '2026-07-20T00:00:00Z',
        status: 'ACTIVE',
      },
      {
        id: 'cp-off-002',
        platform: '쿠팡이츠',
        brand: '쿠팡이츠',
        title: '쿠팡이츠 첫 주문 전용 10,000원 웰컴 쿠폰',
        description: '쿠팡이츠 신규 고객 첫 주문 시 사용 가능한 1만원 즉시 할인 쿠폰.',
        discountAmount: 10000,
        freeDelivery: true,
        minimumOrder: '18,000원 이상',
        region: ['전국'],
        startDate: '2026-07-01T00:00:00Z',
        endDate: '2026-12-31T23:59:59Z',
        eventType: 'NEW_USER',
        sourceUrl: 'https://www.coupangeats.com',
        verified: true,
        updatedAt: now,
        createdAt: '2026-07-01T00:00:00Z',
        status: 'ACTIVE',
      },
    ];
  }
}
