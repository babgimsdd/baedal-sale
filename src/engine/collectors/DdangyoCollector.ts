import { BaseCollector } from './BaseCollector';
import { Event } from '../types';

export class DdangyoCollector extends BaseCollector {
  constructor() {
    super('땡겨요', 60); // 1시간 수집 주기
  }

  protected async fetchOfficialEvents(): Promise<Event[]> {
    const now = new Date().toISOString();
    return [
      {
        id: 'dd-off-001',
        platform: '땡겨요',
        brand: '신한SOL페이',
        title: '신한 땡겨요 첫/재주문 무조건 3,000원 쿠폰 + 신한카드 추가 할인',
        description: '신한은행 상생 배달앱 땡겨요 전용 쿠폰 할인 및 신한 SOL페이 결제시 추가 혜택.',
        discountAmount: 3000,
        freeDelivery: false,
        coupon: 'THANKYOU3000',
        minimumOrder: '15,000원 이상',
        region: ['서울특별시', '경기도', '인천광역시'],
        startDate: '2026-07-01T00:00:00Z',
        endDate: '2026-08-15T23:59:59Z',
        eventType: 'COUPON',
        sourceUrl: 'https://www.ddangyo.com',
        verified: true,
        updatedAt: now,
        createdAt: '2026-07-01T00:00:00Z',
        status: 'ACTIVE',
      },
    ];
  }
}
