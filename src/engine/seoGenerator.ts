import { Event } from './types';

export interface EventSEOMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  openGraph: {
    title: string;
    description: string;
    type: string;
    url: string;
    siteName: string;
    image?: string;
  };
  jsonLd: Record<string, any>;
}

/**
 * 5. SEO Generator (각 할인 이벤트 자동 SEO 메타데이터 & Structured Data 생성기)
 */
export function generateEventSEO(event: Event, baseUrl: string = 'https://delivery-deal.kr'): EventSEOMetadata {
  const eventUrl = `${baseUrl}/event/${event.id}`;
  const seoTitle = `[${event.platform}] ${event.title} | 실시간 할인 정보`;
  const seoDesc = `${event.brand || event.platform} 공식 혜택! ${event.description}. ${
    event.discountAmount ? `${event.discountAmount.toLocaleString()}원 할인` : ''
  } ${event.freeDelivery ? '무료배달 적용' : ''}. 기간: ${event.startDate.split('T')[0]} ~ ${
    event.endDate.split('T')[0]
  }.`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SpecialAnnouncement',
    'name': event.title,
    'text': event.description,
    'category': 'https://schema.org/FoodService',
    'url': event.sourceUrl,
    'datePosted': event.startDate,
    'expires': event.endDate,
    'provider': {
      '@type': 'Organization',
      'name': event.platform,
    },
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'KRW',
      'availability': 'https://schema.org/InStock',
    },
  };

  return {
    title: seoTitle,
    description: seoDesc,
    canonicalUrl: eventUrl,
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      type: 'article',
      url: eventUrl,
      siteName: '대한민국 배달 할인 지도',
      image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&q=80&w=1200',
    },
    jsonLd,
  };
}
