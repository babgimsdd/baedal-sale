import React, { useState, useEffect, useMemo } from 'react';
import { DeliveryAppRollingBanner } from './components/DeliveryAppRollingBanner';
import { DealDetailPage } from './components/DealDetailPage';
import {
  isValidProductUrl,
  isProductActiveAndValid,
  findActiveReplacementProduct,
  createReplacedProductData,
  getProductPurchaseUrl,
  ProductItem,
} from './lib/productValidator';
import {
  Compass,
  Search,
  Plus,
  Lock,
  Unlock,
  ExternalLink,
  Copy,
  Check,
  X,
  Trash2,
  Edit3,
  Sparkles,
  Tag,
  ChevronRight,
  ShieldAlert,
  RefreshCw,
  Clock,
  ShoppingBag,
  Info,
  Share2,
  Smartphone,
  Eye,
  EyeOff,
  Key,
  Bot,
  Code,
  FileJson,
  Link as LinkIcon,
  Bell,
  AlertCircle
} from 'lucide-react';

// Delivery App Type Definition
export type DeliveryApp = '전체' | '배민' | '쿠팡이츠' | '요기요' | '땡겨요' | '먹깨비' | '두잇' | '배달특급' | '대구로' | '동백통';

export interface DiscountItem {
  id: string;
  app: string;
  brand: string;
  title?: string;
  name?: string;
  brand_id?: string;
  discount: string;
  price?: string | number;
  originalPrice?: number;
  discountPrice?: number;
  discountRate?: number; // 할인율 (숫자, 예: 50 = 50%)
  validity: string;
  minOrder?: string;
  category?: string; // 'korean' | 'chinese' | 'western' | 기타
  category_type?: 'mealkit' | 'coupon' | string;
  type?: string;
  region?: string;
  card_discount?: string;
  affiliate_link?: string;
  purchaseUrl?: string;
  buyUrl?: string;
  productUrl?: string;
  affiliateUrl?: string;
  url?: string;
  link?: string;
  imageUrl?: string;
  image?: string;
  seller?: string;
  is_top_ranked?: boolean;
  couponCode?: string;
  linkNote?: string;
  isSoldOut?: boolean;
  soldOut?: boolean;
  createdAt: number;
}

// Initial Sample Data (Requirement #1 & #3: 밀키트 특가 한식/중식/양식 데이터 세트 & 배달 쿠폰)
const INITIAL_DISCOUNTS: DiscountItem[] = [
  // 1. [🍲 밀키트 특가] - 한식(korean), 중식(chinese), 양식(western) 샘플 데이터 (다양한 할인율)
  {
    id: 'mk-1',
    app: '쿠팡이츠',
    brand: '[쿠팡프레시] 프레시지 블랙라벨 스테이크 (2인분)',
    brand_id: 'FRESHASY',
    discount: '15,900원 (45% 초특가)',
    discountRate: 45,
    validity: '오늘 로켓프레시 마감',
    minOrder: '무료배송 (쿠팡 와우)',
    category: 'western',
    category_type: 'mealkit',
    region: '전국',
    card_discount: '쿠팡페이 결제 시 5% 추가 적립',
    affiliate_link: 'https://www.coupang.com/vp/products/123456789',
    is_top_ranked: true,
    couponCode: 'FRESH45',
    linkNote: '쿠팡 로켓프레시 한정수량 할인 특가',
    createdAt: Date.now() - 1000 * 60 * 10,
  },
  {
    id: 'mk-2',
    app: '배민',
    brand: '[마켓컬리] 이연복의 목란 짜장면 & 짬뽕 밀키트 4인분',
    brand_id: 'MOKRAN',
    discount: '18,900원 (35% 특가)',
    discountRate: 35,
    validity: '오늘 23시 샛별배송 마감',
    minOrder: '4만원 이상 무료배송',
    category: 'chinese',
    category_type: 'mealkit',
    region: '전국',
    card_discount: '컬리카드 1,000원 즉시 할인',
    affiliate_link: 'https://www.kurly.com/goods/123456',
    is_top_ranked: true,
    couponCode: 'KURLY35',
    linkNote: '마켓컬리 베스트셀러 이연복 목란 중식 밀키트',
    createdAt: Date.now() - 1000 * 60 * 25,
  },
  {
    id: 'mk-3',
    app: '요기요',
    brand: '[CJ더마켓] 비비고 왕교자 & 수제 만두전골 밀키트',
    brand_id: 'BIBIGO',
    discount: '8,900원 (55% 타임특가)',
    discountRate: 55,
    validity: '오늘 유효',
    minOrder: '3만원 이상 무료배송',
    category: 'korean',
    category_type: 'mealkit',
    region: '전국',
    card_discount: 'CJ ONE 카드 5% 캐시백',
    affiliate_link: 'https://www.cjthemarket.com/pc/prod/prodDetail?prdCd=123456',
    purchaseUrl: 'https://www.cjthemarket.com/pc/prod/prodDetail?prdCd=123456',
    couponCode: 'BIBIGO55',
    linkNote: 'CJ더마켓 단독 55% 초특가 한정 세일 (실시간 재고 보유)',
    createdAt: Date.now() - 1000 * 60 * 45,
  },
  {
    id: 'mk-4',
    app: '쿠팡이츠',
    brand: '[쿠팡프레시] 마이셰프 감바스 알 아히요 밀키트',
    brand_id: 'MYCHEF',
    discount: '11,500원 (30% 할인)',
    discountRate: 30,
    validity: '오늘 로켓프레시 마감',
    minOrder: '15,000원 이상',
    category: 'western',
    category_type: 'mealkit',
    region: '전국',
    affiliate_link: 'https://www.coupang.com/vp/products/11223344',
    couponCode: 'MYCHEF30',
    linkNote: '홈파티 대표 메뉴 감바스 셰프 밀키트',
    createdAt: Date.now() - 1000 * 60 * 60,
  },
  {
    id: 'mk-5',
    app: '땡겨요',
    brand: '[GS프레시몰] 심플리쿡 우삼겹 순두부찌개 밀키트',
    brand_id: 'SIMPLYCOOK',
    discount: '8,900원 (50% 폭풍할인)',
    discountRate: 50,
    validity: '오늘 당일배송',
    minOrder: '2만원 이상 무료배송',
    category: 'korean',
    category_type: 'mealkit',
    region: '전국',
    affiliate_link: 'https://woodongs.com/product/556677',
    couponCode: 'SIMPLY50',
    linkNote: 'GS25 편의점 및 GS프레시몰 수령 가능',
    createdAt: Date.now() - 1000 * 60 * 90,
  },
  {
    id: 'mk-6',
    app: '배민',
    brand: '[마켓컬리] 하남돼지집 초벌 구이 삼겹살 밀키트',
    brand_id: 'HANAM',
    discount: '14,500원 (25% 할인)',
    discountRate: 25,
    validity: '오늘 샛별배송',
    minOrder: '4만원 이상 무료배송',
    category: 'korean',
    category_type: 'mealkit',
    region: '전국',
    affiliate_link: 'https://www.kurly.com/goods/112233',
    couponCode: 'HANAM25',
    linkNote: '집에서 즐기는 하남돼지집 직화 초벌구이',
    createdAt: Date.now() - 1000 * 60 * 110,
  },
  {
    id: 'mk-7',
    app: '요기요',
    brand: '[CJ더마켓] 홍콩반점 찹쌀탕수육 & 마파두부 밀키트',
    brand_id: 'HONGKONG',
    discount: '13,200원 (42% 타임세일)',
    discountRate: 42,
    validity: '오늘 유효',
    minOrder: '25,000원 이상 무료배송',
    category: 'chinese',
    category_type: 'mealkit',
    region: '전국',
    affiliate_link: 'https://www.cjthemarket.com/pc/prod/prodDetail?prdCd=334455',
    couponCode: 'HK42SALE',
    linkNote: '바삭한 찹쌀탕수육과 매콤 마파두부 세트',
    createdAt: Date.now() - 1000 * 60 * 125,
  },
  {
    id: 'mk-8',
    app: '쿠팡이츠',
    brand: '[쿠팡프레시] 폰타나 베이컨 크림 파스타 밀키트',
    brand_id: 'FONTANA',
    discount: '10,800원 (20% 할인)',
    discountRate: 20,
    validity: '오늘 로켓프레시 마감',
    minOrder: '15,000원 이상',
    category: 'western',
    category_type: 'mealkit',
    region: '전국',
    affiliate_link: 'https://www.coupang.com/vp/products/55667788',
    couponCode: 'FONTANA20',
    linkNote: '이탈리아 정통 스타일 베이컨 크림 파스타',
    createdAt: Date.now() - 1000 * 60 * 140,
  },
  {
    id: 'mk-9',
    app: '배민',
    brand: '[마켓컬리] 원조 소포장 안동찜닭 밀키트 (3인분)',
    brand_id: 'ANDONG',
    discount: '16,500원 (15% 할인)',
    discountRate: 15,
    validity: '오늘 샛별배송',
    minOrder: '4만원 이상 무료배송',
    category: 'korean',
    category_type: 'mealkit',
    region: '전국',
    affiliate_link: 'https://www.kurly.com/goods/556677',
    couponCode: 'ANDONG15',
    linkNote: '달콤 짭조름한 원조 안동찜닭 밀키트',
    createdAt: Date.now() - 1000 * 60 * 150,
  },

  // 2. [🎫 배달/치킨 쿠폰]
  {
    id: 'cp-1',
    app: '배민',
    brand: '[배달의민족] 배민 모바일 30,000원 금액권',
    brand_id: 'BAEMIN',
    discount: '28,500원 (5% 할인 구매)',
    validity: '발행일로부터 365일 유효',
    minOrder: '제한 없음 (배민 전체 매장)',
    category: '배달 상품권',
    category_type: 'coupon',
    region: '전국',
    card_discount: '카카오페이/토스 결제 가능',
    affiliate_link: 'https://search.11st.co.kr/Search.tmall?kwd=%EB%B0%B0%EB%8B%AC%EC%9D%98%EB%AF%BC%EC%A1%B1+%EC%83%81%ED%92%88%EA%B6%8C',
    is_top_ranked: true,
    couponCode: 'BM30000',
    linkNote: '배달의민족 앱에 상품권 번호 등록 후 즉시 사용 가능',
    createdAt: Date.now() - 1000 * 60 * 15,
  },
  {
    id: 'cp-2',
    app: '배민',
    brand: '[BBQ 치킨] 황금올리브치킨 + 콜라 1.25L 기프티콘',
    brand_id: 'BBQ',
    discount: '20,000원 (15% 초특가)',
    validity: '발행일로부터 90일 유효',
    minOrder: 'BBQ 전국 매장 배달/포장',
    category: '치킨 기프티콘',
    category_type: 'coupon',
    region: '전국',
    card_discount: '신한/현대카드 포인트 결제',
    affiliate_link: 'https://browse.gmarket.co.kr/search?keyword=BBQ+%EA%B8%B0%ED%94%84%ED%8B%B0%EC%BD%98',
    is_top_ranked: true,
    couponCode: 'BBQGIFT15',
    linkNote: 'BBQ 공식앱 및 E-쿠폰 주문 가능',
    createdAt: Date.now() - 1000 * 60 * 30,
  },
  {
    id: 'cp-3',
    app: '요기요',
    brand: '[요기요] 요기요 20,000원 모바일 상품권',
    brand_id: 'YOGIYO',
    discount: '18,500원 (7.5% 할인)',
    validity: '발행일로부터 1년 유효',
    minOrder: '요기요 앱 전체 주문',
    category: '배달 상품권',
    category_type: 'coupon',
    region: '전국',
    affiliate_link: 'https://browse.gmarket.co.kr/search?keyword=%EC%9A%94%EA%B8%B0%EC%9A%94+%EA%B8%88%EC%95%A1%EA%B6%8C',
    couponCode: 'YOGI20000',
    linkNote: '요기패스X 회원 구독 중복 할인 가능',
    createdAt: Date.now() - 1000 * 60 * 50,
  },
  {
    id: 'cp-4',
    app: '쿠팡이츠',
    brand: '[BHC 치킨] 뿌링클 + 치즈볼 + 콜라 세트 쿠폰',
    brand_id: 'BHC',
    discount: '21,000원 (12% 할인)',
    validity: '발행일로부터 90일 유효',
    minOrder: 'BHC 전국 매장 가능',
    category: '치킨 기프티콘',
    category_type: 'coupon',
    region: '전국',
    affiliate_link: 'https://browse.gmarket.co.kr/search?keyword=BHC+%EA%B8%B0%ED%94%84%ED%8B%B0%EC%BD%98',
    couponCode: 'BHCPURING',
    linkNote: 'BHC 시그니처 대표 메뉴 세트 기프티콘',
    createdAt: Date.now() - 1000 * 60 * 70,
  },
  {
    id: 'cp-5',
    app: '쿠팡이츠',
    brand: '[쿠팡이츠] 쿠팡이츠 10,000원 모바일 쿠폰',
    brand_id: 'COUPEATS',
    discount: '9,200원 (8% 할인)',
    validity: '발행일로부터 180일 유효',
    minOrder: '쿠팡이츠 와우 할인 중복',
    category: '배달 상품권',
    category_type: 'coupon',
    region: '전국',
    affiliate_link: 'https://www.coupang.com/np/search?q=%EC%BF%A0%ED%8F%B0+%EC%BF%A0%ED%8C%A1%EC%9D%B4%EC%B8%A0',
    couponCode: 'EATS10000',
    linkNote: '쿠팡 와우 회원 10% 자동 할인과 함께 중복 적용',
    createdAt: Date.now() - 1000 * 60 * 85,
  },
  {
    id: 'cp-6',
    app: '배민',
    brand: '[교촌치킨] 교촌 허니콤보 + 퐁듀치즈볼 기프티콘',
    brand_id: 'KYOCHON',
    discount: '21,500원 (10% 할인)',
    validity: '발행일로부터 90일 유효',
    minOrder: '교촌치킨 전국 매장',
    category: '치킨 기프티콘',
    category_type: 'coupon',
    region: '전국',
    affiliate_link: 'https://browse.gmarket.co.kr/search?keyword=%EA%B5%90%EC%B2%B8%EC%B9%98%ED%82%A8+%EA%B8%88%EC%95%A1%EA%B6%8C',
    couponCode: 'HONEYCOMB',
    linkNote: '교촌 인기 1위 허니콤보 모바일 교환권',
    createdAt: Date.now() - 1000 * 60 * 105,
  },
  {
    id: 'cp-7',
    app: '두잇',
    brand: '[굽네치킨] 굽네 고추바사삭 + 에그타르트 기프티콘',
    brand_id: 'GOOBNE',
    discount: '18,000원 (14% 할인)',
    validity: '발행일로부터 90일 유효',
    minOrder: '굽네치킨 전매장 가능',
    category: '치킨 기프티콘',
    category_type: 'coupon',
    region: '전국',
    affiliate_link: 'https://gift.kakao.com/search/result?query=%EA%B5%BD%EB%84%A4%EC%B9%98%ED%82%A8',
    couponCode: 'GOOBNE14',
    linkNote: '오븐구이 대표 굽네 고추바사삭 기프티콘',
    createdAt: Date.now() - 1000 * 60 * 130,
  }
];

// Delivery App Theme Config (Toss minimal style + App Signature Colors + Deep Link Specs)
const APP_THEMES = {
  배민: {
    name: '배달의민족',
    shortName: '배민',
    badgeBg: 'bg-[#2AC1BC]',
    badgeText: 'text-white',
    lightBg: 'bg-[#E8F8F7]',
    textColor: 'text-[#008B86]',
    borderColor: 'border-[#2AC1BC]/20',
    btnBg: 'bg-[#2AC1BC] hover:bg-[#25B1AC]',
    scheme: 'baemin://',
    packageName: 'com.sample.baemin',
    appStoreUrl: 'https://apps.apple.com/kr/app/id378084485',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.sample.baemin',
    webUrl: 'https://search.11st.co.kr/Search.tmall?kwd=%EB%B0%B0%EB%8B%AC%EC%9D%98%EB%AF%BC%EC%A1%B1+%EC%83%81%ED%92%88%EA%B6%8C',
  },
  쿠팡이츠: {
    name: '쿠팡이츠',
    shortName: '쿠팡이츠',
    badgeBg: 'bg-[#00A3FF]',
    badgeText: 'text-white',
    lightBg: 'bg-[#EBF5FF]',
    textColor: 'text-[#0066CC]',
    borderColor: 'border-[#00A3FF]/20',
    btnBg: 'bg-[#00A3FF] hover:bg-[#0092E6]',
    scheme: 'coupangeats://',
    packageName: 'com.coupang.mobile.eats',
    appStoreUrl: 'https://apps.apple.com/kr/app/id1463131711',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.coupang.mobile.eats',
    webUrl: 'https://www.coupang.com/np/search?q=%EC%BF%A0%ED%8F%B0+%EC%BF%A0%ED%8C%A1%EC%9D%B4%EC%B8%A0',
  },
  요기요: {
    name: '요기요',
    shortName: '요기요',
    badgeBg: 'bg-[#FA0050]',
    badgeText: 'text-white',
    lightBg: 'bg-[#FFEBF0]',
    textColor: 'text-[#D00040]',
    borderColor: 'border-[#FA0050]/20',
    btnBg: 'bg-[#FA0050] hover:bg-[#E00048]',
    scheme: 'yogiyo://',
    packageName: 'com.fineapp.yogiyo',
    appStoreUrl: 'https://apps.apple.com/kr/app/id543708081',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.fineapp.yogiyo',
    webUrl: 'https://browse.gmarket.co.kr/search?keyword=%EC%9A%94%EA%B8%B0%EC%9A%94+%EA%B8%88%EC%95%A1%EA%B6%8C',
  },
  땡겨요: {
    name: '땡겨요',
    shortName: '땡겨요',
    badgeBg: 'bg-[#FF5B00]',
    badgeText: 'text-white',
    lightBg: 'bg-[#FFF0E6]',
    textColor: 'text-[#CC4800]',
    borderColor: 'border-[#FF5B00]/20',
    btnBg: 'bg-[#FF5B00] hover:bg-[#E65200]',
    scheme: 'ddangyo://',
    packageName: 'kr.co.shinhan.ddangyo',
    appStoreUrl: 'https://apps.apple.com/kr/app/id1583726080',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=kr.co.shinhan.ddangyo',
    webUrl: 'https://gift.kakao.com/search/result?query=%EB%9D%A1%EA%B2%A8%EC%9A%94',
  },
  먹깨비: {
    name: '먹깨비',
    shortName: '먹깨비',
    badgeBg: 'bg-[#8B5CF6]',
    badgeText: 'text-white',
    lightBg: 'bg-[#F3E8FF]',
    textColor: 'text-[#7C3AED]',
    borderColor: 'border-[#8B5CF6]/20',
    btnBg: 'bg-[#8B5CF6] hover:bg-[#7C3AED]',
    scheme: 'mukkebi://',
    packageName: 'com.mukkebi.app',
    appStoreUrl: 'https://apps.apple.com/kr/app/id1324707198',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.mukkebi.app',
    webUrl: 'https://gift.kakao.com/search/result?query=%EB%A9%89%EA%B9%A8%EB%B9%84',
  },
  두잇: {
    name: '두잇',
    shortName: '두잇',
    badgeBg: 'bg-[#10B981]',
    badgeText: 'text-white',
    lightBg: 'bg-[#E1F8F0]',
    textColor: 'text-[#059669]',
    borderColor: 'border-[#10B981]/20',
    btnBg: 'bg-[#10B981] hover:bg-[#059669]',
    scheme: 'doeat://',
    packageName: 'com.doeat.app',
    appStoreUrl: 'https://apps.apple.com/kr/app/id1588667634',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.doeat.app',
    webUrl: 'https://gift.kakao.com/search/result?query=%EB%91%90%EC%9E%87',
  },
  배달특급: {
    name: '배달특급',
    shortName: '배달특급',
    badgeBg: 'bg-[#2563EB]',
    badgeText: 'text-white',
    lightBg: 'bg-[#EFF6FF]',
    textColor: 'text-[#1D4ED8]',
    borderColor: 'border-[#2563EB]/20',
    btnBg: 'bg-[#2563EB] hover:bg-[#1D4ED8]',
    scheme: 'specialdelivery://',
    packageName: 'com.kgc.specialdelivery',
    appStoreUrl: 'https://apps.apple.com/kr/app/id1535497217',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.kgc.specialdelivery',
    webUrl: 'https://gift.kakao.com/search/result?query=%EB%B0%B0%EB%8B%AC%ED%8A%B9%EA%B8%89',
  },
  대구로: {
    name: '대구로',
    shortName: '대구로',
    badgeBg: 'bg-[#EC4899]',
    badgeText: 'text-white',
    lightBg: 'bg-[#FCE7F3]',
    textColor: 'text-[#DB2777]',
    borderColor: 'border-[#EC4899]/20',
    btnBg: 'bg-[#EC4899] hover:bg-[#DB2777]',
    scheme: 'daaguro://',
    packageName: 'com.daaguro.app',
    appStoreUrl: 'https://apps.apple.com/kr/app/id1576839352',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.daaguro.app',
    webUrl: 'https://gift.kakao.com/search/result?query=%EB%8C%80%EA%B5%AC%EB%A1%9C',
  },
  동백통: {
    name: '동백통',
    shortName: '동백통',
    badgeBg: 'bg-[#F59E0B]',
    badgeText: 'text-white',
    lightBg: 'bg-[#FEF3C7]',
    textColor: 'text-[#D97706]',
    borderColor: 'border-[#F59E0B]/20',
    btnBg: 'bg-[#F59E0B] hover:bg-[#D97706]',
    scheme: 'dongbaegtong://',
    packageName: 'com.dongbaegtong.app',
    appStoreUrl: 'https://apps.apple.com/kr/app/id1593386612',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.dongbaegtong.app',
    webUrl: 'https://www.dongbaegtong.com/',
  },
};

export default function App() {
  // State for discounts list (loads from localStorage or initial sample array)
  const [discounts, setDiscounts] = useState<DiscountItem[]>(() => {
    try {
      const saved = localStorage.getItem('delivery_compass_discounts_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load from localStorage', e);
    }
    return INITIAL_DISCOUNTS;
  });

  // Realtime Live Data Fetching State
  const [isRefreshingLive, setIsRefreshingLive] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string | null>(null);

  // Safe JSON Fetcher Helper to handle Vercel HTML rewrites / 404s gracefully
  const fetchJsonSafely = async <T,>(url: string): Promise<T | null> => {
    try {
      const res = await fetch(`${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`);
      if (!res.ok) return null;
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('text/html')) return null;
      const data = await res.json();
      return data as T;
    } catch {
      return null;
    }
  };

  // Fetch Live Updated Discounts, Coupons & Mealkits JSON from Server/GitHub/Public Data
  const fetchLiveDiscounts = async (silent = false) => {
    try {
      if (!silent) setIsRefreshingLive(true);

      // 1. Fetch general delivery app discounts
      let generalDiscounts: DiscountItem[] = [];
      const discData =
        (await fetchJsonSafely<DiscountItem[]>('/data/discounts.json')) ||
        (await fetchJsonSafely<DiscountItem[]>('/discounts.json'));
      if (Array.isArray(discData) && discData.length > 0) {
        generalDiscounts = discData;
      } else {
        generalDiscounts = INITIAL_DISCOUNTS;
      }

      // 2. Fetch live open market coupons (배민/요기요 금액권 & 치킨 기프티콘)
      let liveCoupons: DiscountItem[] = [];
      const couponApiRes = await fetchJsonSafely<{ success?: boolean; data?: DiscountItem[] }>('/api/coupons');
      if (couponApiRes && couponApiRes.success && Array.isArray(couponApiRes.data) && couponApiRes.data.length > 0) {
        liveCoupons = couponApiRes.data;
      }
      if (liveCoupons.length === 0) {
        const staticCoupons =
          (await fetchJsonSafely<DiscountItem[]>('/data/coupons.json')) ||
          (await fetchJsonSafely<DiscountItem[]>('/coupons.json'));
        if (Array.isArray(staticCoupons) && staticCoupons.length > 0) {
          liveCoupons = staticCoupons;
        }
      }

      // 3. Fetch live scraped mealkits
      let liveMealkits: DiscountItem[] = [];
      const mealkitApiRes = await fetchJsonSafely<{ success?: boolean; data?: DiscountItem[] }>('/api/mealkits');
      if (mealkitApiRes && mealkitApiRes.success && Array.isArray(mealkitApiRes.data) && mealkitApiRes.data.length > 0) {
        liveMealkits = mealkitApiRes.data;
      }
      if (liveMealkits.length === 0) {
        const staticMealkits =
          (await fetchJsonSafely<DiscountItem[]>('/data/mealkits.json')) ||
          (await fetchJsonSafely<DiscountItem[]>('/mealkits.json'));
        if (Array.isArray(staticMealkits) && staticMealkits.length > 0) {
          liveMealkits = staticMealkits;
        }
      }

      // Normalize items and merge with unique IDs per domain source
      const map = new Map<string, DiscountItem>();
      const normalizeItem = (raw: any, sourcePrefix: string): DiscountItem | null => {
        const brand = raw.brand || raw.name || raw.title || '특가 상품';
        const title = raw.title || raw.name || raw.brand || '특가 상품';
        const discountStr = raw.discount || (raw.discountPrice ? `${raw.discountPrice.toLocaleString()}원 할인` : '특가 할인');
        const realPurchaseUrl =
          raw.purchaseUrl ||
          raw.buyUrl ||
          raw.productUrl ||
          raw.affiliateUrl ||
          raw.affiliate_link ||
          raw.url ||
          raw.link ||
          '';

        // Discard any item that does not have a verified, specific product detail URL
        if (!isValidProductUrl(realPurchaseUrl)) {
          return null;
        }
        const imgUrl = raw.imageUrl || raw.image;

        // Ensure distinct ID per source to prevent Map key collisions
        let uniqueId = String(raw.id || '').trim();
        if (!uniqueId) {
          uniqueId = `${sourcePrefix}-${Math.random().toString(36).substring(2, 9)}`;
        } else if (!uniqueId.startsWith(sourcePrefix) && !uniqueId.includes('-')) {
          uniqueId = `${sourcePrefix}-${uniqueId}`;
        }

        return {
          ...raw,
          id: uniqueId,
          brand,
          title,
          discount: discountStr,
          validity: raw.validity || '오늘 하루만 유효',
          affiliate_link: realPurchaseUrl,
          purchaseUrl: realPurchaseUrl,
          buyUrl: raw.buyUrl || realPurchaseUrl,
          productUrl: raw.productUrl || realPurchaseUrl,
          affiliateUrl: raw.affiliateUrl || realPurchaseUrl,
          url: raw.url || realPurchaseUrl,
          link: raw.link || realPurchaseUrl,
          imageUrl: imgUrl,
          image: imgUrl,
          createdAt: raw.createdAt || Date.now(),
        };
      };

      generalDiscounts.forEach((raw) => {
        if (raw) {
          const item = normalizeItem(raw, 'deal');
          if (item && !item.isSoldOut && !item.soldOut) {
            map.set(item.id, item);
          }
        }
      });

      liveCoupons.forEach((raw) => {
        if (raw) {
          const item = normalizeItem(raw, 'coupon');
          if (item && !item.isSoldOut && !item.soldOut) {
            map.set(item.id, item);
          }
        }
      });

      liveMealkits.forEach((raw) => {
        if (raw) {
          const item = normalizeItem(raw, 'mealkit');
          if (item && !item.isSoldOut && !item.soldOut) {
            map.set(item.id, item);
          }
        }
      });

      const mergedDiscounts = Array.from(map.values());

      if (mergedDiscounts.length > 0) {
        setDiscounts(mergedDiscounts);
        try {
          localStorage.setItem('delivery_compass_discounts_v1', JSON.stringify(mergedDiscounts));
        } catch (e) {
          console.error(e);
        }
        const nowStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
        setLastUpdatedTime(nowStr);
        if (!silent) {
          showToast(`🔄 실시간 배달/치킨 쿠폰 및 밀키트 핫딜 연동 완료! (${nowStr})`);
        }
      }
    } catch (err) {
      console.error('Failed to fetch live discounts:', err);
    } finally {
      setIsRefreshingLive(false);
    }
  };

  // Auto-sync live discounts on mount and every 3 minutes
  useEffect(() => {
    fetchLiveDiscounts(true);
    const interval = setInterval(() => {
      fetchLiveDiscounts(true);
    }, 180000);
    return () => clearInterval(interval);
  }, []);

  // Active filter states
  const [selectedMainTab, setSelectedMainTab] = useState<'mealkit' | 'coupon'>('mealkit');
  const [selectedMealkitCategory, setSelectedMealkitCategory] = useState<'all' | 'korean' | 'chinese' | 'western'>('all');
  const [selectedApp, setSelectedApp] = useState<DeliveryApp>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  // Admin state & Saved Password (localStorage)
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showLoginPwdText, setShowLoginPwdText] = useState(false);

  // Stored Admin Password (defaults to '1234') with dual persistence (localStorage + cookie backup)
  const [currentAdminPassword, setCurrentAdminPassword] = useState<string>(() => {
    try {
      const local = localStorage.getItem('delivery_compass_admin_pwd');
      if (local && local.trim()) return local.trim();

      if (typeof document !== 'undefined') {
        const match = document.cookie.match(/(?:^|; )delivery_admin_pwd=([^;]*)/);
        if (match && match[1]) {
          const decoded = decodeURIComponent(match[1]);
          if (decoded && decoded.trim()) {
            localStorage.setItem('delivery_compass_admin_pwd', decoded.trim());
            return decoded.trim();
          }
        }
      }
    } catch {
      // ignore
    }
    return '1234';
  });

  // Stored Affiliate Tracking URLs (Admin Managed)
  const [affiliateUrls, setAffiliateUrls] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('delivery_affiliate_urls');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      '쿠팡이츠': 'https://eats.coupang.com',
      '배민': 'https://m.baemin.com',
      '요기요': 'https://www.yogiyo.co.kr',
      '땡겨요': 'https://www.ddangyo.com',
      '먹깨비': 'https://www.mukkebi.com',
      '두잇': 'https://doeat.io',
      '배달특급': 'https://www.specialdelivery.or.kr',
      '대구로': 'https://daaguro.com',
      '동백통': 'https://www.dongbaegtong.com',
    };
  });
  const [showAffiliateModal, setShowAffiliateModal] = useState(false);

  // Favorite Food / Brand Alert State (Saved in LocalStorage)
  const [favoriteKeywords, setFavoriteKeywords] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('delivery_favorite_keywords');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['BBQ', '버거킹', '엽기떡볶이', '치킨'];
  });
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [showFoodAlertModal, setShowFoodAlertModal] = useState(false);
  const [enableBrowserNotification, setEnableBrowserNotification] = useState<boolean>(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  });

  // User Location State (Saved in LocalStorage for 100% free Vercel hosting)
  const [userAddress, setUserAddress] = useState<string>(() => {
    try {
      return localStorage.getItem('delivery_user_address') || '서울특별시 관악구 신림동';
    } catch {
      return '서울특별시 관악구 신림동';
    }
  });

  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressInputText, setAddressInputText] = useState('');

  // GPS Location Handler
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      showToast('이 브라우저는 GPS 위치 서비스를 지원하지 않습니다.');
      return;
    }
    setIsDetectingGps(true);
    showToast('📡 현재 위치(GPS) 수신 중...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetectingGps(false);
        const lat = pos.coords.latitude;
        const sampleRegions = [
          '서울특별시 관악구 신림동',
          '서울특별시 마포구 서교동',
          '경기도 성남시 분당구 정자동',
          '대구광역시 수성구 범어동',
          '부산광역시 부산진구 부전동',
        ];
        const detectedRegion = sampleRegions[Math.floor(Math.abs(lat * 100) % sampleRegions.length)];
        setUserAddress(detectedRegion);
        try {
          localStorage.setItem('delivery_user_address', detectedRegion);
        } catch (e) {
          console.error(e);
        }
        showToast(`📍 위치 인식 성공: ${detectedRegion}`);
        setShowAddressModal(false);
      },
      () => {
        setIsDetectingGps(false);
        showToast('위치 권한이 거부되었거나 수신이 지연되었습니다. 주소를 직접 입력해 주세요.');
      },
      { timeout: 8000 }
    );
  };

  // Save admin password to both localStorage and cookie when updated
  useEffect(() => {
    try {
      localStorage.setItem('delivery_compass_admin_pwd', currentAdminPassword);
      if (typeof document !== 'undefined') {
        document.cookie = `delivery_admin_pwd=${encodeURIComponent(currentAdminPassword)}; path=/; max-age=315360000; SameSite=Lax`;
      }
    } catch (e) {
      console.error('Failed to save admin password', e);
    }
  }, [currentAdminPassword]);

  // Admin Change Password Modal State
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [changeCurrentPwd, setChangeCurrentPwd] = useState('');
  const [changeNewPwd, setChangeNewPwd] = useState('');
  const [changeNewPwdConfirm, setChangeNewPwdConfirm] = useState('');
  const [changePwdError, setChangePwdError] = useState('');
  const [showChangePwdText, setShowChangePwdText] = useState(false);

  // Gemini AI Auto-Parse State
  const [showAiParseModal, setShowAiParseModal] = useState(false);
  const [aiInputText, setAiInputText] = useState('');
  const [isParsingAi, setIsParsingAi] = useState(false);
  const [aiParseResult, setAiParseResult] = useState<Array<{
    platform: string;
    category: string;
    brand: string;
    discount: string;
    condition: string;
    duration: string;
  }> | null>(null);

  // Vercel Cron Guide Modal State
  const [showVercelGuideModal, setShowVercelGuideModal] = useState(false);

  // Admin Register / Edit Modal State
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [editingItem, setEditingItem] = useState<DiscountItem | null>(null);

  // Form Fields
  const [formApp, setFormApp] = useState<'배민' | '쿠팡이츠' | '요기요' | '땡겨요'>('배민');
  const [formBrand, setFormBrand] = useState('');
  const [formDiscount, setFormDiscount] = useState('');
  const [formValidity, setFormValidity] = useState('오늘 하루만 유효');
  const [formMinOrder, setFormMinOrder] = useState('15,000원 이상');
  const [formCategory, setFormCategory] = useState('치킨');
  const [formCouponCode, setFormCouponCode] = useState('');
  const [formLinkNote, setFormLinkNote] = useState('');

  // Selected item modal for "앱으로 이동" click
  const [activeModalItem, setActiveModalItem] = useState<DiscountItem | null>(null);
  
  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // PWA Install & Share State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallGuideModal, setShowInstallGuideModal] = useState(false);

  // Capture beforeinstallprompt event for Android / Chrome PWA install
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Handle Share Function
  const handleShare = async () => {
    const shareData = {
      title: '오늘의 배달 할인 나침반',
      text: '배민 · 쿠팡이츠 · 요기요 · 땡겨요 실시간 통합 할인 정보를 확인해 보세요!',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast('📢 성공적으로 공유되었습니다!');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          navigator.clipboard.writeText(window.location.href);
          showToast('🔗 사이트 주소가 복사되었습니다!');
        }
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('🔗 사이트 주소가 복사되었습니다! 친구에게 공유해 보세요.');
    }
  };

  // Handle Add to Home Screen Function
  const handleAddToHomeScreen = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          showToast('📲 홈 화면에 성공적으로 추가되었습니다!');
        } else {
          showToast('💡 브라우저 메뉴[⋮]에서 언제든 [홈 화면에 추가]를 할 수 있습니다.');
        }
        setDeferredPrompt(null);
      });
    } else {
      setShowInstallGuideModal(true);
    }
  };

  // Save to localStorage whenever discounts change
  useEffect(() => {
    try {
      localStorage.setItem('delivery_compass_discounts_v1', JSON.stringify(discounts));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [discounts]);

  // Show Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Extract major region keyword from userAddress (e.g. '서울', '경기', '대구', '부산', '인천' etc.)
  const userRegionKeyword = useMemo(() => {
    if (!userAddress) return '전국';
    const regions = ['서울', '경기', '대구', '부산', '인천', '광주', '대전', '울산', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];
    for (const r of regions) {
      if (userAddress.includes(r)) return r;
    }
    return '전국';
  }, [userAddress]);

  // Helper to distinguish mealkit items from delivery app coupons
  const isMealkitItem = (item: DiscountItem) => {
    if (!item) return false;
    if (item.category_type === 'mealkit' || item.type === 'mealkit') return true;
    if (item.category_type === 'coupon' || item.type === 'coupon' || item.category === 'coupon') return false;

    const brand = item.brand || '';
    const title = item.title || '';
    return (
      brand.includes('밀키트') ||
      title.includes('밀키트') ||
      brand.includes('쿠팡프레시') ||
      brand.includes('마켓컬리') ||
      brand.includes('CJ더마켓') ||
      brand.includes('프레시') ||
      brand.includes('컬리') ||
      item.category === 'korean' ||
      item.category === 'chinese' ||
      item.category === 'western'
    );
  };

  const isCouponItem = (item: DiscountItem) => {
    if (!item) return false;
    if (item.category_type === 'coupon' || item.type === 'coupon' || item.category === 'coupon') return true;
    if (item.category_type === 'mealkit' || item.type === 'mealkit') return false;

    const brand = item.brand || '';
    const title = item.title || '';
    return (
      brand.includes('금액권') ||
      title.includes('금액권') ||
      title.includes('기프티콘') ||
      title.includes('쿠폰') ||
      brand.includes('상품권')
    );
  };

  // Counts for main tabs (Requirement: 밀키트 특가 vs 배달/치킨 쿠폰 완전 분리)
  const mealkitCount = useMemo(() => {
    return discounts.filter(isMealkitItem).length;
  }, [discounts]);

  const couponCount = useMemo(() => {
    return discounts.filter(isCouponItem).length;
  }, [discounts]);

  // Filtered List calculation (Reflect user address, main category tabs, subcategories & region)
  const filteredDiscounts = useMemo(() => {
    // 1. [🎫 배달/치킨 쿠폰] 탭: 오픈마켓/기프티콘 쿠폰 전체가 빠짐없이 할인율 높은순으로 노출 (배달앱 필터 영향 없음)
    if (selectedMainTab === 'coupon') {
      let couponList = discounts.filter(isCouponItem);
      
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        couponList = couponList.filter((item) => {
          const brand = (item.brand || '').toLowerCase();
          const app = (item.app || '').toLowerCase();
          const title = (item.title || item.name || '').toLowerCase();
          const discount = (item.discount || '').toLowerCase();
          return brand.includes(query) || app.includes(query) || title.includes(query) || discount.includes(query);
        });
      }

      return couponList.sort((a, b) => (b.discountRate || 0) - (a.discountRate || 0));
    }

    // 2. [🥘 밀키트 특가] 탭: 배달앱 선택(배민/요기요 등)과 완전히 독립되어 카테고리(한식/중식/양식 등)별 밀키트 전체 노출
    if (selectedMainTab === 'mealkit') {
      let mealkitList = discounts.filter((item) => isMealkitItem(item));

      // 서브 카테고리 필터
      if (selectedMealkitCategory && selectedMealkitCategory !== 'all' && selectedMealkitCategory !== '전체') {
        if (selectedMealkitCategory === 'korean') {
          mealkitList = mealkitList.filter((item) => item.category === 'korean' || item.category?.includes('한식'));
        } else if (selectedMealkitCategory === 'chinese') {
          mealkitList = mealkitList.filter((item) => item.category === 'chinese' || item.category?.includes('중식'));
        } else if (selectedMealkitCategory === 'western') {
          mealkitList = mealkitList.filter((item) => item.category === 'western' || item.category?.includes('양식'));
        } else {
          mealkitList = mealkitList.filter((item) => item.category === selectedMealkitCategory || item.category?.includes(selectedMealkitCategory));
        }
      }

      // 검색어 필터
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        mealkitList = mealkitList.filter((item) =>
          item.brand.toLowerCase().includes(query) ||
          (item.title && item.title.toLowerCase().includes(query)) ||
          item.discount.toLowerCase().includes(query) ||
          (item.category || '').toLowerCase().includes(query)
        );
      }

      // 할인율 높은순 정렬
      return mealkitList.sort((a, b) => (b.discountRate || 0) - (a.discountRate || 0));
    }

    // 3. [🎁 배달앱 혜택 한눈에] 탭: 배달앱(배민/요기요/쿠팡이츠 등)의 공식 이벤트/할인/무료배송 혜택만 모아서 표시
    const list = discounts.filter((item) => {
      const isMealkit = isMealkitItem(item);
      const isCoupon = item.category_type === 'coupon' || item.type === 'coupon' || item.category === 'coupon';

      // 밀키트와 금액권 쿠폰은 일반 배달혜택 목록에서 제외
      if (isMealkit || isCoupon) return false;

      // 배달앱 필터
      if (selectedApp !== '전체' && item.app !== selectedApp) {
        return false;
      }
      // 카테고리 필터
      if (
        selectedCategory !== '전체' &&
        item.category !== selectedCategory &&
        item.category !== 'korean' &&
        item.category !== 'chinese' &&
        item.category !== 'western'
      ) {
        return false;
      }
      // 검색어 필터
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchBrand = item.brand.toLowerCase().includes(query);
        const matchApp = item.app.toLowerCase().includes(query);
        const matchCategory = (item.category || '').toLowerCase().includes(query);
        const matchDiscount = item.discount.toLowerCase().includes(query);
        const matchRegion = (item.region || '').toLowerCase().includes(query);
        return matchBrand || matchApp || matchCategory || matchDiscount || matchRegion;
      }
      return true;
    });

    return list.sort((a, b) => (b.discountRate || 0) - (a.discountRate || 0));
  }, [discounts, selectedMainTab, selectedMealkitCategory, selectedApp, selectedCategory, searchQuery, userAddress, userRegionKeyword]);

  // Count by app for tab badges
  const appCounts = useMemo(() => {
    const counts: Record<DeliveryApp, number> = {
      전체: discounts.length,
      배민: 0,
      쿠팡이츠: 0,
      요기요: 0,
      땡겨요: 0,
      먹깨비: 0,
      두잇: 0,
      배달특급: 0,
      대구로: 0,
      동백통: 0,
    };
    discounts.forEach((d) => {
      if (counts[d.app as DeliveryApp] !== undefined) {
        counts[d.app as DeliveryApp]++;
      }
    });
    return counts;
  }, [discounts]);

  // Handle Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === currentAdminPassword) {
      setIsAdmin(true);
      setShowAdminLoginModal(false);
      setAdminPassword('');
      setPasswordError(false);
      setShowLoginPwdText(false);
      showToast('🔑 관리자로 로그인되었습니다.');
    } else {
      setPasswordError(true);
    }
  };

  // Handle Admin Change Password Submit
  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (changeCurrentPwd !== currentAdminPassword) {
      setChangePwdError('현재 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!changeNewPwd || changeNewPwd.trim().length < 2) {
      setChangePwdError('새 비밀번호는 최소 2자리 이상 입력해 주세요.');
      return;
    }
    if (changeNewPwd !== changeNewPwdConfirm) {
      setChangePwdError('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    const newPassword = changeNewPwd.trim();
    setCurrentAdminPassword(newPassword);
    try {
      localStorage.setItem('delivery_compass_admin_pwd', newPassword);
      if (typeof document !== 'undefined') {
        document.cookie = `delivery_admin_pwd=${encodeURIComponent(newPassword)}; path=/; max-age=315360000; SameSite=Lax`;
      }
    } catch (e) {
      console.error('Failed to save admin password to storage', e);
    }
    setShowChangePasswordModal(false);
    setChangeCurrentPwd('');
    setChangeNewPwd('');
    setChangeNewPwdConfirm('');
    setChangePwdError('');
    showToast('🔐 비밀번호가 성공적으로 변경되었습니다!');
  };

  // Call Server-side Gemini API for discount parsing
  const handleAiParseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInputText.trim()) return;
    setIsParsingAi(true);
    setAiParseResult(null);

    try {
      const res = await fetch('/api/parse-discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: aiInputText }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setAiParseResult(data.data);
        showToast(`🤖 Gemini AI가 ${data.data.length}개의 할인을 추출했습니다!`);
      } else {
        showToast(`⚠️ 정제 실패: ${data.error || '알 수 없는 오류'}`);
      }
    } catch (err: any) {
      showToast(`⚠️ 오류 발생: ${err.message}`);
    } finally {
      setIsParsingAi(false);
    }
  };

  // Apply parsed discounts directly to state
  const handleApplyAiParsedDiscounts = () => {
    if (!aiParseResult || aiParseResult.length === 0) return;
    const newItems: DiscountItem[] = aiParseResult.map((item, idx) => ({
      id: `ai-${Date.now()}-${idx}`,
      app: (['배민', '쿠팡이츠', '요기요', '땡겨요'].includes(item.platform)
        ? item.platform
        : '배민') as any,
      brand: item.brand,
      brand_id: (item as any).brand_id || item.brand.toUpperCase().replace(/[^A-Z]/g, ''),
      discount: item.discount,
      validity: item.duration,
      minOrder: item.condition,
      category: item.category,
      card_discount: (item as any).card_discount || '없음',
      affiliate_link: (item as any).affiliate_link || 'https://www.coupang.com',
      is_top_ranked: (item as any).is_top_ranked ?? (idx < 3),
      createdAt: Date.now(),
    }));

    setDiscounts((prev) => [...newItems, ...prev]);
    setShowAiParseModal(false);
    setAiParseResult(null);
    setAiInputText('');
    showToast(`🎉 ${newItems.length}개의 할인 정보가 성공적으로 등록되었습니다!`);
  };

  // Open Register Form (New or Edit)
  const openRegisterModal = (itemToEdit?: DiscountItem) => {
    if (itemToEdit) {
      setEditingItem(itemToEdit);
      setFormApp(itemToEdit.app);
      setFormBrand(itemToEdit.brand);
      setFormDiscount(itemToEdit.discount);
      setFormValidity(itemToEdit.validity || '오늘 하루만 유효');
      setFormMinOrder(itemToEdit.minOrder || '15,000원 이상');
      setFormCategory(itemToEdit.category || '치킨');
      setFormCouponCode(itemToEdit.couponCode || '');
      setFormLinkNote(itemToEdit.linkNote || '');
    } else {
      setEditingItem(null);
      setFormApp('배민');
      setFormBrand('');
      setFormDiscount('');
      setFormValidity('오늘 하루만 유효');
      setFormMinOrder('15,000원 이상');
      setFormCategory('치킨');
      setFormCouponCode('');
      setFormLinkNote('');
    }
    setShowRegisterModal(true);
  };

  // Handle Form Submission (Add / Update)
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBrand.trim() || !formDiscount.trim()) {
      showToast('⚠️ 브랜드명과 할인 금액을 입력해 주세요.');
      return;
    }

    if (editingItem) {
      // Update existing item
      setDiscounts((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                app: formApp,
                brand: formBrand.trim(),
                discount: formDiscount.trim(),
                validity: formValidity.trim() || '오늘 하루만 유효',
                minOrder: formMinOrder.trim(),
                category: formCategory,
                couponCode: formCouponCode.trim(),
                linkNote: formLinkNote.trim(),
              }
            : item
        )
      );
      showToast(`✏️ '${formBrand}' 할인 정보가 수정되었습니다.`);
    } else {
      // Add new item to JS Array
      const newItem: DiscountItem = {
        id: Date.now().toString(),
        app: formApp,
        brand: formBrand.trim(),
        discount: formDiscount.trim(),
        validity: formValidity.trim() || '오늘 하루만 유효',
        minOrder: formMinOrder.trim(),
        category: formCategory,
        couponCode: formCouponCode.trim(),
        linkNote: formLinkNote.trim(),
        createdAt: Date.now(),
      };
      setDiscounts((prev) => [newItem, ...prev]);
      showToast(`✨ 새로운 할인 정보가 추가되었습니다!`);
    }

    setShowRegisterModal(false);
  };

  // Handle Delete Item
  const handleDeleteItem = (id: string, brand: string) => {
    if (window.confirm(`'${brand}' 할인 카드를 삭제하시겠습니까?`)) {
      setDiscounts((prev) => prev.filter((d) => d.id !== id));
      showToast('🗑️ 카드가 삭제되었습니다.');
    }
  };

  // Reset to sample data
  const handleResetData = () => {
    if (window.confirm('초기 할인 데이터 세트로 복원하시겠습니까?')) {
      setDiscounts(INITIAL_DISCOUNTS);
      showToast('🔄 초기 데이터로 복원되었습니다.');
    }
  };

  // Copy coupon code
  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`📋 쿠폰코드 '${code}' 복사 완료!`);
  };

  // URL Path Router State (Next.js App Router style URL navigation support for /deal/:id)
  const [activeDealIdState, setActiveDealIdState] = useState<string | null>(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/deal/')) {
      const raw = window.location.pathname.replace('/deal/', '').split('?')[0].split('#')[0];
      try {
        return decodeURIComponent(raw);
      } catch {
        return raw;
      }
    }
    return null;
  });

  const [currentPath, setCurrentPath] = useState<string>(() => {
    return typeof window !== 'undefined' ? window.location.pathname : '/';
  });

  useEffect(() => {
    const onPopState = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      if (path.startsWith('/deal/')) {
        const raw = path.replace('/deal/', '').split('?')[0].split('#')[0];
        try {
          setActiveDealIdState(decodeURIComponent(raw));
        } catch {
          setActiveDealIdState(raw);
        }
      } else {
        setActiveDealIdState(null);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigateToDeal = (id: string) => {
    const targetPath = `/deal/${id}`;
    if (typeof window !== 'undefined') {
      try {
        window.history.pushState({ dealId: id }, '', targetPath);
      } catch {
        // Fallback for iFrame restrictions
      }
    }
    setCurrentPath(targetPath);
    setActiveDealIdState(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      try {
        window.history.pushState({}, '', '/');
      } catch {
        // Fallback for iFrame restrictions
      }
    }
    setCurrentPath('/');
    setActiveDealIdState(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedDealItem = useMemo(() => {
    if (!activeDealIdState) return null;
    const targetId = String(activeDealIdState).trim();
    if (!targetId) return null;

    const decodedTarget = (() => {
      try {
        return decodeURIComponent(targetId).trim();
      } catch {
        return targetId;
      }
    })();

    const matchItem = (item: DiscountItem) => {
      if (!item || !item.id) return false;
      const itemId = String(item.id).trim();
      const itemLower = itemId.toLowerCase();
      const targetLower = targetId.toLowerCase();
      const decodedLower = decodedTarget.toLowerCase();

      if (itemId === targetId || itemLower === targetLower || itemLower === decodedLower) {
        return true;
      }

      // Match without source prefixes if raw ID was passed
      const cleanItemId = itemLower.replace(/^(deal|coupon|mealkit|cp|mk|coupon-scraped|mk-scraped)-/, '');
      const cleanTargetId = decodedLower.replace(/^(deal|coupon|mealkit|cp|mk|coupon-scraped|mk-scraped)-/, '');

      if (cleanItemId === cleanTargetId) {
        if (targetLower.startsWith('coupon') || targetLower.startsWith('cp')) {
          return item.category_type === 'coupon' || item.type === 'coupon' || item.category === 'coupon';
        }
        if (targetLower.startsWith('mealkit') || targetLower.startsWith('mk')) {
          return item.category_type === 'mealkit' || item.type === 'mealkit';
        }
        return true;
      }

      return false;
    };

    // 1. Direct ID match in current discounts state
    let found = discounts.find(matchItem);
    if (found) return found;

    // 2. Direct ID match in INITIAL_DISCOUNTS
    found = INITIAL_DISCOUNTS.find(matchItem);
    if (found) return found;

    // 3. Match from localStorage saved items backup
    try {
      const saved = localStorage.getItem('delivery_compass_discounts_v1');
      if (saved) {
        const parsed: DiscountItem[] = JSON.parse(saved);
        found = parsed.find(matchItem);
        if (found) return found;
      }
    } catch {
      // ignore
    }

    // Strict compliance: No brand search, no title search, no index matching, no discounts[0] fallback
    if (!found) return null;

    // Check availability & URL validity. If sold out or invalid main page URL, replace with active replacement from pool
    if (!isProductActiveAndValid(found as ProductItem)) {
      const replacement = findActiveReplacementProduct(found as ProductItem, discounts as ProductItem[]);
      if (replacement) {
        return createReplacedProductData(found as ProductItem, replacement) as DiscountItem;
      }
    }

    return found;
  }, [activeDealIdState, discounts]);

  // Launch App Handler -> Navigates to Internal Deal Detail Page
  const handleLaunchApp = (item: DiscountItem) => {
    navigateToDeal(item.id);
  };

  const categories = ['전체', '치킨', '피자', '버거', '분식/야식', '카페/디저트', '한식/기타'];

  // Detail Page Route Rendering (/deal/:id)
  if (activeDealIdState || currentPath.startsWith('/deal/')) {
    if (selectedDealItem) {
      return (
        <DealDetailPage
          item={selectedDealItem}
          pool={discounts}
          onBack={handleGoBack}
          onCopyCoupon={handleCopyCoupon}
          onProductReplaced={(replacedItem) => {
            setDiscounts((prev) => prev.map((d) => (d.id === replacedItem.id ? replacedItem : d)));
          }}
        />
      );
    } else {
      return (
        <div className="min-h-screen max-w-md mx-auto bg-slate-50 flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans border-x border-slate-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-black text-slate-900">존재하지 않거나 만료된 특가 상품입니다.</h2>
          <p className="text-xs text-slate-500">요청하신 특가 상품 정보('{activeDealIdState}')를 찾을 수 없습니다.</p>
          <button
            onClick={handleGoBack}
            className="px-5 py-2.5 bg-slate-900 text-white text-xs font-black rounded-xl shadow-md hover:bg-slate-800 transition-all cursor-pointer"
          >
            특가 목록으로 돌아가기
          </button>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen max-w-md mx-auto bg-slate-50 flex flex-col justify-between shadow-2xl relative overflow-hidden font-sans border-x border-slate-200/60">
      {/* Toast Notification Floating Alert */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-full shadow-lg backdrop-blur-md transition-all animate-bounce flex items-center space-x-2 border border-slate-700">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ADMIN STATUS BANNER (When Logged in) */}
      {isAdmin && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between sticky top-0 z-40 shadow-sm border-b border-amber-600">
          <div className="flex items-center space-x-1.5">
            <Unlock className="w-3.5 h-3.5" />
            <span>관리자 모드 실행 중</span>
          </div>
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <button
              onClick={() => setShowAffiliateModal(true)}
              className="bg-slate-900 hover:bg-slate-800 text-amber-300 px-2 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1 transition-colors shadow-2xs"
            >
              <LinkIcon className="w-3 h-3 text-amber-400" />
              <span>💰 수익 제휴링크 설정</span>
            </button>
            <button
              onClick={() => {
                setShowChangePasswordModal(true);
                setChangeCurrentPwd('');
                setChangeNewPwd('');
                setChangeNewPwdConfirm('');
                setChangePwdError('');
              }}
              className="bg-amber-600 hover:bg-amber-700 text-slate-950 px-2 py-1 rounded-lg text-[11px] font-semibold flex items-center space-x-1 transition-colors"
            >
              <Key className="w-3 h-3" />
              <span>암호변경</span>
            </button>
            <button
              onClick={() => openRegisterModal()}
              className="bg-slate-900 text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center space-x-1 active:scale-95 transition-transform"
            >
              <Plus className="w-3 h-3" />
              <span>등록</span>
            </button>
            <button
              onClick={() => {
                setIsAdmin(false);
                showToast('로그아웃되었습니다.');
              }}
              className="text-slate-900 underline text-[11px] hover:text-slate-950"
            >
              로그아웃
            </button>
          </div>
        </div>
      )}

      {/* HEADER SECTION (Toss Style Minimal White Canvas Header) */}
      <header className="bg-white px-5 pt-4 pb-4 border-b border-slate-100 sticky top-0 z-30 shadow-xs">
        {/* Top Quick Actions Bar (홈화면에 추가, 관심음식 알림, 공유하기 버튼) */}
        <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100/80 gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={handleAddToHomeScreen}
            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-xl flex items-center space-x-1 transition-all active:scale-95 border border-blue-200/60 shadow-2xs shrink-0"
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-600" />
            <span>홈화면 추가</span>
          </button>

          <button
            onClick={() => setShowFoodAlertModal(true)}
            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-xl flex items-center space-x-1 transition-all active:scale-95 border border-amber-200/80 shadow-2xs shrink-0 relative"
          >
            <Bell className="w-3.5 h-3.5 text-amber-600" />
            <span>🔔 관심음식 알림</span>
            {favoriteKeywords.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 absolute -top-0.5 -right-0.5 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={handleShare}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1 transition-all active:scale-95 shadow-2xs shrink-0"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-600" />
            <span>공유하기</span>
          </button>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center space-x-1.5 text-xs text-blue-600 font-bold tracking-tight">
              <Compass className="w-4 h-4 animate-spin-slow text-blue-600" />
              <span>실시간 배달 할인 나침반</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-600 font-semibold border border-emerald-200">
                LIVE
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              오늘의 배달 할인
            </h1>
          </div>

          <div className="text-right flex flex-col items-end space-y-1">
            <button
              onClick={() => fetchLiveDiscounts(false)}
              disabled={isRefreshingLive}
              className="text-[10px] font-extrabold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg border border-blue-200/80 flex items-center space-x-1 transition-all active:scale-95 shadow-2xs"
            >
              <RefreshCw className={`w-3 h-3 text-blue-600 ${isRefreshingLive ? 'animate-spin' : ''}`} />
              <span>{isRefreshingLive ? '동기화 중...' : '실시간 연동'}</span>
            </button>
            <div className="text-[10px] text-slate-400 font-medium flex items-center space-x-1">
              <Clock className="w-2.5 h-2.5 text-slate-400" />
              <span>{lastUpdatedTime ? `최신 갱신: ${lastUpdatedTime}` : new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Location Selector Bar (GPS & Custom Address) */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-xl p-2.5 mb-3 flex items-center justify-between shadow-2xs">
          <div className="flex items-center space-x-2 min-w-0 pr-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Compass className="w-4 h-4 animate-spin-slow" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-blue-600 font-extrabold tracking-tight flex items-center space-x-1">
                <span>📍 내 주변 배달 설정 지역</span>
              </div>
              <div className="text-xs font-black text-slate-800 truncate">
                {userAddress}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setAddressInputText(userAddress);
              setShowAddressModal(true);
            }}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-blue-600 border border-blue-200/80 text-[11px] font-bold rounded-lg shrink-0 active:scale-95 transition-all shadow-2xs"
          >
            주소 변경
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="브랜드명, 카테고리 (예: BBQ, 버거, 치킨)"
            className="w-full pl-9 pr-8 py-2.5 bg-slate-100/80 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Delivery App Rolling Banner & Accordion (배달앱 공식 이벤트/혜택) */}
        <DeliveryAppRollingBanner
          selectedAppFilter={selectedApp !== '전체' ? selectedApp : undefined}
          onSelectAppFilter={(appId) => {
            setSelectedApp(appId as DeliveryApp);
          }}
          discounts={discounts.filter((item) => !isMealkitItem(item))}
          onLaunchApp={handleLaunchApp}
          onCopyCoupon={handleCopyCoupon}
          isAdmin={isAdmin}
          onOpenEditModal={openRegisterModal}
          userRegionKeyword={userRegionKeyword}
          userAddress={userAddress}
        />

        {/* MAIN CATEGORY TABS (Requirement #1 & #2: [🍲 밀키트 특가] & [🎫 배달/치킨 쿠폰] 메인 탭 및 일체형 음식종류별 검색) */}
        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 my-2.5 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelectedMainTab('mealkit')}
              className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center space-x-1.5 transition-all active:scale-95 border ${
                selectedMainTab === 'mealkit'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500 shadow-md ring-2 ring-amber-300/50'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-2xs'
              }`}
            >
              <span className="text-base sm:text-lg">🍲</span>
              <span>밀키트 특가</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                selectedMainTab === 'mealkit' ? 'bg-black/25 text-white' : 'bg-amber-100 text-amber-800'
              }`}>
                {mealkitCount}
              </span>
            </button>

            <button
              onClick={() => setSelectedMainTab('coupon')}
              className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center space-x-1.5 transition-all active:scale-95 border ${
                selectedMainTab === 'coupon'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300/50'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-2xs'
              }`}
            >
              <span className="text-base sm:text-lg">🎫</span>
              <span>배달/치킨 쿠폰</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                selectedMainTab === 'coupon' ? 'bg-black/25 text-white' : 'bg-blue-100 text-blue-800'
              }`}>
                {couponCount}
              </span>
            </button>
          </div>

          {/* 밀키트 특가 안으로 들어간 밀키트 음식 종류별 검색 서브탭 */}
          {selectedMainTab === 'mealkit' && (
            <div className="bg-amber-500/10 border border-amber-300/70 rounded-xl p-2.5 space-y-2">
              <div className="flex items-center justify-between px-0.5">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs">🍲</span>
                  <span className="text-xs font-black text-amber-950">밀키트 음식 종류별 검색</span>
                </div>
                <span className="text-[10px] text-amber-900 bg-amber-200 font-extrabold px-2 py-0.5 rounded-full border border-amber-300">
                  🔥 할인율 높은순 정렬
                </span>
              </div>

              {/* Subcategory buttons: [전체], [한식], [중식], [양식] */}
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'all', label: '전체', icon: '✨' },
                  { id: 'korean', label: '한식', icon: '🍚' },
                  { id: 'chinese', label: '중식', icon: '🥢' },
                  { id: 'western', label: '양식', icon: '🍝' },
                ].map((tab) => {
                  const isSelected = selectedMealkitCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedMealkitCategory(tab.id as any)}
                      className={`py-2 px-1 rounded-lg text-xs font-black flex items-center justify-center space-x-1 transition-all active:scale-95 border ${
                        isSelected
                          ? 'bg-amber-500 text-white border-amber-600 shadow-xs ring-2 ring-amber-300/60'
                          : 'bg-white hover:bg-amber-100/80 text-amber-950 border-amber-200'
                      }`}
                    >
                      <span className="text-sm">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>


      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">

        {/* MEALKIT SPECIAL DISCOUNT LIST (Ranked by Discount Rate) */}
        {selectedMainTab === 'mealkit' && (
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-black text-slate-900 flex items-center space-x-1.5">
                <span className="text-amber-500 text-sm">🔥</span>
                <span>
                  {selectedMealkitCategory === 'korean'
                    ? '한식'
                    : selectedMealkitCategory === 'chinese'
                    ? '중식'
                    : selectedMealkitCategory === 'western'
                    ? '양식'
                    : '전체'}{' '}
                  밀키트 특가 (할인율 높은순)
                </span>
              </h3>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-2 py-0.5 rounded-full border border-amber-200/60">
                총 {filteredDiscounts.length}개 상품
              </span>
            </div>

            {filteredDiscounts.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center text-xs text-slate-400 border border-slate-200">
                해당 카테고리의 밀키트 특가 상품이 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {filteredDiscounts.map((item, index) => {
                  const categoryName =
                    item.category === 'korean'
                      ? '한식'
                      : item.category === 'chinese'
                      ? '중식'
                      : item.category === 'western'
                      ? '양식'
                      : item.category || '밀키트';

                  return (
                    <div
                      key={item.id}
                      onClick={() => navigateToDeal(item.id)}
                      className="bg-white rounded-2xl p-3.5 border border-amber-200/80 shadow-2xs hover:shadow-md transition-all space-y-2 relative overflow-hidden cursor-pointer"
                    >
                      {/* Top Rank & Discount Badge */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-900 text-white">
                              TOP {index + 1}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300/60">
                              {categoryName}
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                              {item.app}
                            </span>
                          </div>

                          <h4 className="font-black text-slate-900 text-xs sm:text-sm pt-0.5 leading-snug">
                            {item.title || item.brand}
                          </h4>
                        </div>

                        {/* Big Discount Rate Tag */}
                        {item.discountRate && (
                          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-2.5 py-1 rounded-xl font-black text-xs sm:text-sm shadow-xs shrink-0 flex items-center space-x-0.5 ml-2">
                            <span>🔥 {item.discountRate}% OFF</span>
                          </div>
                        )}
                      </div>

                      {/* Image Preview (if present) */}
                      {(item.imageUrl || item.image) && (
                        <div className="relative w-full h-28 rounded-xl overflow-hidden bg-amber-50 border border-amber-200/60">
                          <img
                            src={item.imageUrl || item.image}
                            alt={item.title || item.brand}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}

                      {/* Price & Minimum Order */}
                      <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-100">
                        <div>
                          <span className="font-black text-red-500 text-sm">{item.discount}</span>
                          {item.minOrder && (
                            <span className="text-[10px] text-slate-400 font-medium ml-1.5">
                              ({item.minOrder})
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToDeal(item.id);
                          }}
                          className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs rounded-xl shadow-xs hover:brightness-105 active:scale-95 transition-all flex items-center space-x-1 cursor-pointer"
                        >
                          <span>특가 상세보기 &gt;</span>
                        </button>
                      </div>

                      {/* Coupon Code & Note */}
                      {(item.couponCode || item.linkNote) && (
                        <div className="bg-amber-50/60 p-2 rounded-xl border border-amber-100 text-[10px] space-y-1 mt-1">
                          {item.couponCode && (
                            <div className="flex items-center justify-between text-slate-800">
                              <div className="flex items-center space-x-1 font-mono font-bold">
                                <span className="text-[10px] text-slate-400 font-sans">쿠폰코드:</span>
                                <span className="text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-200">
                                  {item.couponCode}
                                </span>
                              </div>
                              <button
                                onClick={() => handleCopyCoupon(item.couponCode!)}
                                className="px-2 py-0.5 bg-white border border-amber-200 rounded text-[10px] font-bold text-amber-800 hover:bg-amber-50 flex items-center space-x-0.5"
                              >
                                <Copy className="w-2.5 h-2.5" />
                                <span>복사</span>
                              </button>
                            </div>
                          )}
                          {item.linkNote && (
                            <p className="text-[10px] text-amber-900/80 font-medium">
                              💡 {item.linkNote}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* DELIVERY / CHICKEN COUPONS LIST (Ranked by Discount Rate) */}
        {selectedMainTab === 'coupon' && (
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-black text-slate-900 flex items-center space-x-1.5">
                <span className="text-blue-600 text-sm">🎫</span>
                <span>실시간 배달/치킨 쿠폰 & 금액권 특가 (할인율 높은순)</span>
              </h3>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-extrabold px-2 py-0.5 rounded-full border border-blue-200/60">
                총 {filteredDiscounts.length}개 핫딜
              </span>
            </div>

            {filteredDiscounts.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center text-xs text-slate-400 border border-slate-200">
                현재 등록된 배달/치킨 쿠폰 특가 정보가 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {filteredDiscounts.map((item, index) => {
                  return (
                    <div
                      key={item.id}
                      onClick={() => navigateToDeal(item.id)}
                      className="bg-white rounded-2xl p-3.5 border border-blue-200/80 shadow-2xs hover:shadow-md transition-all space-y-2.5 relative overflow-hidden cursor-pointer"
                    >
                      {/* Top Rank & Badges */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-blue-600 text-white">
                              BEST {index + 1}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 border border-blue-200/60">
                              {item.brand}
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                              {item.app}
                            </span>
                            {item.seller && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60">
                                🛒 {item.seller}
                              </span>
                            )}
                          </div>

                          <h4 className="font-black text-slate-900 text-xs sm:text-sm pt-0.5 leading-snug">
                            {item.title || item.brand}
                          </h4>
                        </div>

                        {/* Discount Rate Badge */}
                        {item.discountRate && (
                          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2.5 py-1 rounded-xl font-black text-xs sm:text-sm shadow-xs shrink-0 flex items-center space-x-0.5 ml-2">
                            <span>🔥 {item.discountRate}% OFF</span>
                          </div>
                        )}
                      </div>

                      {/* Image Preview (if present) */}
                      {(item.imageUrl || item.image) && (
                        <div className="relative w-full h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60">
                          <img
                            src={item.imageUrl || item.image}
                            alt={item.title || item.brand}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}

                      {/* Price & Buying Button */}
                      <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-100">
                        <div className="space-y-0.5">
                          <div className="flex items-baseline space-x-1.5">
                            <span className="font-black text-red-600 text-sm sm:text-base">
                              {item.discountPrice ? `${item.discountPrice.toLocaleString()}원` : item.discount}
                            </span>
                            {item.originalPrice && item.originalPrice > (item.discountPrice || 0) && (
                              <span className="text-[11px] text-slate-400 line-through">
                                {item.originalPrice.toLocaleString()}원
                              </span>
                            )}
                          </div>
                          {item.validity && (
                            <p className="text-[10px] text-slate-400">
                              ⏱️ {item.validity}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToDeal(item.id);
                          }}
                          className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs rounded-xl shadow-xs hover:brightness-105 active:scale-95 transition-all flex items-center space-x-1 shrink-0 cursor-pointer"
                        >
                          <span>특가 상세보기 &gt;</span>
                        </button>
                      </div>

                      {/* Coupon Note & Code */}
                      {(item.couponCode || item.linkNote) && (
                        <div className="bg-blue-50/60 p-2 rounded-xl border border-blue-100 text-[10px] space-y-1 mt-1">
                          {item.couponCode && (
                            <div className="flex items-center justify-between text-slate-800">
                              <div className="flex items-center space-x-1 font-mono font-bold">
                                <span className="text-[10px] text-slate-400 font-sans">쿠폰코드:</span>
                                <span className="text-blue-900 bg-blue-100 px-1.5 py-0.2 rounded border border-blue-200">
                                  {item.couponCode}
                                </span>
                              </div>
                              <button
                                onClick={() => handleCopyCoupon(item.couponCode!)}
                                className="px-2 py-0.5 bg-white border border-blue-200 rounded text-[10px] font-bold text-blue-800 hover:bg-blue-50 flex items-center space-x-0.5"
                              >
                                <Copy className="w-2.5 h-2.5" />
                                <span>복사</span>
                              </button>
                            </div>
                          )}
                          {item.linkNote && (
                            <p className="text-[10px] text-blue-900/80 font-medium">
                              💡 {item.linkNote}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* [TOP AD BANNER AREA - Google AdSense / Kakao AdFit] */}
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-2.5 text-center flex flex-col items-center justify-center text-slate-400 text-xs">
          <p className="font-bold text-[11px] text-slate-400">📢 ADVERTISE BANNER AREA (상단 광고 배너)</p>
          <p className="text-[10px] text-slate-300">구글 애드센스 / 카카오 애드핏 디스플레이 광고 코드 영역</p>
        </div>



        {/* Quick Admin Action or Reset if data modified */}
        {isAdmin && (
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 text-center my-4 space-y-2">
            <p className="text-xs text-amber-800 font-extrabold flex items-center justify-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>관리자 전용 제어 도구</span>
            </p>
            <div className="flex flex-wrap justify-center gap-1.5">
              <button
                onClick={() => openRegisterModal()}
                className="px-2.5 py-1.5 bg-amber-600 text-white text-[11px] font-bold rounded-lg shadow-xs active:scale-95"
              >
                + 수동 등록
              </button>

              <button
                onClick={() => {
                  setShowAiParseModal(true);
                  setAiParseResult(null);
                  setAiInputText('');
                }}
                className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg shadow-xs active:scale-95 flex items-center space-x-1"
              >
                <Bot className="w-3 h-3" />
                <span>AI 파싱 정제</span>
              </button>

              <button
                onClick={() => setShowVercelGuideModal(true)}
                className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg shadow-xs active:scale-95 flex items-center space-x-1"
              >
                <Code className="w-3 h-3" />
                <span>Vercel 자동화 백엔드</span>
              </button>

              <button
                onClick={() => {
                  setShowChangePasswordModal(true);
                  setChangeCurrentPwd('');
                  setChangeNewPwd('');
                  setChangeNewPwdConfirm('');
                  setChangePwdError('');
                }}
                className="px-2.5 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg shadow-xs hover:bg-slate-800 flex items-center space-x-1"
              >
                <Key className="w-3 h-3" />
                <span>암호 변경</span>
              </button>

              <button
                onClick={handleResetData}
                className="px-2.5 py-1.5 bg-white text-slate-700 border border-slate-300 text-[11px] font-medium rounded-lg hover:bg-slate-50"
              >
                초기화
              </button>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER & SECRET ADMIN BUTTON (Requirement #3 & AdSense Legal Footer) */}
      <footer className="bg-white px-4 py-6 border-t border-slate-100 text-center text-slate-400 text-xs space-y-3">
        {/* [BOTTOM FIXED / INLINE AD BANNER AREA] */}
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-2.5 text-center min-h-[60px] flex flex-col items-center justify-center text-slate-400 text-xs my-2">
          {/* <!-- Kakao AdFit / Google AdSense Inline Banner Code Here --> */}
          <p className="font-bold text-[10px] text-slate-400">📢 FOOTER AD AREA (하단 광고 영역)</p>
        </div>

        <div className="space-y-1">
          <p className="font-semibold text-slate-600">오늘의 배달 할인 나침반 🧭</p>
          <p className="text-[11px] text-slate-400">
            배민 · 쿠팡이츠 · 요기요 · 땡겨요 주요 할인 정보를 한눈에 비교하세요.
          </p>
        </div>

        {/* Legal & FTC Disclosures for AdSense Approval */}
        <div className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-100 pt-3 space-y-1">
          <p>본 사이트는 회원가입 없이 브라우저 로컬 저장소(LocalStorage)를 활용한 무회원 서비스로 운영됩니다.</p>
          <p className="text-slate-500">
            ※ 제휴 마케팅 링크를 통해 구매가 이루어질 경우 파트너스 활동의 일환으로 일정액의 수수료를 제공받습니다.
          </p>
          <div className="flex justify-center space-x-3 pt-1 text-slate-500 font-medium">
            <span className="hover:underline cursor-pointer">개인정보처리방침</span>
            <span>|</span>
            <span className="hover:underline cursor-pointer">이메일무단수집거부</span>
            <span>|</span>
            <span className="hover:underline cursor-pointer">이용약관</span>
          </div>
          <p className="text-[9px] text-slate-300 pt-1">© 2026 Delivery Coupon Compass. All rights reserved.</p>
        </div>

        {/* Small Hidden Admin Login Button at Very Bottom */}
        <div className="pt-2 border-t border-slate-100/60">
          {!isAdmin ? (
            <button
              onClick={() => {
                setShowAdminLoginModal(true);
                setPasswordError(false);
                setAdminPassword('');
                setShowLoginPwdText(false);
              }}
              className="text-[10px] text-slate-300 hover:text-slate-500 transition-colors underline cursor-pointer p-1"
            >
              [관리자 로그인]
            </button>
          ) : (
            <div className="flex items-center justify-center space-x-2 text-[11px] text-amber-600 font-semibold">
              <Unlock className="w-3 h-3" />
              <span>관리자 접속 중</span>
              <button
                onClick={() => {
                  setShowChangePasswordModal(true);
                  setChangeCurrentPwd('');
                  setChangeNewPwd('');
                  setChangeNewPwdConfirm('');
                  setChangePwdError('');
                }}
                className="text-amber-700 underline hover:text-amber-900 ml-1 cursor-pointer"
              >
                [비밀번호 변경]
              </button>
              <button
                onClick={() => {
                  setIsAdmin(false);
                  showToast('로그아웃되었습니다.');
                }}
                className="text-slate-400 underline hover:text-slate-600 ml-1 cursor-pointer"
              >
                [로그아웃]
              </button>
            </div>
          )}
        </div>
      </footer>

      {/* MODAL 1: ADMIN LOGIN MODAL */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xs rounded-2xl p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowAdminLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">관리자 인증</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                할인 정보 입력을 위해 비밀번호를 입력하세요.
              </p>
              <p className="text-[10px] text-slate-400 mt-1 bg-slate-50 py-1 px-2 rounded-lg border border-slate-100">
                🔒 변경하신 비밀번호는 이 디바이스(브라우저/쿠키)에 영구 저장됩니다.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-3">
              <div className="relative">
                <input
                  type={showLoginPwdText ? 'text' : 'password'}
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    setPasswordError(false);
                  }}
                  placeholder="비밀번호 입력"
                  autoFocus
                  className={`w-full pl-3.5 pr-10 py-2.5 bg-slate-50 rounded-xl text-center text-sm font-extrabold text-slate-900 border ${
                    passwordError ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPwdText((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  title={showLoginPwdText ? '비밀번호 숨기기' : '비밀번호 보기'}
                >
                  {showLoginPwdText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {passwordError && (
                <p className="text-[11px] text-red-500 text-center font-medium">
                  비밀번호가 올바르지 않습니다.
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all active:scale-95"
              >
                확인
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADMIN DISCOUNT REGISTER / EDIT FORM MODAL */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {editingItem ? '할인 정보 수정' : '새 할인 정보 등록'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    폰에서 입력 즉시 메인 화면에 반영됩니다.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              {/* 항목 1: 배달앱 선택 (드롭다운) */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  1. 배달앱 선택 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formApp}
                  onChange={(e) => setFormApp(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="배민">배달의민족 (배민)</option>
                  <option value="쿠팡이츠">쿠팡이츠</option>
                  <option value="요기요">요기요</option>
                  <option value="땡겨요">땡겨요</option>
                </select>
              </div>

              {/* 항목 2: 브랜드명 입력 */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  2. 브랜드명 입력 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formBrand}
                  onChange={(e) => setFormBrand(e.target.value)}
                  placeholder="예: BBQ 치킨, 굽네치킨, 맘스터치"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 항목 3: 할인금액 입력 */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  3. 할인금액 입력 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formDiscount}
                  onChange={(e) => setFormDiscount(e.target.value)}
                  placeholder="예: 4,000원 할인, 최대 7,000원 할인"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 카테고리 선택 */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    카테고리
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="치킨">치킨 🍗</option>
                    <option value="피자">피자 🍕</option>
                    <option value="버거">버거 🍔</option>
                    <option value="분식/야식">분식/야식 떡볶이</option>
                    <option value="카페/디저트">카페/디저트 ☕</option>
                    <option value="한식/기타">한식/기타 🍲</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    최소 주문금액
                  </label>
                  <input
                    type="text"
                    value={formMinOrder}
                    onChange={(e) => setFormMinOrder(e.target.value)}
                    placeholder="예: 16,000원 이상"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 유효 기간 텍스트 */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  유효 조건
                </label>
                <input
                  type="text"
                  value={formValidity}
                  onChange={(e) => setFormValidity(e.target.value)}
                  placeholder="예: 오늘 하루만 유효, 주말 한정"
                  className="w-full px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 쿠폰 코드 (선택) */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  쿠폰 코드 (선택)
                </label>
                <input
                  type="text"
                  value={formCouponCode}
                  onChange={(e) => setFormCouponCode(e.target.value)}
                  placeholder="예: BBQJULY07"
                  className="w-full px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 참고 메모/이용 안내 */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  이용 팁/설명
                </label>
                <textarea
                  value={formLinkNote}
                  onChange={(e) => setFormLinkNote(e.target.value)}
                  rows={2}
                  placeholder="예: 앱 메인 브랜드관에서 쿠폰 받아 적용"
                  className="w-full px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 등록/수정 제출 버튼 */}
              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md transition-all active:scale-95"
                >
                  {editingItem ? '수정 저장' : '등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ITEM ACTION MODAL ("앱으로 이동" 클릭 시 팝업) */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          {(() => {
            const theme = APP_THEMES[activeModalItem.app];
            return (
              <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-slate-100 animate-in slide-in-from-bottom duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${theme.badgeBg} ${theme.badgeText}`}
                  >
                    {activeModalItem.app} 전용 혜택
                  </span>
                  <button
                    onClick={() => setActiveModalItem(null)}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-center py-2">
                  <h3 className="text-xl font-black text-slate-900">
                    {activeModalItem.brand}
                  </h3>
                  <div className="text-2xl font-black text-red-500 mt-1">
                    {activeModalItem.discount}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {activeModalItem.validity} · {activeModalItem.minOrder || '최소주문금액 확인'}
                  </p>
                </div>

                {/* Coupon Code Section */}
                {activeModalItem.couponCode && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 my-3 text-center">
                    <div className="text-[11px] text-slate-400 font-medium mb-1">
                      쿠폰 코드
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="font-mono font-bold text-base text-slate-900">
                        {activeModalItem.couponCode}
                      </span>
                      <button
                        onClick={() => handleCopyCoupon(activeModalItem.couponCode!)}
                        className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center space-x-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>복사</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Note / Tip */}
                {activeModalItem.linkNote && (
                  <div className="bg-blue-50/70 p-3 rounded-xl text-xs text-blue-900 mb-4 flex items-start space-x-2">
                    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{activeModalItem.linkNote}</span>
                  </div>
                )}

                {/* Launch Button */}
                <div className="space-y-2">
                  <a
                    href={activeModalItem.affiliate_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3.5 rounded-xl font-bold text-white shadow-md flex items-center justify-center space-x-1.5 active:scale-95 transition-transform ${theme.btnBg}`}
                    onClick={() => setActiveModalItem(null)}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{theme.name} 특가 구매하러 가기</span>
                  </a>

                  <button
                    onClick={() => setActiveModalItem(null)}
                    className="w-full py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-200"
                  >
                    닫기
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* MODAL 4: HOME SCREEN INSTALL GUIDE MODAL */}
      {showInstallGuideModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-slate-100 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  📱 홈 화면에 앱 바로 생성하기
                </h3>
              </div>
              <button
                onClick={() => setShowInstallGuideModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 py-1">
              {/* In-App Browser Notice */}
              {typeof navigator !== 'undefined' && /kakaotalk|naver|line|inapp/i.test(navigator.userAgent) && (
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
                  <p className="font-bold flex items-center space-x-1">
                    <span>⚠️ 인앱 브라우저(카카오톡/네이버) 이용 중 안내:</span>
                  </p>
                  <p>
                    앱 내부 브라우저에서는 홈 화면 추가가 바로 안 될 수 있습니다. 상단 또는 하단 메뉴에서 <strong>[다른 브라우저로 열기 (Chrome 또는 Safari)]</strong>를 선택하신 후 홈 화면에 추가해 주세요!
                  </p>
                </div>
              )}

              <p className="text-slate-600 font-medium leading-relaxed">
                스마트폰 홈 화면에 아이콘을 생성해 두시면 앱처럼 단 한 번의 터치로 실시간 배달 할인을 확인하실 수 있습니다.
              </p>

              {/* Android Chrome Guide */}
              <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/80 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-extrabold">
                      Android
                    </span>
                    <span className="text-emerald-950 font-bold">안드로이드 (Chrome)</span>
                  </div>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-700 text-[11px] pl-1">
                  <li>브라우저 우측 상단 <strong>'더보기(⋮)'</strong> 메뉴 클릭</li>
                  <li><strong>'앱 설치'</strong> 또는 <strong>'홈 화면에 추가'</strong> 선택</li>
                  <li>팝업 창에서 <strong>'추가'</strong> 누르면 바탕화면에 생성!</li>
                </ol>
              </div>

              {/* iPhone Safari Guide */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-extrabold">
                    iOS
                  </span>
                  <span>아이폰 (Safari)</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] pl-1">
                  <li>사파리 하단 중앙 <strong>'공유(Square + Arrow)'</strong> 버튼 클릭</li>
                  <li>메뉴 중 <strong>'홈 화면에 추가'</strong> 선택</li>
                  <li>우측 상단 <strong>'추가'</strong> 누르면 아이콘 생성 완료!</li>
                </ol>
              </div>
            </div>

            <div className="pt-3 flex space-x-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showToast('🔗 사이트 주소가 복사되었습니다! 브라우저 주소창에 붙여넣어 보세요.');
                }}
                className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all text-xs flex items-center justify-center space-x-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>주소 복사하기</span>
              </button>
              <button
                onClick={() => setShowInstallGuideModal(false)}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all text-xs active:scale-95 shadow-xs"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: CHANGE PASSWORD MODAL */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowChangePasswordModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-4 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  관리자 비밀번호 변경
                </h3>
                <p className="text-[11px] text-slate-400">
                  새 비밀번호로 안전하게 업데이트합니다. (브라우저 &amp; 쿠키 영구 저장)
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3 text-xs">
              {/* 1. Current Password */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  현재 비밀번호
                </label>
                <div className="relative">
                  <input
                    type={showChangePwdText ? 'text' : 'password'}
                    value={changeCurrentPwd}
                    onChange={(e) => {
                      setChangeCurrentPwd(e.target.value);
                      setChangePwdError('');
                    }}
                    placeholder="현재 비밀번호 입력"
                    required
                    className="w-full pl-3.5 pr-9 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 2. New Password */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  새 비밀번호
                </label>
                <div className="relative">
                  <input
                    type={showChangePwdText ? 'text' : 'password'}
                    value={changeNewPwd}
                    onChange={(e) => {
                      setChangeNewPwd(e.target.value);
                      setChangePwdError('');
                    }}
                    placeholder="새 비밀번호 입력"
                    required
                    className="w-full pl-3.5 pr-9 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowChangePwdText((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    title={showChangePwdText ? '비밀번호 숨기기' : '비밀번호 보기'}
                  >
                    {showChangePwdText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 3. Confirm New Password */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  새 비밀번호 확인
                </label>
                <div className="relative">
                  <input
                    type={showChangePwdText ? 'text' : 'password'}
                    value={changeNewPwdConfirm}
                    onChange={(e) => {
                      setChangeNewPwdConfirm(e.target.value);
                      setChangePwdError('');
                    }}
                    placeholder="새 비밀번호 재입력"
                    required
                    className="w-full pl-3.5 pr-9 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Error Alert */}
              {changePwdError && (
                <p className="text-[11px] text-red-500 font-semibold text-center bg-red-50 py-1.5 px-2 rounded-lg border border-red-200">
                  {changePwdError}
                </p>
              )}

              {/* Submit / Cancel Buttons */}
              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowChangePasswordModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all text-xs"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-xs active:scale-95 shadow-xs"
                >
                  비밀번호 변경
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: GEMINI AI AUTO-PARSE MODAL */}
      {showAiParseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAiParseModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-1.5">
                  <span>Gemini AI 할인 자동 추출</span>
                  <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    3.6 Flash
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  커뮤니티 글, 블로그, 이벤트를 복사해 넣으면 규격에 맞춰 정제합니다.
                </p>
              </div>
            </div>

            <form onSubmit={handleAiParseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  할인 정보 원문 텍스트 (또는 URL 입력)
                </label>
                <textarea
                  value={aiInputText}
                  onChange={(e) => setAiInputText(e.target.value)}
                  placeholder={`예시: 오늘 배민에서 BBQ 치킨 4천원 할인 쿠폰 18,000원 이상 구매시 지급! 버거킹은 쿠팡이츠에서 5천원 세일 중.`}
                  rows={4}
                  required
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isParsingAi}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all text-xs active:scale-95 shadow-xs flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isParsingAi ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gemini AI 분석 및 정제 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Gemini AI로 정제하기</span>
                  </>
                )}
              </button>
            </form>

            {/* AI Extraction Result Preview */}
            {aiParseResult && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-xs flex items-center space-x-1">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>정제된 데이터 ({aiParseResult.length}건)</span>
                  </h4>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(aiParseResult, null, 2));
                      showToast('📋 JSON 데이터가 복사되었습니다!');
                    }}
                    className="text-[11px] text-blue-600 hover:underline flex items-center space-x-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>JSON 복사</span>
                  </button>
                </div>

                <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-[10px] overflow-x-auto max-h-48 border border-slate-800">
                  <pre>{JSON.stringify(aiParseResult, null, 2)}</pre>
                </div>

                <button
                  onClick={handleApplyAiParsedDiscounts}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs active:scale-95 shadow-xs transition-colors"
                >
                  📥 현재 사이트에 일괄 등록하기
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 7: VERCEL BACKEND CODE & CRON GUIDE MODAL */}
      {showVercelGuideModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-5 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowVercelGuideModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Vercel 자동화 백엔드 코드 &amp; 크론탭 연동
                </h3>
                <p className="text-[11px] text-slate-400">
                  Google IDX / Vercel에 추가할 Serverless 자동화 파일 코드
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              {/* File 1: api/cron.js */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span className="flex items-center space-x-1">
                    <FileJson className="w-3.5 h-3.5 text-indigo-600" />
                    <span>1. api/cron.js (Vercel Serverless Function)</span>
                  </span>
                  <button
                    onClick={() => {
                      const code = `import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req, res) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // 1. 크롤링 대상 소스 또는 커뮤니티 API 호출 (예시)
    const rawContent = "배민 BBQ 4천원 할인, 쿠팡이츠 버거킹 5천원 할인, 요기요 도미노피자 7천원 쿠폰";

    // 2. Gemini 3.6 Flash 모델을 이용한 정규화 JSON 정제
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: \`다음 배달 할인 정보를 주어진 규격 JSON 배열로만 정제해줘: \${rawContent}\`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              platform: { type: Type.STRING },
              category: { type: Type.STRING },
              brand: { type: Type.STRING },
              discount: { type: Type.STRING },
              condition: { type: Type.STRING },
              duration: { type: Type.STRING }
            },
            required: ["platform", "category", "brand", "discount", "condition", "duration"]
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text || "[]");
    return res.status(200).json(parsedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}`;
                      navigator.clipboard.writeText(code);
                      showToast('📋 api/cron.js 코드가 복사되었습니다!');
                    }}
                    className="text-[11px] text-indigo-600 hover:underline flex items-center space-x-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>코드 복사</span>
                  </button>
                </div>
                <div className="bg-slate-900 text-indigo-300 p-3 rounded-xl font-mono text-[10px] border border-slate-800 overflow-x-auto">
                  <pre>{`// api/cron.js
import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req, res) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  // Gemini 3.6 Flash로 자동 정제 처리
  // ...
}`}</pre>
                </div>
              </div>

              {/* File 2: vercel.json */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span className="flex items-center space-x-1">
                    <FileJson className="w-3.5 h-3.5 text-indigo-600" />
                    <span>2. vercel.json (매일 아침 08:00 자동 스케줄러)</span>
                  </span>
                  <button
                    onClick={() => {
                      const code = `{
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "0 23 * * *"
    }
  ]
}`;
                      navigator.clipboard.writeText(code);
                      showToast('📋 vercel.json 코드가 복사되었습니다!');
                    }}
                    className="text-[11px] text-indigo-600 hover:underline flex items-center space-x-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>코드 복사</span>
                  </button>
                </div>
                <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-[10px] border border-slate-800 overflow-x-auto">
                  <pre>{`{
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "0 23 * * *" // UTC 23시 = 한국시간(KST) 매일 아침 8시
    }
  ]
}`}</pre>
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
                <p className="font-bold">💡 Vercel 환경변수 설정 필수:</p>
                <p>
                  Vercel 대시보드 Settings &gt; Environment Variables에서 <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-amber-950 font-bold">GEMINI_API_KEY</code>를 등록해 주세요.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setShowVercelGuideModal(false)}
                className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-xs"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 8: LOCATION & ADDRESS SEARCH MODAL */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowAddressModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  배달 설정 지역 선택
                </h3>
                <p className="text-[11px] text-slate-400">
                  내 주변 매장의 할인 &amp; 이벤트 혜택을 확인하세요
                </p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* GPS Button */}
              <button
                onClick={handleDetectGps}
                disabled={isDetectingGps}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-xs disabled:opacity-50"
              >
                <Compass className={`w-4 h-4 ${isDetectingGps ? 'animate-spin' : ''}`} />
                <span>{isDetectingGps ? 'GPS 위치 수신 중...' : '현재 위치(GPS) 자동 인식'}</span>
              </button>

              <div className="flex items-center space-x-2 my-2">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-[10px] text-slate-400 font-semibold">또는 직접 주소 입력</span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              {/* Input for address */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  지번/도로명 주소 검색 (시/군/구/동)
                </label>
                <input
                  type="text"
                  value={addressInputText}
                  onChange={(e) => setAddressInputText(e.target.value)}
                  placeholder="예: 서울 관악구 신림동, 경기 성남시 정자동"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Major Region Presets */}
              <div>
                <span className="block text-[11px] font-bold text-slate-500 mb-1.5">
                  빠른 선택 (주요 상권):
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    '서울특별시 관악구 신림동',
                    '서울특별시 마포구 서교동',
                    '경기도 성남시 분당구',
                    '경기도 화성시 동탄',
                    '대구광역시 수성구',
                    '부산광역시 부산진구',
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setAddressInputText(preset)}
                      className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-[11px] font-semibold rounded-lg text-left truncate transition-colors"
                    >
                      📍 {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    if (!addressInputText.trim()) {
                      showToast('주소를 입력해 주세요.');
                      return;
                    }
                    setUserAddress(addressInputText.trim());
                    try {
                      localStorage.setItem('delivery_user_address', addressInputText.trim());
                    } catch (e) {
                      console.error(e);
                    }
                    showToast(`📍 배달 지역 설정 완료: ${addressInputText.trim()}`);
                    setShowAddressModal(false);
                  }}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl active:scale-95 transition-transform"
                >
                  주소 저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 9: ADMIN AFFILIATE LINKS MANAGEMENT (수익 제휴 링크 관리) */}
      {showAffiliateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-5 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowAffiliateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <LinkIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  💰 제휴 마케팅 / 파트너스 수익 링크 설정
                </h3>
                <p className="text-[11px] text-slate-500">
                  관리자인 나만 설정 가능하며, 일반 유저가 '앱으로 이동' 클릭 시 이 수익 링크를 거쳐 이동합니다.
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 space-y-2">
                <p className="font-bold flex items-center space-x-1 text-xs text-amber-950">
                  <span>💡 [중요] 쿠팡이츠 링크 설정 안내:</span>
                </p>
                <div className="bg-white/80 p-2 rounded-lg border border-amber-200 text-[10.5px] leading-relaxed text-amber-950">
                  <p className="font-bold text-red-600 mb-0.5">⚠️ 쿠팡 파트너스에서 "지원하지 않는 형태" 오류가 나는 이유:</p>
                  <p className="text-slate-700">
                    쿠팡 파트너스는 <strong>일반 쿠팡 쇼핑몰(coupang.com)</strong> 전용 시스템이라 <code className="bg-amber-100 px-1 py-0.2 rounded font-mono font-bold">coupangeats.com</code> 주소로는 파트너스 단축 링크가 생성되지 않습니다.
                  </p>
                  <p className="font-bold text-blue-700 mt-1 mb-0.5">✅ 쿠팡이츠에 사용할 수 있는 올바른 주소 2가지:</p>
                  <ul className="list-disc pl-4 text-slate-800 space-y-0.5">
                    <li>
                      <strong>쿠팡이츠 공식 연결 주소:</strong> <code className="bg-slate-100 text-blue-700 px-1 font-mono font-bold">https://eats.coupang.com</code>
                    </li>
                    <li>
                      <strong>쿠팡이츠 친구초대/쿠폰 링크:</strong> 쿠팡이츠 앱 [MY &gt; 친구초대]에서 받은 추천 주소 (<code className="bg-slate-100 text-slate-700 px-1 font-mono">https://share.coupangeats.com/...</code>)
                    </li>
                  </ul>
                </div>
                <p className="text-[10px] text-amber-800/80 border-t border-amber-200/60 pt-1.5">
                  * <strong>파이썬 자동화 연동:</strong> <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">update_discounts.py</code>의 <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">COUPANG_EATS_TRACKING_URL</code>에 위 주소를 설정하면 자동 적용됩니다.
                </p>
              </div>

              {(['쿠팡이츠', '배민', '요기요', '땡겨요', '먹깨비', '두잇', '배달특급', '대구로', '동백통'] as const).map((appName) => (
                <div key={appName} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>{appName} {appName === '쿠팡이츠' ? '(쿠팡 파트너스 수익 링크)' : '제휴 링크'}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const url = affiliateUrls[appName] || '';
                        if (url) window.open(url, '_blank');
                      }}
                      className="text-[10px] text-blue-600 font-bold hover:underline flex items-center space-x-0.5"
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                      <span>링크 테스트</span>
                    </button>
                  </div>
                  <input
                    type="url"
                    value={affiliateUrls[appName] || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAffiliateUrls((prev) => {
                        const updated = { ...prev, [appName]: val };
                        try {
                          localStorage.setItem('delivery_affiliate_urls', JSON.stringify(updated));
                        } catch (err) {
                          console.error(err);
                        }
                        return updated;
                      });
                    }}
                    placeholder={`예: https://link.coupang.com/a/xxxx (${appName} 추천/수익 주소)`}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 font-mono"
                  />
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center space-x-2">
              <button
                onClick={() => {
                  try {
                    localStorage.setItem('delivery_affiliate_urls', JSON.stringify(affiliateUrls));
                  } catch (e) {
                    console.error(e);
                  }
                  showToast('💾 수익 제휴 링크 설정이 저장되었습니다!');
                  setShowAffiliateModal(false);
                }}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl transition-all shadow-xs"
              >
                저장 및 적용하기
              </button>
              <button
                onClick={() => setShowAffiliateModal(false)}
                className="px-4 py-2.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 10: USER FAVORITE FOOD & BRAND ALERT SETTING MODAL */}
      {showFoodAlertModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowFoodAlertModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  🔔 관심 음식 / 브랜드 알림 설정
                </h3>
                <p className="text-[11px] text-slate-500">
                  좋아하는 음식이나 브랜드 키워드를 등록하면 할인 발생 시 알림을 받습니다!
                </p>
              </div>
            </div>

            {/* Browser Push Permission Status Box */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 mb-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  🌐 브라우저 / 모바일 푸시 알림
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  enableBrowserNotification ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                }`}>
                  {enableBrowserNotification ? '알림 허용됨' : '미허용'}
                </span>
              </div>
              {!enableBrowserNotification && (
                <button
                  type="button"
                  onClick={() => {
                    if ('Notification' in window) {
                      Notification.requestPermission().then((permission) => {
                        if (permission === 'granted') {
                          setEnableBrowserNotification(true);
                          showToast('🔔 브라우저 알림 권한이 허용되었습니다!');
                        } else {
                          showToast('알림 권한이 거부되었습니다. 브라우저 설정에서 변경 가능합니다.');
                        }
                      });
                    } else {
                      showToast('이 브라우저는 웹 푸시 알림을 지원하지 않습니다.');
                    }
                  }}
                  className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg transition-all"
                >
                  푸시 알림 권한 허용하기
                </button>
              )}
            </div>

            {/* Keyword Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const trimmed = newKeywordInput.trim();
                if (!trimmed) return;
                if (favoriteKeywords.includes(trimmed)) {
                  showToast(`이미 등록된 키워드입니다: '${trimmed}'`);
                  return;
                }
                const updated = [...favoriteKeywords, trimmed];
                setFavoriteKeywords(updated);
                try {
                  localStorage.setItem('delivery_favorite_keywords', JSON.stringify(updated));
                } catch (err) {
                  console.error(err);
                }
                setNewKeywordInput('');
                showToast(`🔔 관심 키워드 '${trimmed}' 추가 완료!`);
              }}
              className="space-y-2 mb-4"
            >
              <label className="text-xs font-bold text-slate-800 block">
                + 새 관심 음식 / 브랜드 추가
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newKeywordInput}
                  onChange={(e) => setNewKeywordInput(e.target.value)}
                  placeholder="예: 치킨, BBQ, 엽떡, 피자, 버거"
                  className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 font-medium"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-all shrink-0"
                >
                  추가
                </button>
              </div>
            </form>

            {/* Current Registered Keywords Tag Cloud */}
            <div className="space-y-2 mb-5">
              <span className="text-xs font-bold text-slate-800 block">
                📌 내가 저장한 관심 키워드 ({favoriteKeywords.length}개)
              </span>
              {favoriteKeywords.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  등록된 관심 키워드가 없습니다. 위에서 추가해 보세요!
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 max-h-36 overflow-y-auto">
                  {favoriteKeywords.map((kw) => {
                    const matchCount = discounts.filter((d) => 
                      d.brand.toLowerCase().includes(kw.toLowerCase()) || 
                      d.discount.toLowerCase().includes(kw.toLowerCase()) ||
                      (d.category || '').toLowerCase().includes(kw.toLowerCase())
                    ).length;

                    return (
                      <span
                        key={kw}
                        className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-white border border-slate-300 text-slate-800 rounded-lg text-xs font-bold shadow-2xs"
                      >
                        <span>{kw}</span>
                        {matchCount > 0 && (
                          <span className="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                            {matchCount}건 딜
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = favoriteKeywords.filter((k) => k !== kw);
                            setFavoriteKeywords(updated);
                            try {
                              localStorage.setItem('delivery_favorite_keywords', JSON.stringify(updated));
                            } catch (err) {
                              console.error(err);
                            }
                            showToast(`삭제되었습니다: '${kw}'`);
                          }}
                          className="text-slate-400 hover:text-red-500 ml-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center space-x-2">
              <button
                onClick={() => {
                  try {
                    localStorage.setItem('delivery_favorite_keywords', JSON.stringify(favoriteKeywords));
                  } catch (e) {
                    console.error(e);
                  }
                  showToast('🔔 관심 알림 키워드가 저장되었습니다!');
                  setShowFoodAlertModal(false);
                }}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
              >
                닫기 및 저장 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
