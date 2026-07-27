import React from 'react';
import { DeliveryApp } from '../types';

interface AppFilterNavProps {
  selectedApp: DeliveryApp | '전체';
  onSelectApp: (app: DeliveryApp | '전체') => void;
}

const APPS: { id: DeliveryApp | '전체'; label: string; badgeColor: string }[] = [
  { id: '전체', label: '전체 배달앱', badgeColor: 'bg-slate-700 text-slate-200' },
  { id: '배달의민족', label: '배달의민족', badgeColor: 'bg-teal-500 text-slate-950 font-bold' },
  { id: '요기요', label: '요기요', badgeColor: 'bg-rose-500 text-white font-bold' },
  { id: '쿠팡이츠', label: '쿠팡이츠', badgeColor: 'bg-cyan-500 text-slate-950 font-bold' },
  { id: '땡겨요', label: '땡겨요', badgeColor: 'bg-amber-500 text-slate-950 font-bold' },
  { id: '먹깨비', label: '먹깨비', badgeColor: 'bg-orange-500 text-white font-bold' },
  { id: '지역 배달앱', label: '지역 배달앱', badgeColor: 'bg-purple-500 text-white font-bold' },
  { id: '컬리', label: '컬리', badgeColor: 'bg-indigo-500 text-white font-bold' },
  { id: 'CJ더마켓', label: 'CJ더마켓', badgeColor: 'bg-red-600 text-white font-bold' },
  { id: '기타 밀키트', label: '기타 밀키트', badgeColor: 'bg-emerald-600 text-white font-bold' },
];

export const AppFilterNav: React.FC<AppFilterNavProps> = ({
  selectedApp,
  onSelectApp,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
        <span>지원 배달 플랫폼</span>
        <span>공식 혜택 조회</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {APPS.map((app) => {
          const isActive = selectedApp === app.id;
          return (
            <button
              key={app.id}
              onClick={() => onSelectApp(app.id)}
              id={`app-filter-${app.id}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5 ${
                isActive
                  ? 'bg-rose-600 text-white border-rose-500 font-bold shadow-sm ring-2 ring-rose-500/30'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white border-slate-700/60'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${app.badgeColor.split(' ')[0]}`} />
              <span>{app.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
