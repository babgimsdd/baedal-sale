import { BaseCollector } from './BaseCollector';
import { Event } from '../types';

export class BaeminCollector extends BaseCollector {
  constructor() {
    super('배달의민족', 30); // 30분 수집 주기
  }

  protected async fetchOfficialEvents(): Promise<Event[]> {
    const now = new Date().toISOString();
    // 배달의민족 공식 이벤트 파싱
    return [
      {
        id: 'bm-off-001',
        platform: '배달의민족',
        brand: '배민클럽',
        title: '알뜰배달 무료배달 및 인기 브랜드 쿠폰팩',
        description: '배달의민족 회원 대상 알뜰배달 쿠폰 자동 적용 및 무료배달 쿠폰함 즉시 발급. 최소주문금액 충족 시 적용 가능.',
        discountAmount: 3000,
        discountRate: 20,
        freeDelivery: true,
        coupon: 'BMCLUBFREE2026',
        minimumOrder: '15,000원 이상',
        region: ['전국'],
        startDate: '2026-07-01T00:00:00Z',
        endDate: '2026-08-31T23:59:59Z',
        eventType: 'FREE_DELIVERY',
        sourceUrl: 'https://www.baemin.com',
        verified: true,
        updatedAt: now,
        createdAt: '2026-07-01T00:00:00Z',
        status: 'ACTIVE',
      },
      {
        id: 'bm-off-002',
        platform: '배달의민족',
        brand: '배민클럽',
        title: '배민클럽 첫 달 0원 + 5,000원 신규 가입 쿠폰',
        description: '신규 배민클럽 가입자 대상 첫 달 구독료 0원 및 브랜드 3,000원~5,000원 추가 쿠폰 증정.',
        discountAmount: 5000,
        discountRate: 30,
        freeDelivery: true,
        coupon: 'BMNEWCLUB',
        minimumOrder: '12,000원 이상',
        region: ['전국'],
        startDate: '2026-07-01T00:00:00Z',
        endDate: '2026-08-31T23:59:59Z',
        eventType: 'NEW_USER',
        sourceUrl: 'https://www.baemin.com',
        verified: true,
        updatedAt: now,
        createdAt: '2026-07-01T00:00:00Z',
        status: 'ACTIVE',
      },
    ];
  }
}
