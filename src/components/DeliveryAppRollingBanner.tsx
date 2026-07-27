import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Truck, 
  CreditCard, 
  DollarSign, 
  ExternalLink, 
  X,
  Filter,
  Gift,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Copy,
  Edit3,
  ChevronDown,
  Tag,
  MapPin,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  discountRate?: number;
  validity: string;
  minOrder?: string;
  category?: string;
  category_type?: 'mealkit' | 'coupon' | string;
  type?: string;
  region?: string;
  card_discount?: string;
  affiliate_link?: string;
  url?: string;
  link?: string;
  imageUrl?: string;
  image?: string;
  seller?: string;
  is_top_ranked?: boolean;
  couponCode?: string;
  linkNote?: string;
  createdAt?: number;
}

export interface DeliveryAppInfo {
  id: string;
  name: string;
  shortName: string;
  color: string;
  bgLight: string;
  borderColor: string;
  badgeBg: string;
  tagline: string;
  discountEvent: string;
  freeDeliveryCondition: string;
  subscriptionBenefit: string;
  basicDeliveryTip: string;
  webUrl: string;
  scheme: string;
}

export const DELIVERY_APP_DETAILS: DeliveryAppInfo[] = [
  {
    id: '배민',
    name: '배달의민족',
    shortName: '배민',
    color: '#2AC1BC',
    bgLight: 'bg-[#E6F8F7]',
    borderColor: 'border-[#2AC1BC]',
    badgeBg: 'bg-[#2AC1BC]',
    tagline: '대한민국 1등 배달 브랜드',
    discountEvent: '7월 무제한 브랜드 쿠폰팩 & 클럽 회원 최대 10,000원 할인',
    freeDeliveryCondition: '배민클럽 적용 매장 알뜰배달 무료 배송 (배달팁 0원)',
    subscriptionBenefit: '배민클럽 (프로모션가 월 1,990원 / 첫달 무료 체험, 배달팁 무료 + 브랜드 쿠폰)',
    basicDeliveryTip: '일반배달 1,000원~3,500원 (거리/시간대별 차등)',
    webUrl: 'https://m.baemin.com/',
    scheme: 'baemin://',
  },
  {
    id: '쿠팡이츠',
    name: '쿠팡이츠',
    shortName: '쿠팡이츠',
    color: '#00A3FF',
    bgLight: 'bg-[#EBF5FF]',
    borderColor: 'border-[#00A3FF]',
    badgeBg: 'bg-[#00A3FF]',
    tagline: '와우회원 무제한 10% 자동 할인',
    discountEvent: '와우 회원 매 주문 10% 자동 할인 + 인기 프랜차이즈 중복 쿠폰',
    freeDeliveryCondition: '쿠팡 와우 회원 대상 묶음배달 무료배송 (배달팁 0원)',
    subscriptionBenefit: '쿠팡 와우 멤버십 (월 7,890원 / 로켓배송 + 쿠팡이츠 무제한 무료배송)',
    basicDeliveryTip: '비회원/단건배달 2,000원~4,000원 수준',
    webUrl: 'https://eats.coupang.com/',
    scheme: 'coupangeats://',
  },
  {
    id: '요기요',
    name: '요기요',
    shortName: '요기요',
    color: '#FA0050',
    bgLight: 'bg-[#FFEBF0]',
    borderColor: 'border-[#FA0050]',
    badgeBg: 'bg-[#FA0050]',
    tagline: '요기패스X 무제한 무료배송',
    discountEvent: '요기패스X 무제한 무료배송 & 오늘할인 브랜드 최대 7,000원',
    freeDeliveryCondition: '요기패스X 구독 시 최소주문금액(15,000원) 이상 무제한 무료배송',
    subscriptionBenefit: '요기패스X (월 2,900원 프로모션 / 가게 쿠폰과 중복 할인 가능)',
    basicDeliveryTip: '일반 주문 시 2,000원~4,000원 (지역별 차등)',
    webUrl: 'https://www.yogiyo.co.kr/',
    scheme: 'yogiyo://',
  },
  {
    id: '땡겨요',
    name: '땡겨요',
    shortName: '땡겨요',
    color: '#FF5B00',
    bgLight: 'bg-[#FFF0E6]',
    borderColor: 'border-[#FF5B00]',
    badgeBg: 'bg-[#FF5B00]',
    tagline: '신한은행 상생 착한 배달앱',
    discountEvent: '첫/재주문 최대 10,000원 쿠폰 & 서울/지자체 상품권 15% 할인',
    freeDeliveryCondition: '가게 자체 무료배송 지원 및 땡겨요 전용 2,000원 배달팁 쿠폰 제공',
    subscriptionBenefit: '월 구독료 0원! (지역사랑상품권 7~15% 할인 구매 결제 가능)',
    basicDeliveryTip: '착한 수수료 기반 평균 1,000원~2,500원 (업계 최저 수준)',
    webUrl: 'https://www.ddangyo.com/',
    scheme: 'ddangyo://',
  },
  {
    id: '먹깨비',
    name: '먹깨비',
    shortName: '먹깨비',
    color: '#8B5CF6',
    bgLight: 'bg-[#F3E8FF]',
    borderColor: 'border-[#8B5CF6]',
    badgeBg: 'bg-[#8B5CF6]',
    tagline: '대한민국 대표 공공배달앱',
    discountEvent: '지역사랑상품권 10% 할인 결제 + 주말 특별 배달팁 지원 쿠폰',
    freeDeliveryCondition: '지자체 지원 쿠폰 활용 시 배달팁 최대 3,000원 자동 차감',
    subscriptionBenefit: '구독료 0원! 소상공인 수수료 1.5% 상생 혜택',
    basicDeliveryTip: '1,500원~3,000원 (지역화폐 결제 시 실질 10% 추가 절감)',
    webUrl: 'https://www.mukkebi.com/',
    scheme: 'mukkebi://',
  },
  {
    id: '배달특급',
    name: '배달특급',
    shortName: '배달특급',
    color: '#2563EB',
    bgLight: 'bg-[#EFF6FF]',
    borderColor: 'border-[#2563EB]',
    badgeBg: 'bg-[#2563EB]',
    tagline: '경기도 공공배달 플랫폼',
    discountEvent: '특급날 할인쿠폰 3,000원 + 경기지역화폐 5% 페이백',
    freeDeliveryCondition: '월별 지자체 배달비 지원 쿠폰 지급 (최대 3,000원 할인)',
    subscriptionBenefit: '구독료 없음 / 경기지역화폐 연결 시 최대 15% 혜택 효과',
    basicDeliveryTip: '1,000원~3,000원 (지자체 상생 요금 적용)',
    webUrl: 'https://www.specialdelivery.or.kr/',
    scheme: 'specialdelivery://',
  },
  {
    id: '대구로',
    name: '대구로',
    shortName: '대구로',
    color: '#EC4899',
    bgLight: 'bg-[#FCE7F3]',
    borderColor: 'border-[#EC4899]',
    badgeBg: 'bg-[#EC4899]',
    tagline: '대구 시민 필수 생활 배달앱',
    discountEvent: '대구로 페이 결제 시 5% 추가할인 & 첫 주문 5,000원 쿠폰',
    freeDeliveryCondition: '대구시 배달비 지원 이벤트 매월 선착순 제공',
    subscriptionBenefit: '대구 시민 전용 구독료 0원 / 시민 생활 종합 플랫폼',
    basicDeliveryTip: '1,000원~2,500원 수준',
    webUrl: 'https://daaguro.co.kr/',
    scheme: 'daaguro://',
  },
  {
    id: '두잇',
    name: '두잇',
    shortName: '두잇',
    color: '#10B981',
    bgLight: 'bg-[#E1F8F0]',
    borderColor: 'border-[#10B981]',
    badgeBg: 'bg-[#10B981]',
    tagline: '팀주문으로 평생 배달비 0원',
    discountEvent: '이웃 3명 모이면 무조건 무료배송! 팀주문 추가 할인',
    freeDeliveryCondition: '7,900원 이상 주문 시 조건 없이 100% 무제한 무료배송',
    subscriptionBenefit: '구독료 0원 / 팀주문 시스템으로 매일 배달비 평생 free',
    basicDeliveryTip: '0원 (모든 주문 기본 무료배송)',
    webUrl: 'https://doeat.io/',
    scheme: 'doeat://',
  },
  {
    id: '동백통',
    name: '동백통',
    shortName: '동백통',
    color: '#E11D48',
    bgLight: 'bg-[#FFE4E6]',
    borderColor: 'border-[#E11D48]',
    badgeBg: 'bg-[#E11D48]',
    tagline: '부산광역시 지정 공공배달앱',
    discountEvent: '동백전 결제 시 5% 캐시백 & 첫 주문 쿠폰',
    freeDeliveryCondition: '부산시 지자체 배달비 지원 혜택',
    subscriptionBenefit: '부산 시민 전용 구독료 0원 공공 배달 서비스',
    basicDeliveryTip: '1,000원~2,500원 수준',
    webUrl: 'https://www.dongbaegtong.com/',
    scheme: 'dongbaegtong://',
  }
];

interface Props {
  onSelectAppFilter?: (appId: string) => void;
  selectedAppFilter?: string;
  discounts?: DiscountItem[];
  onLaunchApp?: (item: DiscountItem) => void;
  onCopyCoupon?: (code: string) => void;
  isAdmin?: boolean;
  onOpenEditModal?: (item?: DiscountItem) => void;
  userRegionKeyword?: string;
  userAddress?: string;
}

export const DeliveryAppRollingBanner: React.FC<Props> = ({
  onSelectAppFilter,
  selectedAppFilter,
  discounts = [],
  onLaunchApp,
  onCopyCoupon,
  isAdmin,
  onOpenEditModal,
  userRegionKeyword = '전국',
}) => {
  const [activeAppId, setActiveAppId] = useState<string | null>('배민');
  const [viewMode, setViewMode] = useState<'scroll' | 'grid'>('scroll');
  const [expandAll, setExpandAll] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync selectedAppFilter from parent if available
  useEffect(() => {
    if (selectedAppFilter && selectedAppFilter !== '전체') {
      setActiveAppId(selectedAppFilter);
    }
  }, [selectedAppFilter]);

  const handleToggleApp = (appId: string) => {
    if (activeAppId === appId && !expandAll) {
      setActiveAppId(null);
    } else {
      setActiveAppId(appId);
      setExpandAll(false);
    }
    if (onSelectAppFilter) {
      onSelectAppFilter(appId);
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -220, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 220, behavior: 'smooth' });
    }
  };

  // Calculate discount counts per app
  const discountCountsByApp = React.useMemo(() => {
    const counts: Record<string, number> = {};
    DELIVERY_APP_DETAILS.forEach((app) => {
      counts[app.id] = discounts.filter((d) => d.app === app.id).length;
    });
    return counts;
  }, [discounts]);

  // Active apps to show (either single active app or all apps if expandAll is true)
  const appsToDisplay = expandAll
    ? DELIVERY_APP_DETAILS
    : DELIVERY_APP_DETAILS.filter((app) => app.id === activeAppId);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3 space-y-3 transition-all">
      {/* HEADER BAR */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center space-x-1.5">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-xs font-black text-slate-900 flex items-center space-x-1">
              <span>대한민국 배달앱 혜택 한눈에</span>
              <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded-full border border-blue-200 font-extrabold">
                {DELIVERY_APP_DETAILS.length}대 대표앱
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {/* Toggle expand all apps */}
          <button
            onClick={() => setExpandAll(!expandAll)}
            className={`text-[10px] font-extrabold px-2 py-1 rounded-lg border flex items-center space-x-1 transition-all active:scale-95 ${
              expandAll
                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border-slate-200'
            }`}
            title="모든 배달앱 혜택 전체 펼쳐보기"
          >
            <Layers className="w-3 h-3" />
            <span>{expandAll ? '선택 보기' : '전체 앱 펼치기'}</span>
          </button>

          {/* View mode toggle button: Grid vs Scroll */}
          <button
            onClick={() => setViewMode(viewMode === 'scroll' ? 'grid' : 'scroll')}
            className="text-[10px] font-extrabold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-2 py-1 rounded-lg border border-slate-200 flex items-center space-x-1 transition-all active:scale-95"
            title="배달앱 아이콘 목록 보기 방식 변경"
          >
            {viewMode === 'scroll' ? (
              <Grid className="w-3 h-3 text-blue-600" />
            ) : (
              <List className="w-3 h-3 text-blue-600" />
            )}
          </button>
        </div>
      </div>

      {/* DELIVERY APP BUTTONS SELECTOR BAR */}
      {viewMode === 'scroll' ? (
        /* 1. HORIZONTAL ROLLING SCROLL VIEW */
        <div className="relative group">
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/95 text-slate-700 shadow-md border border-slate-200 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all active:scale-90"
            title="왼쪽 스크롤"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            ref={scrollRef}
            className="flex space-x-2 overflow-x-auto scroll-smooth no-scrollbar py-1 px-8"
          >
            {DELIVERY_APP_DETAILS.map((app) => {
              const isActive = activeAppId === app.id && !expandAll;
              const count = discountCountsByApp[app.id] || 0;

              return (
                <button
                  key={app.id}
                  onClick={() => handleToggleApp(app.id)}
                  style={{
                    borderColor: isActive ? app.color : undefined,
                    boxShadow: isActive ? `0 0 12px ${app.color}33` : undefined,
                  }}
                  className={`group px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 border shrink-0 transition-all active:scale-95 cursor-pointer relative ${
                    isActive
                      ? 'bg-white text-slate-900 border-2 shadow-md -translate-y-0.5'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/90'
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full transition-transform ${
                      isActive ? 'scale-125 ring-2 ring-white shadow-xs' : 'group-hover:scale-110'
                    }`}
                    style={{ backgroundColor: app.color }}
                  />

                  <span className="truncate">{app.shortName}</span>

                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      isActive ? 'bg-slate-900 text-white' : 'bg-slate-200/80 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/95 text-slate-700 shadow-md border border-slate-200 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all active:scale-90"
            title="오른쪽 스크롤"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* 2. GRID VIEW */
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 py-1">
          {DELIVERY_APP_DETAILS.map((app) => {
            const isActive = activeAppId === app.id && !expandAll;
            const count = discountCountsByApp[app.id] || 0;

            return (
              <button
                key={app.id}
                onClick={() => handleToggleApp(app.id)}
                style={{
                  borderColor: isActive ? app.color : undefined,
                }}
                className={`px-2 py-2 rounded-xl text-xs font-bold flex items-center justify-between space-x-1 border transition-all active:scale-95 cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 border-2 shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <div className="flex items-center space-x-1 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: app.color }}
                  />
                  <span className="truncate text-[11px]">{app.shortName}</span>
                </div>

                <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full font-extrabold shrink-0">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* EXPANDED ACCORDION CARDS WITH SPECIFIC DISCOUNT COUPONS EMBEDDED DIRECTLY INSIDE */}
      <div className="space-y-3">
        {appsToDisplay.map((app) => {
          const appDiscounts = discounts.filter((item) => item.app === app.id);

          return (
            <div
              key={app.id}
              className={`rounded-2xl p-3.5 border ${app.bgLight} space-y-3 relative overflow-hidden shadow-xs transition-all`}
              style={{ borderColor: `${app.color}50` }}
            >
              {/* Top Bar inside App Accordion */}
              <div className="flex items-center justify-between pb-2 border-b border-black/10">
                <div className="flex items-center space-x-2">
                  <span
                    className="px-2.5 py-1 rounded-lg text-white font-black text-xs shadow-2xs"
                    style={{ backgroundColor: app.color }}
                  >
                    {app.shortName}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center space-x-1">
                      <span>{app.name} 혜택 &amp; 할인 쿠폰</span>
                      <span className="text-[10px] bg-white/80 text-slate-700 px-1.5 py-0.2 rounded-full border border-black/10 font-black">
                        {appDiscounts.length}건
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-600 font-medium">
                      {app.tagline}
                    </p>
                  </div>
                </div>

                {!expandAll && (
                  <button
                    onClick={() => setActiveAppId(null)}
                    className="w-6 h-6 rounded-full bg-white/70 hover:bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all shadow-2xs"
                    title="닫기"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* 4 Core Information Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* 1. 할인 이벤트 */}
                <div className="bg-white/90 backdrop-blur-xs p-2.5 rounded-xl border border-black/5 space-y-1 shadow-2xs">
                  <div className="text-[11px] font-extrabold text-amber-600 flex items-center space-x-1">
                    <Gift className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>할인 이벤트</span>
                  </div>
                  <p className="font-bold text-slate-900 leading-snug">
                    {app.discountEvent}
                  </p>
                </div>

                {/* 2. 무료배송 조건 */}
                <div className="bg-white/90 backdrop-blur-xs p-2.5 rounded-xl border border-black/5 space-y-1 shadow-2xs">
                  <div className="text-[11px] font-extrabold text-blue-600 flex items-center space-x-1">
                    <Truck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>무료배송 조건</span>
                  </div>
                  <p className="font-bold text-slate-800 leading-snug">
                    {app.freeDeliveryCondition}
                  </p>
                </div>

                {/* 3. 구독 서비스 혜택 */}
                <div className="bg-white/90 backdrop-blur-xs p-2.5 rounded-xl border border-black/5 space-y-1 shadow-2xs">
                  <div className="text-[11px] font-extrabold text-purple-600 flex items-center space-x-1">
                    <CreditCard className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    <span>구독 서비스 혜택</span>
                  </div>
                  <p className="font-medium text-slate-800 leading-snug">
                    {app.subscriptionBenefit}
                  </p>
                </div>

                {/* 4. 기본 배달팁 정보 */}
                <div className="bg-white/90 backdrop-blur-xs p-2.5 rounded-xl border border-black/5 space-y-1 shadow-2xs">
                  <div className="text-[11px] font-extrabold text-emerald-600 flex items-center space-x-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>기본 배달팁 정보</span>
                  </div>
                  <p className="font-medium text-slate-800 leading-snug">
                    {app.basicDeliveryTip}
                  </p>
                </div>
              </div>

              {/* [EMBEDDED DISCOUNT COUPONS FOR THIS APP] */}
              <div className="pt-2 border-t border-black/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 flex items-center space-x-1">
                    <Tag className="w-3.5 h-3.5 text-red-500" />
                    <span>🔥 {app.shortName} 등록된 프랜차이즈 할인 쿠폰</span>
                  </span>
                  <a
                    href={app.webUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ backgroundColor: app.color }}
                    className="px-2.5 py-1 text-white rounded-lg text-[10px] font-extrabold flex items-center space-x-1 shadow-2xs hover:brightness-105 transition-all"
                  >
                    <span>{app.shortName} 공식앱 열기</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {appDiscounts.length === 0 ? (
                  <div className="bg-white/80 p-3 rounded-xl text-center text-xs text-slate-500 border border-black/5">
                    현재 {app.shortName}에 추가 등록된 브랜드 할인이 없습니다.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {appDiscounts.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onLaunchApp && onLaunchApp(item)}
                        className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-2 relative cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-0.5">
                            <div className="flex items-center space-x-1.5 flex-wrap">
                              <span className="font-black text-slate-900 text-xs sm:text-sm">
                                {item.brand}
                              </span>
                              {item.category && (
                                <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-md">
                                  {item.category}
                                </span>
                              )}
                              {item.region && (
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md flex items-center space-x-0.5 ${
                                    item.region !== '전국' && userRegionKeyword !== '전국' && item.region.includes(userRegionKeyword)
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  <MapPin className="w-2.5 h-2.5" />
                                  <span>{item.region}</span>
                                </span>
                              )}
                            </div>
                            <div className="text-sm font-black text-red-500 flex items-center space-x-2">
                              <span>{item.discount}</span>
                              {item.minOrder && (
                                <span className="text-[10px] font-normal text-slate-400">
                                  ({item.minOrder})
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="flex items-center space-x-1 shrink-0">
                            {isAdmin && onOpenEditModal && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenEditModal(item);
                                }}
                                className="p-1 text-slate-400 hover:text-blue-600 rounded bg-slate-50 hover:bg-slate-100"
                                title="수정"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {onLaunchApp && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onLaunchApp(item);
                                }}
                                style={{ backgroundColor: app.color }}
                                className="px-3 py-1.5 text-white font-black text-xs rounded-lg shadow-2xs hover:brightness-105 active:scale-95 transition-all flex items-center space-x-1 cursor-pointer"
                              >
                                <span>상세보기 &gt;</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Coupon Code & Note */}
                        {(item.couponCode || item.linkNote || item.card_discount) && (
                          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-[11px] space-y-1">
                            {item.couponCode && (
                              <div className="flex items-center justify-between text-slate-800">
                                <div className="flex items-center space-x-1 font-mono font-bold">
                                  <span className="text-[10px] text-slate-400 font-sans">쿠폰코드:</span>
                                  <span className="text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                                    {item.couponCode}
                                  </span>
                                </div>
                                {onCopyCoupon && (
                                  <button
                                    onClick={() => onCopyCoupon(item.couponCode!)}
                                    className="px-2 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-bold text-slate-700 hover:bg-slate-100 flex items-center space-x-0.5"
                                  >
                                    <Copy className="w-2.5 h-2.5" />
                                    <span>복사</span>
                                  </button>
                                )}
                              </div>
                            )}

                            {item.card_discount && (
                              <p className="text-[10px] text-emerald-700 font-bold">
                                💳 카드 혜택: {item.card_discount}
                              </p>
                            )}

                            {item.linkNote && (
                              <p className="text-[10px] text-slate-500 leading-snug">
                                💡 {item.linkNote}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
