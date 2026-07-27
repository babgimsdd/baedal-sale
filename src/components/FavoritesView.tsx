import React, { useState } from 'react';
import { DiscountItem, UserInterests, FoodCategory, DeliveryApp, RecentlyViewed } from '../types';
import { DiscountCard } from './DiscountCard';
import { Heart, Plus, Trash2, Utensils, Tag, Smartphone, EyeOff, Clock } from 'lucide-react';

interface FavoritesViewProps {
  items: DiscountItem[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  userInterests: UserInterests;
  onSaveInterests: (interests: UserInterests) => void;
  recentlyViewed: RecentlyViewed;
  onTrackInteraction: (item: DiscountItem) => void;
}

const FOOD_OPTIONS: FoodCategory[] = ['치킨', '피자', '햄버거', '중식', '일식', '분식', '족발/보쌈', '디저트/카페', '밀키트/마트'];
const APP_OPTIONS: DeliveryApp[] = ['배달의민족', '요기요', '쿠팡이츠', '땡겨요', '먹깨비', '컬리', 'CJ더마켓'];

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  items,
  favorites,
  onToggleFavorite,
  userInterests,
  onSaveInterests,
  recentlyViewed,
  onTrackInteraction,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'scraps' | 'recent' | 'keywords'>('scraps');
  const [newBrandInput, setNewBrandInput] = useState('');

  // Favorite Scrapped Items
  const scrappedItems = items.filter((i) => favorites.includes(i.id));
  
  // Recent Items
  const recentItems = recentlyViewed.discounts.map(id => items.find(i => i.id === id)).filter(Boolean) as DiscountItem[];

  // Toggle Food
  const handleToggleFood = (food: FoodCategory) => {
    const exists = userInterests.favoriteFoods.includes(food);
    const updated = exists
      ? userInterests.favoriteFoods.filter((f) => f !== food)
      : [...userInterests.favoriteFoods, food];
    onSaveInterests({ ...userInterests, favoriteFoods: updated });
  };

  // Toggle App
  const handleToggleApp = (app: DeliveryApp) => {
    const exists = userInterests.favoriteApps.includes(app);
    const updated = exists
      ? userInterests.favoriteApps.filter((a) => a !== app)
      : [...userInterests.favoriteApps, app];
    onSaveInterests({ ...userInterests, favoriteApps: updated });
  };

  // Toggle Hidden App
  const handleToggleHiddenApp = (app: DeliveryApp) => {
    const exists = userInterests.hiddenApps?.includes(app);
    const hiddenList = userInterests.hiddenApps || [];
    const updated = exists
      ? hiddenList.filter((a) => a !== app)
      : [...hiddenList, app];
    onSaveInterests({ ...userInterests, hiddenApps: updated });
  };

  // Add Brand
  const handleAddBrand = () => {
    if (!newBrandInput.trim()) return;
    if (userInterests.favoriteBrands.includes(newBrandInput.trim())) return;
    onSaveInterests({
      ...userInterests,
      favoriteBrands: [...userInterests.favoriteBrands, newBrandInput.trim()],
    });
    setNewBrandInput('');
  };

  // Remove Brand
  const handleRemoveBrand = (brand: string) => {
    onSaveInterests({
      ...userInterests,
      favoriteBrands: userInterests.favoriteBrands.filter((b) => b !== brand),
    });
  };

  return (
    <div className="space-y-4 pb-8">
      
      {/* Sub Tabs */}
      <div className="grid grid-cols-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1">
        <button
          onClick={() => setActiveSubTab('scraps')}
          className={`py-2 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === 'scraps'
              ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          찜한 할인 ({scrappedItems.length})
        </button>
        <button
          onClick={() => setActiveSubTab('recent')}
          className={`py-2 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === 'recent'
              ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          최근 본 할인
        </button>
        <button
          onClick={() => setActiveSubTab('keywords')}
          className={`py-2 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === 'keywords'
              ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          관심 설정
        </button>
      </div>

      {activeSubTab === 'scraps' ? (
        /* Scrapped Discount Cards Grid */
        <div>
          {scrappedItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {scrappedItems.map((item) => (
                <DiscountCard
                  key={item.id}
                  item={item}
                  isFavorite={true}
                  onToggleFavorite={onToggleFavorite}
                  onTrackInteraction={onTrackInteraction}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center space-y-3">
              <Heart className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
              <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                찜한 할인이 없습니다
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                할인 카드의 하트 버튼을 눌러 나만의 할인 목록에 담아보세요!
              </p>
            </div>
          )}
        </div>
      ) : activeSubTab === 'recent' ? (
        /* Recent Items Grid */
        <div className="space-y-4">
          {/* Quick Stats: Recently Viewed Brands & Categories */}
          {(recentlyViewed.brands.length > 0 || recentlyViewed.categories.length > 0) && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xs space-y-2">
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">👀 최근 본 브랜드 및 카테고리 (자동 수집)</div>
              <div className="flex flex-wrap gap-1.5">
                {recentlyViewed.brands.map(b => (
                  <span key={b} className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300">#{b}</span>
                ))}
                {recentlyViewed.categories.map(c => (
                  <span key={c} className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300">#{c}</span>
                ))}
              </div>
            </div>
          )}

          {recentItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {recentItems.map((item) => (
                <DiscountCard
                  key={`recent-${item.id}`}
                  item={item}
                  isFavorite={favorites.includes(item.id)}
                  onToggleFavorite={onToggleFavorite}
                  onTrackInteraction={onTrackInteraction}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center space-y-3">
              <Clock className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
              <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                최근 확인한 할인이 없습니다
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                할인 정보를 확인하시면 이 곳에 자동으로 기록됩니다.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Interest Keyword Settings */
        <div className="space-y-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          
          {/* Favorite Apps */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-teal-500" />
              <span>자주 쓰는 배달앱 (관심)</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {APP_OPTIONS.map((app) => {
                const isSelected = userInterests.favoriteApps.includes(app);
                return (
                  <button
                    key={app}
                    onClick={() => handleToggleApp(app)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {app} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hidden Apps (Never Show) */}
          <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <EyeOff className="w-4 h-4 text-slate-500" />
              <span>숨기고 싶은 배달앱 (목록에서 제외)</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {APP_OPTIONS.map((app) => {
                const isHidden = userInterests.hiddenApps?.includes(app);
                return (
                  <button
                    key={app}
                    onClick={() => handleToggleHiddenApp(app)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      isHidden
                        ? 'bg-slate-700 text-white border-slate-700 dark:bg-slate-700'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 hover:text-slate-600'
                    }`}
                  >
                    {app} {isHidden && '숨김됨'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Favorite Foods */}
          <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-rose-500" />
              <span>관심 음식 카테고리</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {FOOD_OPTIONS.map((food) => {
                const isSelected = userInterests.favoriteFoods.includes(food);
                return (
                  <button
                    key={food}
                    onClick={() => handleToggleFood(food)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-rose-500 text-white border-rose-500'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {food} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Favorite Brands */}
          <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-amber-500" />
              <span>관심 브랜드 (예: BBQ, 도미노피자, 버거킹)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="브랜드 이름 입력..."
                value={newBrandInput}
                onChange={(e) => setNewBrandInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddBrand()}
                className="flex-1 h-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
              />
              <button
                onClick={handleAddBrand}
                className="h-10 px-4 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl flex items-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" /> 추가
              </button>
            </div>

            {/* Added Brand Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {userInterests.favoriteBrands.map((brand) => (
                <span
                  key={brand}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold"
                >
                  {brand}
                  <button
                    onClick={() => handleRemoveBrand(brand)}
                    className="hover:text-rose-500"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
