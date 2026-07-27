import React from 'react';
import { DiscountTab } from '../types';
import { Percent, Truck, UserPlus, CreditCard, Tag, Sparkles, Megaphone } from 'lucide-react';

interface DiscountTabNavProps {
  activeTab: DiscountTab;
  onTabChange: (tab: DiscountTab) => void;
  counts: Record<DiscountTab, number>;
}

export const DiscountTabNav: React.FC<DiscountTabNavProps> = ({
  activeTab,
  onTabChange,
  counts,
}) => {
  const tabs: { id: DiscountTab; label: string; icon: React.ReactNode }[] = [
    { id: '오늘의 할인', label: '오늘의 할인', icon: <Percent className="w-4 h-4" /> },
    { id: '오늘의 무료배달', label: '오늘의 무료배달', icon: <Truck className="w-4 h-4 text-emerald-400" /> },
    { id: '신규가입 혜택', label: '신규가입 혜택', icon: <UserPlus className="w-4 h-4 text-amber-400" /> },
    { id: '카드 할인', label: '카드 할인', icon: <CreditCard className="w-4 h-4 text-blue-400" /> },
    { id: '쿠폰', label: '쿠폰', icon: <Tag className="w-4 h-4 text-purple-400" /> },
    { id: '브랜드 행사', label: '브랜드 행사', icon: <Sparkles className="w-4 h-4 text-rose-400" /> },
    { id: '배달앱 공지사항', label: '배달앱 공지사항', icon: <Megaphone className="w-4 h-4 text-cyan-400" /> },
  ];

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 sticky top-16 sm:top-20 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-3 no-scrollbar scroll-smooth">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const count = counts[tab.id] || 0;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                id={`tab-${tab.id}`}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all border ${
                  isActive
                    ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/20'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-700/60'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-700/80 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
