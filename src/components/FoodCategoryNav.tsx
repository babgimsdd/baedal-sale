import React from 'react';
import { FoodCategory } from '../types';

interface FoodCategoryNavProps {
  activeCategory: FoodCategory;
  onSelectCategory: (category: FoodCategory) => void;
}

const CATEGORIES: { id: FoodCategory; icon: string }[] = [
  { id: '전체', icon: '🍽️' },
  { id: '치킨', icon: '🍗' },
  { id: '피자', icon: '🍕' },
  { id: '햄버거', icon: '🍔' },
  { id: '중식', icon: '🥟' },
  { id: '일식', icon: '🍣' },
  { id: '분식', icon: '떡' },
  { id: '족발/보쌈', icon: '🥩' },
  { id: '디저트/카페', icon: '☕' },
  { id: '밀키트/마트', icon: '🛒' },
  { id: '기타', icon: '🍱' },
];

export const FoodCategoryNav: React.FC<FoodCategoryNavProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
        <span>음식 카테고리 검색</span>
        <span>{activeCategory === '전체' ? '모든 메뉴' : activeCategory}</span>
      </div>
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              id={`food-category-${cat.id}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all border ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white border-slate-700/60'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
