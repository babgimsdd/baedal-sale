import { BaseCollector } from './BaseCollector';
import { Event } from '../types';

export class CJMarketCollector extends BaseCollector {
  constructor() {
    super('CJ더마켓', 120); // 2시간 수집 주기
  }

  protected async fetchOfficialEvents(): Promise<Event[]> {
    const now = new Date().toISOString();
    return [
      {
        id: 'cj-off-001',
        platform: 'CJ더마켓',
        brand: '비비고/햇반',
        title: 'CJ더마켓 비비고·햇반 메가세일 최대 45% 할인 쿠폰',
        description: 'CJ더마켓 공식몰 빅세일 프로모션. 비비고 국물요리, 냉동만두, 햇반 박스 할인 쿠폰 지급.',
        discountAmount: 15000,
        discountRate: 45,
        freeDelivery: true,
        coupon: 'CJMEGALEAGUE',
        minimumOrder: '30,000원 이상',
        region: ['전국'],
        startDate: '2026-07-25T00:00:00Z',
        endDate: '2026-08-02T23:59:59Z',
        eventType: 'LIMITED_TIME',
        sourceUrl: 'https://www.cjthemarket.com',
        verified: true,
        updatedAt: now,
        createdAt: '2026-07-25T00:00:00Z',
        status: 'ACTIVE',
      },
    ];
  }
}
