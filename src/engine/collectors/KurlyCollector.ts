import { BaseCollector } from './BaseCollector';
import { Event } from '../types';

export class KurlyCollector extends BaseCollector {
  constructor() {
    super('마켓컬리', 120); // 2시간 수집 주기
  }

  protected async fetchOfficialEvents(): Promise<Event[]> {
    const now = new Date().toISOString();
    return [
      {
        id: 'kl-off-001',
        platform: '마켓컬리',
        brand: '컬리공식',
        title: '컬리 뷰티/푸드 첫 주문 1,000원 딜 + 첫 구매 무료배달',
        description: '컬리 신규 회원 대상 인기 간편식/밀키트 1,000원 구매 쿠폰 제공 및 첫 주문 무료배달.',
        discountAmount: 10000,
        discountRate: 50,
        freeDelivery: true,
        coupon: 'KURLYWELCOME2026',
        minimumOrder: '10,000원 이상',
        region: ['전국'],
        startDate: '2026-07-01T00:00:00Z',
        endDate: '2026-12-31T23:59:59Z',
        eventType: 'NEW_USER',
        sourceUrl: 'https://www.kurly.com',
        verified: true,
        updatedAt: now,
        createdAt: '2026-07-01T00:00:00Z',
        status: 'ACTIVE',
      },
    ];
  }
}
