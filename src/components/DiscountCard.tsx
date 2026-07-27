import React from 'react';
import { DiscountItem, Region } from '../types';
import { Heart, ExternalLink, ShieldCheck, Truck, Ticket, CreditCard, Sparkles, UserPlus, MapPin, XOctagon, Clock } from 'lucide-react';

interface DiscountCardProps {
  item: DiscountItem;
  rank?: number;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  currentRegion?: Region;
  onTrackInteraction?: (item: DiscountItem) => void;
}

export const DiscountCard: React.FC<DiscountCardProps> = ({
  item,
  rank,
  isFavorite,
  onToggleFavorite,
  currentRegion,
  onTrackInteraction
}) => {
  // App Color Map
  const getAppBadgeColor = (app: string) => {
    switch (app) {
      case '배달의민족':
        return 'bg-teal-500 text-white';
      case '요기요':
        return 'bg-rose-500 text-white';
      case '쿠팡이츠':
        return 'bg-sky-500 text-white';
      case '땡겨요':
        return 'bg-amber-500 text-white';
      case '먹깨비':
        return 'bg-orange-500 text-white';
      case '컬리':
        return 'bg-purple-600 text-white';
      case 'CJ더마켓':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  // Calculate stale status (older than 24 hours)
  const lastUpdatedMs = item.updatedAt ? new Date(item.updatedAt).getTime() : 0;
  const isStale = lastUpdatedMs > 0 ? (new Date().getTime() - lastUpdatedMs) > 24 * 60 * 60 * 1000 : false;
  
  // Format formatted relative / last verified time
  const formatLastVerifiedTime = (isoString?: string) => {
    if (!isoString) return '확인됨';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '확인됨';
    
    const diffMins = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60));
    if (diffMins < 60) {
      return diffMins <= 0 ? '방금 전 확인' : `${diffMins}분 전 확인`;
    }
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours}시간 전 확인`;
    }
    return `${date.getMonth() + 1}월 ${date.getDate()}일 확인`;
  };

  // Determine availability if currentRegion is passed
  let isAvailable = true;
  let availabilityText = '';

  if (currentRegion) {
    if (item.targetRegions.includes('전국')) {
      isAvailable = true;
      availabilityText = '전국 이용 가능';
    } else {
      isAvailable = item.targetRegions.some((r) => {
        if (r === currentRegion.city) return true;
        if (r === `${currentRegion.city} ${currentRegion.district}`) return true;
        if (currentRegion.dong && r === `${currentRegion.city} ${currentRegion.district} ${currentRegion.dong}`) return true;
        return false;
      });
      availabilityText = isAvailable ? '현재 위치에서 이용 가능' : '현재 지역에서는 이용 불가';
    }
  }

  // Calculate NEW badge (within 24 hours)
  const isNew = item.updatedAt ? (new Date().getTime() - new Date(item.updatedAt).getTime()) < 24 * 60 * 60 * 1000 : false;
  
  // Calculate D-Day badge
  let dDayBadge = null;
  if (item.endDate) {
    const today = new Date();
    today.setHours(0,0,0,0);
    const end = new Date(item.endDate);
    end.setHours(0,0,0,0);
    
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      dDayBadge = 'D-DAY';
    } else if (diffDays === 1) {
      dDayBadge = 'D-1';
    } else if (diffDays < 0) {
      dDayBadge = '종료';
    }
  }

  const handleActionClick = () => {
    if (isAvailable && onTrackInteraction) {
      onTrackInteraction(item);
    }
  };

  return (
    <div className={`relative bg-white dark:bg-slate-900 border ${isAvailable ? 'border-slate-200 dark:border-slate-800' : 'border-slate-100 dark:border-slate-800 opacity-70 grayscale-[30%]'} rounded-2xl p-4 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-3`}>
      
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Top Rank Badge (Optional) */}
          {rank && (
            <span className="w-6 h-6 rounded-lg bg-rose-600 text-white text-xs font-black flex items-center justify-center shrink-0">
              {rank}
            </span>
          )}

          {/* Delivery App Badge */}
          <span className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${getAppBadgeColor(item.deliveryApp)}`}>
            {item.deliveryApp}
          </span>

          {/* Official Verification & Source Badge */}
          <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-semibold">
            <ShieldCheck className="w-3 h-3" /> {item.verifiedOfficialSource || item.source || '공식 이벤트'}
          </span>

          {/* Last Verified Time Badge */}
          <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700">
            <Clock className="w-2.5 h-2.5 text-slate-400" />
            {formatLastVerifiedTime(item.updatedAt)}
          </span>

          {/* Stale Warning Badge (> 24h) */}
          {isStale && (
            <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800 font-bold">
              ⚠️ 확인 필요
            </span>
          )}

          {/* Data Engine Trust Score Badge */}
          {item.score !== undefined && (
            <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
              점수 {item.score}
            </span>
          )}

          {/* Best Rate Badge */}
          {item.isBestRate && (
            <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500 text-white font-black shadow-xs">
              ★ 최고혜택
            </span>
          )}

          {/* NEW Badge */}
          {isNew && (
            <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-md bg-red-600 text-white font-black animate-pulse">
              NEW
            </span>
          )}
        </div>

        {/* Favorite Heart Toggle */}
        <button
          onClick={() => onToggleFavorite(item.id)}
          aria-label="관심 스크랩"
          className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors active:scale-90"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Main Content Info */}
      <div className="space-y-1">
        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>{item.brandName || item.foodCategory}</span>
          {dDayBadge && (
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${dDayBadge === 'D-DAY' ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400' : 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400'}`}>
              <Clock className="w-3 h-3 inline-block mr-0.5 -mt-0.5" />
              {dDayBadge}
            </span>
          )}
        </div>
        <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug line-clamp-2">
          {item.title}
        </h3>
      </div>

      {/* Point Color Feature Badges (Discount, Free Delivery, Coupon, Card, NewUser) */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold pt-1">
        
        {/* 할인율/할인금액 (Red) */}
        {item.discountAmountText && (
          <span className="px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40">
            {item.discountAmountText}
          </span>
        )}

        {/* 무료배달 (Green) */}
        {item.isFreeDelivery && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
            <Truck className="w-3 h-3" /> 무료배달
          </span>
        )}

        {/* 쿠폰 (Purple) */}
        {item.couponCode && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900/40">
            <Ticket className="w-3 h-3" /> 쿠폰: {item.couponCode}
          </span>
        )}

        {/* 카드혜택 (Blue) */}
        {item.cardCompany && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40">
            <CreditCard className="w-3 h-3" /> {item.cardCompany}
          </span>
        )}

        {/* 신규가입 (Orange) */}
        {item.isNewUserOnly && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40">
            <UserPlus className="w-3 h-3" /> 첫주문
          </span>
        )}

      </div>

      {/* Main Single Action Button (Min Height 48px for thumb touch) */}
      <a
        href={item.affiliateUrl || item.officialUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleActionClick}
        className={`w-full h-12 rounded-xl text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-transform active:scale-[0.98] shadow-xs ${isAvailable ? 'bg-slate-900 hover:bg-slate-800 dark:bg-rose-600 dark:hover:bg-rose-500' : 'bg-slate-400 dark:bg-slate-700 pointer-events-none'}`}
      >
        <span>{isAvailable ? '혜택 받기 / 앱 이동' : '해당 지역 지원 안함'}</span>
        {isAvailable && <ExternalLink className="w-4 h-4" />}
      </a>

      {/* Location Availability Info Badge */}
      {currentRegion && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
          <p className={`text-[11px] font-bold flex items-center justify-center gap-1 ${isAvailable ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
            {isAvailable ? <MapPin className="w-3 h-3" /> : <XOctagon className="w-3 h-3" />}
            {availabilityText}
          </p>
        </div>
      )}

    </div>
  );
};
