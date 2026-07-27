import { BaseCollector } from './BaseCollector';
import { Event } from '../types';

export class YogiyoCollector extends BaseCollector {
  constructor() {
    super('요기요', 30); // 30분 수집 주기
  }

  protected async fetchOfficialEvents(): Promise<Event[]> {
    const now = new Date().toISOString();
    return [
      {
        id: 'yg-off-001',
        platform: '요기요',
        brand: '요기패스X',
        title: '요기패스X 무제한 무료배달 프로모션',
        description: '요기패스X 표시 매장에서 최소 주문 금액 달성 시 배달비 전액 무제한 자동 면제.',
        discountAmount: 3000,
        freeDelivery: true,
        minimumOrder: '17,000원 이상',
        region: ['전국'],
        startDate: '2026-07-01T00:00:00Z',
        endDate: '2026-08-31T23:59:59Z',
        eventType: 'FREE_DELIVERY',
        sourceUrl: 'https://www.yogiyo.co.kr',
        verified: true,
        updatedAt: now,
        createdAt: '2026-07-01T00:00:00Z',
        status: 'ACTIVE',
      },
      {
        id: 'yg-off-002',
        platform: '요기요',
        brand: 'KB국민카드',
        title: 'KB국민카드 결제 시 최대 4,000원 청구 할인',
        description: 'KB국민카드로 결제 시 일일 선착순 1,000명 대상 즉시/청구 할인.',
        discountAmount: 4000,
        freeDelivery: false,
        minimumOrder: '25,000원 이상',
        region: ['전국'],
        startDate: '2026-07-15T00:00:00Z',
        endDate: '2026-07-31T23:59:59Z',
        eventType: 'CARD_DISCOUNT',
        sourceUrl: 'https://www.yogiyo.co.kr',
        verified: true,
        updatedAt: now,
        createdAt: '2026-07-15T00:00:00Z',
        status: 'ACTIVE',
      },
    ];
  }
}
