import React, { useState, useRef } from 'react';
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
  List
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
];

interface Props {
  onSelectAppFilter?: (appId: string) => void;
  selectedAppFilter?: string;
}

export const DeliveryAppRollingBanner: React.FC<Props> = ({
  onSelectAppFilter,
  selectedAppFilter,
}) => {
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'scroll' | 'grid'>('scroll');
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeApp = DELIVERY_APP_DETAILS.find((item) => item.id === activeAppId);

  const handleToggleApp = (appId: string) => {
    if (activeAppId === appId) {
      setActiveAppId(null);
    } else {
      setActiveAppId(appId);
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

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3 space-y-2.5 transition-all">
      {/* HEADER BAR */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center space-x-1.5">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-xs font-black text-slate-800 flex items-center space-x-1">
              <span>대한민국 배달앱 혜택 한눈에</span>
              <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded-full border border-blue-200 font-extrabold">
                8대 대표앱
              </span>
            </h2>
          </div>
        </div>

        {/* View mode toggle button: Grid vs Scroll */}
        <button
          onClick={() => setViewMode(viewMode === 'scroll' ? 'grid' : 'scroll')}
          className="text-[10px] font-extrabold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-2 py-1 rounded-lg border border-slate-200 flex items-center space-x-1 transition-all active:scale-95"
          title="배달앱 보기 방식 변경"
        >
          {viewMode === 'scroll' ? (
            <>
              <Grid className="w-3 h-3 text-blue-600" />
              <span>8개 전체 펼쳐보기</span>
            </>
          ) : (
            <>
              <List className="w-3 h-3 text-blue-600" />
              <span>가로 스크롤 보기</span>
            </>
          )}
        </button>
      </div>

      {/* DELIVERY APP BUTTONS AREA */}
      {viewMode === 'scroll' ? (
        /* 1. HORIZONTAL ROLLING SCROLL VIEW WITH LEFT & RIGHT ARROWS */
        <div className="relative group">
          {/* Left Arrow Button */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/95 text-slate-700 shadow-md border border-slate-200 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all active:scale-90"
            title="왼쪽으로 스크롤"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex space-x-2 overflow-x-auto scroll-smooth no-scrollbar py-1 px-8"
          >
            {DELIVERY_APP_DETAILS.map((app) => {
              const isActive = activeAppId === app.id;
              const isFiltered = selectedAppFilter === app.id;

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
                      : 'bg-slate-50/90 hover:bg-slate-100 text-slate-700 border-slate-200/90 hover:border-slate-300 opacity-90 hover:opacity-100'
                  }`}
                >
                  {/* Brand Color Dot */}
                  <span
                    className={`w-2.5 h-2.5 rounded-full transition-transform ${
                      isActive ? 'scale-125 ring-2 ring-white shadow-xs' : 'group-hover:scale-110'
                    }`}
                    style={{ backgroundColor: app.color }}
                  />

                  <span className="truncate">{app.shortName}</span>

                  {/* Filter indicator badge */}
                  {isFiltered && (
                    <span className="text-[9px] bg-blue-600 text-white font-extrabold px-1 rounded-full">
                      필터적용
                    </span>
                  )}

                  <span
                    className={`text-[10px] text-slate-400 transition-transform duration-200 ${
                      isActive ? 'rotate-180 text-slate-700' : ''
                    }`}
                  >
                    ▼
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/95 text-slate-700 shadow-md border border-slate-200 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all active:scale-90"
            title="오른쪽으로 스크롤"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* 2. 8-APP GRID VIEW (4 COLUMNS x 2 ROWS) - ALL 8 APPS VISIBLE AT ONCE */
        <div className="grid grid-cols-4 gap-1.5 py-1">
          {DELIVERY_APP_DETAILS.map((app) => {
            const isActive = activeAppId === app.id;
            const isFiltered = selectedAppFilter === app.id;

            return (
              <button
                key={app.id}
                onClick={() => handleToggleApp(app.id)}
                style={{
                  borderColor: isActive ? app.color : undefined,
                  boxShadow: isActive ? `0 0 10px ${app.color}33` : undefined,
                }}
                className={`px-2 py-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center space-y-1 border transition-all active:scale-95 cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 border-2 shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: app.color }}
                  />
                  <span className="truncate text-[11px]">{app.shortName}</span>
                </div>

                {isFiltered && (
                  <span className="text-[8px] bg-blue-600 text-white font-extrabold px-1 rounded-full">
                    필터적용
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* EXPANDABLE ACCORDION / TAB DETAILED BOX */}
      <AnimatePresence>
        {activeApp && (
          <motion.div
            key={activeApp.id}
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`rounded-2xl p-3.5 border ${activeApp.bgLight} space-y-3 relative overflow-hidden shadow-xs`}
            style={{ borderColor: `${activeApp.color}40` }}
          >
            {/* Top Bar inside Accordion */}
            <div className="flex items-center justify-between pb-2 border-b border-black/10">
              <div className="flex items-center space-x-2">
                <span
                  className="px-2.5 py-1 rounded-lg text-white font-black text-xs shadow-2xs"
                  style={{ backgroundColor: activeApp.color }}
                >
                  {activeApp.shortName}
                </span>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center space-x-1">
                    <span>{activeApp.name}</span>
                  </h3>
                  <p className="text-[10px] text-slate-600 font-medium">
                    {activeApp.tagline}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveAppId(null)}
                className="w-6 h-6 rounded-full bg-white/70 hover:bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all shadow-2xs"
                title="상세 상자 닫기"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 4 Core Information Grid / List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* 1. 할인 이벤트 제목 */}
              <div className="bg-white/90 backdrop-blur-xs p-2.5 rounded-xl border border-black/5 space-y-1 shadow-2xs">
                <div className="text-[11px] font-extrabold text-amber-600 flex items-center space-x-1">
                  <Gift className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>할인 이벤트</span>
                </div>
                <p className="font-bold text-slate-900 leading-snug">
                  {activeApp.discountEvent}
                </p>
              </div>

              {/* 2. 무료배송 조건 */}
              <div className="bg-white/90 backdrop-blur-xs p-2.5 rounded-xl border border-black/5 space-y-1 shadow-2xs">
                <div className="text-[11px] font-extrabold text-blue-600 flex items-center space-x-1">
                  <Truck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>무료배송 조건</span>
                </div>
                <p className="font-bold text-slate-800 leading-snug">
                  {activeApp.freeDeliveryCondition}
                </p>
              </div>

              {/* 3. 구독 서비스 혜택 */}
              <div className="bg-white/90 backdrop-blur-xs p-2.5 rounded-xl border border-black/5 space-y-1 shadow-2xs">
                <div className="text-[11px] font-extrabold text-purple-600 flex items-center space-x-1">
                  <CreditCard className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  <span>구독 서비스 혜택</span>
                </div>
                <p className="font-medium text-slate-800 leading-snug">
                  {activeApp.subscriptionBenefit}
                </p>
              </div>

              {/* 4. 기본 배달팁 정보 */}
              <div className="bg-white/90 backdrop-blur-xs p-2.5 rounded-xl border border-black/5 space-y-1 shadow-2xs">
                <div className="text-[11px] font-extrabold text-emerald-600 flex items-center space-x-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>기본 배달팁 정보</span>
                </div>
                <p className="font-medium text-slate-800 leading-snug">
                  {activeApp.basicDeliveryTip}
                </p>
              </div>
            </div>

            {/* Quick Actions Footer inside Accordion */}
            <div className="pt-1 flex flex-wrap gap-2 items-center justify-between">
              {onSelectAppFilter && (
                <button
                  onClick={() => onSelectAppFilter(activeApp.id)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-extrabold flex items-center space-x-1 shadow-2xs active:scale-95 transition-all"
                >
                  <Filter className="w-3.5 h-3.5 text-blue-600" />
                  <span>[{activeApp.shortName}] 할인 리스트만 보기</span>
                </button>
              )}

              <a
                href={activeApp.webUrl}
                target="_blank"
                rel="noreferrer"
                style={{ backgroundColor: activeApp.color }}
                className="px-3.5 py-1.5 text-white rounded-xl text-xs font-extrabold flex items-center space-x-1 shadow-2xs active:scale-95 hover:brightness-105 transition-all ml-auto"
              >
                <span>{activeApp.shortName} 앱/웹 실행</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
