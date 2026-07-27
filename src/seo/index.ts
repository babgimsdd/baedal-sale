import { Event } from '../engine/types';

export interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  imageUrl?: string;
}

export const DEFAULT_SEO = {
  title: '대한민국 배달 할인 지도 | 배민·요기요·쿠팡이츠 공식 쿠폰 실시간 모음',
  description: '배달의민족, 요기요, 쿠팡이츠, 땡겨요, 마켓컬리, CJ더마켓 및 치킨·피자 자사앱 공식 무료배달 및 할인 쿠폰을 실시간으로 확인하세요.',
  siteUrl: 'https://delivery-deal.kr',
  ogImage: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&q=80&w=1200',
};

/**
 * Generates JSON-LD Structured Data for Google/Naver Rich Snippets
 */
export function generateDiscountListJsonLd(events: Event[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': events.map((event, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'SpecialAnnouncement',
        'name': `[${event.platform}] ${event.title}`,
        'text': event.description,
        'category': 'https://schema.org/FoodService',
        'url': event.sourceUrl,
        'datePosted': event.startDate,
        'expires': event.endDate,
        'provider': {
          '@type': 'Organization',
          'name': event.platform,
        },
      },
    })),
  };
}

/**
 * Generates XML Sitemap content for SEO crawlers
 */
export function generateXmlSitemap(events: Event[], siteUrl: string = DEFAULT_SEO.siteUrl): string {
  const urls = [
    { loc: siteUrl, priority: '1.0', changefreq: 'hourly' },
    { loc: `${siteUrl}/admin`, priority: '0.3', changefreq: 'daily' },
    ...events.map((e) => ({
      loc: `${siteUrl}/event/${e.id}`,
      priority: '0.8',
      changefreq: 'daily',
    })),
  ];

  const xmlUrls = urls
    .map(
      (u) => `
  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;
}

/**
 * Generates standard robots.txt content
 */
export function generateRobotsTxt(siteUrl: string = DEFAULT_SEO.siteUrl): string {
  return `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${siteUrl}/sitemap.xml`;
}
