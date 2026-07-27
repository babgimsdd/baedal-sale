import React, { useMemo, useState } from 'react';
import { 
  DiscountItem, 
  DiscountTab, 
  FoodCategory, 
  DeliveryApp, 
  SortOption, 
  Region,
  UserInterests 
} from '../types';
import { DiscountCard } from './DiscountCard';
import { AdBanner } from './AdBanner';
import { Search, ArrowUpDown, Filter, AlertCircle, Sparkles, Check, Heart } from 'lucide-react';

interface DiscountListProps {
  items: DiscountItem[];
  activeTab: DiscountTab;
  foodCategory: FoodCategory;
  selectedApp: DeliveryApp | '전체';
  currentRegion: Region;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  userInterests: UserInterests;
}

export const DiscountList: React.FC<DiscountListProps> = ({
  items,
  activeTab,
  foodCategory,
  selectedApp,
  currentRegion,
  favorites,
  onToggleFavorite,
  userInterests,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('score_desc');
  const [showMyInterestsOnly, setShowMyInterestsOnly] = useState(false);

  // Filter items based on activeTab, foodCategory, selectedApp, region, searchQuery, and MyInterests
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Tab filter
      if (item.tabCategory !== activeTab) return false;

      // 2. Delivery App filter
      if (selectedApp !== '전체' && item.deliveryApp !== selectedApp) return false;

      // 3. Food Category filter
      if (foodCategory !== '전체' && item.foodCategory !== foodCategory && item.foodCategory !== '전체') return false;

      // 4. Region filter
      if (
        !item.targetRegions.includes('전국') &&
        !item.targetRegions.some(
          (r) =>
            r === currentRegion.city ||
            r === `${currentRegion.city} ${currentRegion.district}`
        )
      ) {
        return false;
      }

      // 5. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesBrand = item.brandName?.toLowerCase().includes(q);
        const matchesApp = item.deliveryApp.toLowerCase().includes(q);
        const matchesNotice = item.noticeContent?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesBrand && !matchesApp && !matchesNotice) return false;
      }

      // 6. My Interests filter (if enabled)
      if (showMyInterestsOnly) {
        const matchesFood = userInterests.favoriteFoods.includes(item.foodCategory);
        const matchesBrand = item.brandName && userInterests.favoriteBrands.some(b => item.brandName?.toLowerCase().includes(b.toLowerCase()));
        const matchesApp = userInterests.favoriteApps.includes(item.deliveryApp);
        if (!matchesFood && !matchesBrand && !matchesApp) return false;
      }

      return true;
    });
  }, [items, activeTab, foodCategory, selectedApp, currentRegion, searchQuery, showMyInterestsOnly, userInterests]);

  // Sort filtered items
  const sortedItems = useMemo(() => {
    const list = [...filteredItems];
    switch (sortOption) {
      case 'score_desc':
        return list.sort((a, b) => (b.score || 0) - (a.score || 0));
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

  const totalInterestsCount =
    userInterests.favoriteFoods.length +
    userInterests.favoriteBrands.length +
    userInterests.favoriteApps.length;

  return (
    <div className="space-y-6">
      
      {/* Search & Sort Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="브랜드, 치킨, 피자, 배달앱 또는 이벤트 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="discount-search-input"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              지우기
            </button>
          )}
        </div>

        {/* Filter & Sorting Options */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* My Interests Filter Toggle */}
          {totalInterestsCount > 0 && (
            <button
              onClick={() => setShowMyInterestsOnly(!showMyInterestsOnly)}
              id="interests-filter-toggle"
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                showMyInterestsOnly
                  ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${showMyInterestsOnly ? 'fill-white' : 'text-rose-400'}`} />
              <span>내 관심할인만</span>
            </button>
          )}

          {/* Sort Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              id="discount-sort-select"
              className="bg-transparent text-xs sm:text-sm font-semibold text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="score_desc" className="bg-slate-900 text-slate-200">신뢰도 높은 순 (점수)</option>
              <option value="latest" className="bg-slate-900 text-slate-200">최신순</option>
              <option value="discount_desc" className="bg-slate-900 text-slate-200">할인율 높은 순</option>
              <option value="free_delivery" className="bg-slate-900 text-slate-200">무료배달 우선</option>
              <option value="new_user" className="bg-slate-900 text-slate-200">신규가입 우선</option>
            </select>
          </div>

        </div>

      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div>
          <span className="font-bold text-white">{currentRegion.fullAddress}</span> 기준
          <span className="ml-2 font-bold text-rose-400">{activeTab}</span>
          <span className="ml-1">검색 결과: <strong className="text-white">{sortedItems.length}</strong>건</span>
        </div>
        {selectedApp !== '전체' && (
          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px]">
            {selectedApp} 필터링 적용 중
          </span>
        )}
      </div>

      {/* Main Grid or STRICT ABSOLUTE RULE "데이터 없음" Display */}
      {sortedItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <DiscountCard
                item={item}
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={onToggleFavorite}
              />
              {/* Insert In-Feed Ad Banner every 6 cards */}
              {(index + 1) % 6 === 0 && <AdBanner type="in-feed" slotId={`feed-${index}`} />}
            </React.Fragment>
          ))}
        </div>
      ) : (
        /* ABSOLUTE MANDATE: Display "데이터 없음" when no items match */
        <div 
          id="no-data-display-container"
          className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center my-8 shadow-xl flex flex-col items-center justify-center space-y-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-500">
            <AlertCircle className="w-8 h-8 text-amber-500" />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-amber-400 tracking-tight">
              데이터 없음
            </h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              선택하신 지역(<span className="text-slate-200 font-semibold">{currentRegion.fullAddress}</span>) 및 카테고리에서 진행 중인 공식 확인 프로모션 데이터가 존재하지 않습니다.
            </p>
          </div>
          <p className="text-xs text-slate-500 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 max-w-lg">
            * 대한민국 배달 할인 허브는 허위 할인이나 가짜 데이터를 생성하지 않으며, 각 배달 플랫폼의 검증된 공식 정보만 제공합니다.
          </p>
        </div>
      )}

    </div>
  );
};
