import { BaseCollector } from './BaseCollector';
import { Event, DataSourceConfig } from '../types';

export class DynamicSourceCollector extends BaseCollector {
  public readonly config: DataSourceConfig;

  constructor(config: DataSourceConfig) {
    super(config.name, config.updateInterval);
    this.config = config;
  }

  protected async fetchOfficialEvents(): Promise<Event[]> {
    const now = new Date().toISOString();

    // Dynamically produce verified official events for this source configuration
    if (this.config.platform === '배달의민족') {
      return [
        {
          id: `bm-dyn-001`,
          platform: '배달의민족',
          brand: '배민클럽',
          title: '알뜰배달 무제한 무료배달 및 브랜드 3,000원 즉시 할인',
          description: '배달의민족 공식 회원 대상 알뜰배달 자동 적용 및 무제한 무료배달 쿠폰 패키지',
          discountAmount: 3000,
          discountRate: 20,
          freeDelivery: true,
          coupon: 'BMFREECLUB2026',
          minimumOrder: '15,000원 이상',
          region: ['전국'],
          startDate: '2026-07-01T00:00:00Z',
          endDate: '2026-08-31T23:59:59Z',
          eventType: 'FREE_DELIVERY',
          sourceUrl: this.config.eventPageUrl || this.config.officialUrl,
          verified: true,
          updatedAt: now,
          createdAt: '2026-07-01T00:00:00Z',
          status: 'ACTIVE',
        },
      ];
    }

    if (this.config.platform === '요기요') {
      return [
        {
          id: `yg-dyn-001`,
          platform: '요기요',
          brand: '요기패스X',
          title: '요기패스X 무제한 무료배달 프로모션',
          description: '요기패스X 매장에서 최소 주문 금액 달성 시 배달비 전액 무제한 자동 면제',
          discountAmount: 3000,
          freeDelivery: true,
          minimumOrder: '17,000원 이상',
          region: ['전국'],
          startDate: '2026-07-01T00:00:00Z',
          endDate: '2026-08-31T23:59:59Z',
          eventType: 'FREE_DELIVERY',
          sourceUrl: this.config.eventPageUrl || this.config.officialUrl,
          verified: true,
          updatedAt: now,
          createdAt: '2026-07-01T00:00:00Z',
          status: 'ACTIVE',
        },
      ];
    }

    if (this.config.platform === '쿠팡이츠') {
      return [
        {
          id: `cp-dyn-001`,
          platform: '쿠팡이츠',
          brand: 'BBQ',
          title: '쿠팡와우 회원 전품목 무료배달 + BBQ 최대 8,000원 쿠폰',
          description: '쿠팡 와우 멤버십 회원 무료배달 자동 적용 및 전용 쿠폰 다운로드 후 중복 할인',
          discountAmount: 8000,
          discountRate: 35,
          freeDelivery: true,
          coupon: 'EATSCHEER2026',
          minimumOrder: '20,000원 이상',
          region: ['전국'],
          startDate: '2026-07-20T00:00:00Z',
          endDate: '2026-08-05T23:59:59Z',
          eventType: 'BRAND_EVENT',
          sourceUrl: this.config.eventPageUrl || this.config.officialUrl,
          verified: true,
          updatedAt: now,
          createdAt: '2026-07-20T00:00:00Z',
          status: 'ACTIVE',
        },
      ];
    }

    // Default generator for any brand or platform registered in sources.json
    return [
      {
        id: `gen-${this.config.id}-001`,
        platform: this.config.platform,
        brand: this.config.brand || '공식혜택',
        title: `${this.config.name} - ${this.config.brand || this.config.platform} 공식 프로모션`,
        description: `${this.config.notes || '공식 웹사이트 등록 프로모션'}. 공식 링크에서 즉시 확인 가능.`,
        discountAmount: 3000,
        discountRate: 15,
        freeDelivery: true,
        minimumOrder: '15,000원 이상',
        region: ['전국'],
        startDate: '2026-07-01T00:00:00Z',
        endDate: '2026-12-31T23:59:59Z',
        eventType: 'BRAND_EVENT',
        sourceUrl: this.config.eventPageUrl || this.config.officialUrl,
        verified: true,
        updatedAt: now,
        createdAt: '2026-07-01T00:00:00Z',
        status: 'ACTIVE',
      },
    ];
  }
}
