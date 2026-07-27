import React, { useState, useMemo } from 'react';
import { 
  DiscountItem, 
  DiscountTab, 
  FoodCategory, 
  DeliveryApp, 
  Region,
  SortOption,
  DiscountFilters
} from '../types';
import { DiscountCard } from './DiscountCard';
import { AdBanner } from './AdBanner';
import { Search, ArrowUpDown, AlertCircle, Filter, Truck, Ticket, CreditCard, Sparkles, Clock, Flame } from 'lucide-react';

interface DiscountsViewProps {
  items: DiscountItem[];
  currentRegion: Region;
  activeTab: DiscountTab;
  onTabChange: (tab: DiscountTab) => void;
  selectedCategory: FoodCategory;
  onSelectCategory: (cat: FoodCategory) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  advancedFilters: DiscountFilters;
  onUpdateAdvancedFilters: (filters: DiscountFilters) => void;
  onTrackInteraction: (item: DiscountItem) => void;
}

const TABS: DiscountTab[] = [
  '오늘의 할인',
  '오늘의 무료배달',
  '신규가입 혜택',
  '카드 할인',
  '쿠폰',
  '브랜드 행사',
  '배달앱 공지사항'
];

const APPS: (DeliveryApp | '전체')[] = [
  '전체',
  '배달의민족',
  '요기요',
  '쿠팡이츠',
  '땡겨요',
  '먹깨비',
  '컬리',
  'CJ더마켓'
];

export const DiscountsView: React.FC<DiscountsViewProps> = ({
  items,
  currentRegion,
  activeTab,
  onTabChange,
  selectedCategory,
  onSelectCategory,
  favorites,
  onToggleFavorite,
  advancedFilters,
  onUpdateAdvancedFilters,
  onTrackInteraction,
}) => {
  const [selectedApp, setSelectedApp] = useState<DeliveryApp | '전체'>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('latest');

  const toggleFilter = (key: keyof DiscountFilters) => {
    onUpdateAdvancedFilters({ ...advancedFilters, [key]: !advancedFilters[key] });
  };

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Tab filter
      if (item.tabCategory !== activeTab) return false;

      // 2. Delivery App filter
      if (selectedApp !== '전체' && item.deliveryApp !== selectedApp) return false;

      // 3. Category filter
      if (selectedCategory !== '전체' && item.foodCategory !== selectedCategory && item.foodCategory !== '전체') return false;

      // 4. Region filter
      const isRegionMatch =
        item.targetRegions.includes('전국') ||
        item.targetRegions.some((r) => {
          if (r === currentRegion.city) return true;
          if (r === `${currentRegion.city} ${currentRegion.district}`) return true;
          if (currentRegion.dong && r === `${currentRegion.city} ${currentRegion.district} ${currentRegion.dong}`) return true;
          return false;
        });
      if (!isRegionMatch) return false;

      // 5. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesBrand = item.brandName?.toLowerCase().includes(q);
        const matchesApp = item.deliveryApp.toLowerCase().includes(q);
        if (!matchesTitle && !matchesBrand && !matchesApp) return false;
      }

      // 6. Advanced Filters
      if (advancedFilters.onlyFreeDelivery && !item.isFreeDelivery) return false;
      if (advancedFilters.minDiscount50 && (item.discountPercent || 0) < 50) return false;
      if (advancedFilters.onlyWithCoupon && !item.couponCode) return false;
      if (advancedFilters.onlyNewUser && !item.isNewUserOnly) return false;
      if (advancedFilters.onlyCardDiscount && !item.cardCompany) return false;
      // endingToday - Since we don't have exact endDate parseable easily, we simulate it
      if (advancedFilters.endingToday && !item.period.includes('오늘 종료')) {
        // (Just an example matching logic for period string)
        return false;
      }

      return true;
    });
  }, [items, activeTab, selectedApp, selectedCategory, currentRegion, searchQuery, advancedFilters]);

  // Sort items
  const sortedItems = useMemo(() => {
    const list = [...filteredItems];
    switch (sortOption) {
      case 'discount_desc':
        return list.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
      case 'free_delivery':
        return list.sort((a, b) => (b.isFreeDelivery ? 1 : 0) - (a.isFreeDelivery ? 1 : 0));
      case 'new_user':
        return list.sort((a, b) => (b.isNewUserOnly ? 1 : 0) - (a.isNewUserOnly ? 1 : 0));
      case 'latest':
      default:
        return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }
  }, [filteredItems, sortOption]);

  return (
    <div className="space-y-4 pb-8">
      
      {/* Horizontally Scrollable Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none -mx-4 px-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 ${
              activeTab === tab
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* App Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
        <span className="text-[11px] font-bold text-slate-400 shrink-0">앱 선택:</span>
        {APPS.map((app) => (
          <button
            key={app}
            onClick={() => setSelectedApp(app)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
              selectedApp === app
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {app}
          </button>
        ))}
      </div>

      {/* Advanced Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
        <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0 border border-slate-200 dark:border-slate-700">
          <Filter className="w-3 h-3 text-slate-500" />
          <span className="text-[10px] font-bold text-slate-500 uppercase">상세 필터</span>
        </div>
        
        <button onClick={() => toggleFilter('onlyFreeDelivery')} className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 border ${advancedFilters.onlyFreeDelivery ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-300' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}>
          <Truck className="w-3 h-3" /> 무료배달
        </button>
        
        <button onClick={() => toggleFilter('minDiscount50')} className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 border ${advancedFilters.minDiscount50 ? 'bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-900/30 dark:border-rose-700 dark:text-rose-300' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}>
          <Flame className="w-3 h-3" /> 50% 이상 할인
        </button>
        
        <button onClick={() => toggleFilter('onlyWithCoupon')} className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 border ${advancedFilters.onlyWithCoupon ? 'bg-purple-50 border-purple-300 text-purple-700 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}>
          <Ticket className="w-3 h-3" /> 쿠폰 포함
        </button>

        <button onClick={() => toggleFilter('endingToday')} className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 border ${advancedFilters.endingToday ? 'bg-orange-50 border-orange-300 text-orange-700 dark:bg-orange-900/30 dark:border-orange-700 dark:text-orange-300' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}>
          <Clock className="w-3 h-3" /> 오늘 종료
        </button>

        <button onClick={() => toggleFilter('onlyNewUser')} className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 border ${advancedFilters.onlyNewUser ? 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-300' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}>
          <Sparkles className="w-3 h-3" /> 신규가입
        </button>

        <button onClick={() => toggleFilter('onlyCardDiscount')} className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 border ${advancedFilters.onlyCardDiscount ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}>
          <CreditCard className="w-3 h-3" /> 카드할인
        </button>
      </div>

      {/* Search & Sort Controls */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="이벤트, 브랜드, 배달앱 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 h-10 shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="latest">최신순</option>
            <option value="discount_desc">할인 높은 순</option>
            <option value="free_delivery">무료배달 우선</option>
            <option value="new_user">첫주문 우선</option>
          </select>
        </div>
      </div>

      {/* Results Header */}
      <div className="text-xs text-slate-500 dark:text-slate-400 px-1">
        <strong className="text-slate-900 dark:text-white">{activeTab}</strong> 목록: 총 <strong className="text-rose-600 dark:text-rose-400">{sortedItems.length}</strong>건
      </div>

      {/* Discount Cards Grid or STRICT "데이터 없음" Display */}
      {sortedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {sortedItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <DiscountCard
                item={item}
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={onToggleFavorite}
                currentRegion={currentRegion}
                onTrackInteraction={onTrackInteraction}
              />
              {/* Insert AdBanner every 6 cards */}
              {(index + 1) % 6 === 0 && <AdBanner type="in-feed" slotId={`feed-discounts-${index}`} />}
            </React.Fragment>
          ))}
        </div>
      ) : (
        /* ABSOLUTE MANDATE: Display "데이터 없음" when no items match */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center my-6 space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-amber-600 dark:text-amber-400">
              데이터 없음
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              선택하신 필터 및 위치에서 진행 중인 공식 확인 프로모션 데이터가 존재하지 않습니다.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
