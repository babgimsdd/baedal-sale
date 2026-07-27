import React from 'react';
import { MapPin, Utensils, ShieldCheck, Moon, Sun } from 'lucide-react';
import { Region, ThemeMode } from '../types';

interface HeaderProps {
  currentRegion: Region;
  onOpenLocationModal: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRegion,
  onOpenLocationModal,
  theme,
  onToggleTheme,
  onOpenAdmin,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-xs">
      <div className="max-w-md md:max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Logo & App Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-red-600 flex items-center justify-center shadow-md shadow-rose-500/20 text-white">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  배달할인허브
                </h1>
                <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-semibold">
                  <ShieldCheck className="w-3 h-3" /> 공식
                </span>
              </div>
            </div>
          </div>

          {/* Location Badge & Admin & Theme Switcher */}
          <div className="flex items-center gap-2">
            
            {/* GPS / Location Badge */}
            <button
              onClick={onOpenLocationModal}
              id="location-selector-btn"
              className="flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all text-xs font-bold active:scale-95"
              title="위치 설정"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="max-w-[110px] sm:max-w-[160px] truncate">
                {currentRegion.district ? `${currentRegion.city} ${currentRegion.district}` : currentRegion.city}
              </span>
              <span className="text-[10px] text-slate-400">▼</span>
            </button>

            {/* Admin Dashboard Trigger */}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                id="admin-dashboard-header-btn"
                aria-label="관리자 관제"
                title="데이터 관제 Admin"
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all active:scale-95 text-xs font-black"
              >
                ⚙️
              </button>
            )}

            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={onToggleTheme}
              id="theme-toggle-btn"
              aria-label="테마 변경"
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all active:scale-95"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-slate-700" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
