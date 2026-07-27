import React, { useState, useMemo } from 'react';
import { 
  DiscountItem, 
  FoodCategory, 
  Region, 
  UserInterests,
  DeliveryApp
} from '../types';
import { DiscountCard } from './DiscountCard';
import { AdBanner } from './AdBanner';
import { Search, MapPin, Flame, Truck, UserPlus, Ticket, ChevronRight, Sparkles } from 'lucide-react';

interface HomeViewProps {
  items: DiscountItem[];
  currentRegion: Region;
  onOpenLocationModal: () => void;
  onSelectFoodCategory: (category: FoodCategory) => void;
  onNavigateToDiscounts: (filterTab?: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onTrackInteraction: (item: DiscountItem) => void;
}

const FOOD_CATEGORIES: { label: FoodCategory; icon: string }[] = [
  { label: '전체', icon: '🍽️' },
  { label: '치킨', icon: '🍗' },
  { label: '피자', icon: '🍕' },
  { label: '햄버거', icon: '🍔' },
  { label: '중식', icon: '🥟' },
  { label: '일식', icon: '🍣' },
  { label: '분식', icon: '떡' },
  { label: '족발/보쌈', icon: '🍖' },
  { label: '디저트/카페', icon: '☕' },
  { label: '밀키트/마트', icon: '🛒' },
];

export const HomeView: React.FC<HomeViewProps> = ({
  items,
  currentRegion,
  onOpenLocationModal,
  onSelectFoodCategory,
  onNavigateToDiscounts,
  favorites,
  onToggleFavorite,
  onTrackInteraction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Regional Filtered Items
  const regionFilteredItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.targetRegions.includes('전국') ||
        item.targetRegions.some((r) => {
          if (r === currentRegion.city) return true;
          if (r === `${currentRegion.city} ${currentRegion.district}`) return true;
          if (currentRegion.dong && r === `${currentRegion.city} ${currentRegion.district} ${currentRegion.dong}`) return true;
          return false;
        })
    );
  }, [items, currentRegion]);

  // Counts for Summary Badges
  const countDiscount = regionFilteredItems.length;
  const countFreeDelivery = regionFilteredItems.filter((i) => i.isFreeDelivery).length;
  const countNewUser = regionFilteredItems.filter((i) => i.isNewUserOnly).length;
  const countCoupon = regionFilteredItems.filter((i) => !!i.couponCode || i.tabCategory === '쿠폰').length;

  // Search filtered or TOP 10 Items
  const top10Items = useMemo(() => {
    let list = regionFilteredItems;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.brandName?.toLowerCase().includes(q) ||
          i.deliveryApp.toLowerCase().includes(q)
      );
    }
    // Sort by highest discount rate or free delivery priority
    return list
      .sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0))
      .slice(0, 10);
  }, [regionFilteredItems, searchQuery]);

  return (
    <div className="space-y-5 pb-8">
      
      {/* ① Current Location Banner */}
      <div 
        onClick={onOpenLocationModal}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs flex items-center justify-between cursor-pointer active:scale-[0.99] transition-transform"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">현재 설정된 배달 위치</div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
              {currentRegion.fullAddress}
            </div>
          </div>
        </div>
        <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-0.5 shrink-0">
          <span>지역 변경</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* ②~⑤ Summary Badges Grid (Point Colors: Red, Green, Orange, Purple) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        
        {/* 오늘 할인 개수 (Red) */}
        <button
          onClick={() => onNavigateToDiscounts('오늘의 할인')}
          className="bg-white dark:bg-slate-900 border border-red-100 dark:border-red-900/40 rounded-2xl p-3.5 flex items-center justify-between shadow-xs hover:border-red-300 transition-all text-left group min-h-[56px]"
        >
          <div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">오늘 할인</div>
            <div className="text-lg font-black text-red-600 dark:text-red-400">{countDiscount}건</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Flame className="w-5 h-5 fill-red-500" />
          </div>
        </button>

        {/* 무료배달 개수 (Green) */}
        <button
          onClick={() => onNavigateToDiscounts('오늘의 무료배달')}
          className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl p-3.5 flex items-center justify-between shadow-xs hover:border-emerald-300 transition-all text-left group min-h-[56px]"
        >
          <div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">무료배달</div>
            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">{countFreeDelivery}건</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Truck className="w-5 h-5" />
          </div>
        </button>

        {/* 신규가입 혜택 개수 (Orange) */}
        <button
          onClick={() => onNavigateToDiscounts('신규가입 혜택')}
          className="bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-900/40 rounded-2xl p-3.5 flex items-center justify-between shadow-xs hover:border-amber-300 transition-all text-left group min-h-[56px]"
        >
          <div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">신규가입</div>
            <div className="text-lg font-black text-amber-600 dark:text-amber-400">{countNewUser}건</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <UserPlus className="w-5 h-5" />
          </div>
        </button>

        {/* 쿠폰 개수 (Purple) */}
        <button
          onClick={() => onNavigateToDiscounts('쿠폰')}
          className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/40 rounded-2xl p-3.5 flex items-center justify-between shadow-xs hover:border-purple-300 transition-all text-left group min-h-[56px]"
        >
          <div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">쿠폰/코드</div>
            <div className="text-lg font-black text-purple-600 dark:text-purple-400">{countCoupon}건</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Ticket className="w-5 h-5" />
          </div>
        </button>

      </div>

      {/* ⑥ Mobile Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="브랜드, 치킨, 피자, 배달앱 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-9 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 transition-colors shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white font-medium p-1"
          >
            지우기
          </button>
        )}
      </div>

      {/* ⑦ Food Categories Horizontally Scrollable Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400">음식 카테고리</h2>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
          {FOOD_CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => {
                onSelectFoodCategory(cat.label);
                onNavigateToDiscounts();
              }}
              className="flex flex-col items-center justify-center min-w-[68px] h-[72px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shrink-0 hover:border-rose-300 dark:hover:border-rose-700 active:scale-95 transition-all shadow-2xs"
            >
              <span className="text-2xl mb-1">{cat.icon}</span>
              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Native Ad Banner Slot */}
      <AdBanner type="top-banner" slotId="home-feed" />

      {/* ⑧ Today's Popular Discounts TOP 10 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">🔥</span>
            <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
              오늘의 인기 할인 TOP 10
            </h2>
          </div>
          <button
            onClick={() => onNavigateToDiscounts()}
            className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-0.5 hover:underline"
          >
            <span>전체보기 ({regionFilteredItems.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* TOP 10 List Grid */}
        {top10Items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {top10Items.map((item, idx) => (
              <DiscountCard
                key={item.id}
                item={item}
                rank={idx + 1}
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={onToggleFavorite}
                currentRegion={currentRegion}
                onTrackInteraction={onTrackInteraction}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
            현재 조건에 맞는 공식 할인 정보가 존재하지 않습니다.
          </div>
        )}
      </div>

    </div>
  );
};
