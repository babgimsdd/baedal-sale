import React from 'react';
import { Info } from 'lucide-react';

interface AdBannerProps {
  type: 'top-banner' | 'in-feed' | 'sidebar';
  slotId?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ type, slotId = 'default-slot' }) => {
  if (type === 'top-banner') {
    return (
      <div 
        id={`ad-slot-top-${slotId}`}
        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 my-3 text-center relative overflow-hidden shadow-2xs"
      >
        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5 px-1">
          <span className="font-semibold tracking-wider uppercase bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400">
            광고 (Google AdSense)
          </span>
          <span className="flex items-center gap-0.5">
            <Info className="w-3 h-3" /> 배달 혜택 추천
          </span>
        </div>
        <div className="min-h-[72px] sm:min-h-[90px] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-3">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            배달 할인 파트너십 및 스폰서 브랜드 배너
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Google AdSense 정책 준수 가로형 배치 구역
          </p>
        </div>
      </div>
    );
  }

  // In-Feed Ad Banner
  return (
    <div 
      id={`ad-slot-feed-${slotId}`}
      className="col-span-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-center my-2 shadow-2xs"
    >
      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
        <span className="font-semibold uppercase bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400">
          광고
        </span>
        <span>AdSense In-Feed</span>
      </div>
      <div className="py-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          스폰서 배달 브랜드 & 카드 혜택 배너
        </p>
      </div>
    </div>
  );
};
