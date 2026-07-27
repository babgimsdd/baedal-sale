import React, { useState, useEffect } from 'react';
import { ThemeMode } from '../types';
import { Moon, Sun, Download, ShieldCheck, RefreshCw, Smartphone, Info } from 'lucide-react';

interface SettingsViewProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  theme,
  onToggleTheme,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsAppInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert('스마트폰 브라우저 메뉴의 [홈 화면에 추가] 또는 [앱 설치]를 선택하세요.');
    }
  };

  return (
    <div className="space-y-4 pb-8">
      
      {/* Theme Settings */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400">화면 테마 설정</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => theme === 'dark' && onToggleTheme()}
            className={`min-h-[48px] p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
              theme === 'light'
                ? 'bg-rose-50 border-rose-300 text-rose-600 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-400'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>밝은 테마 (기본)</span>
          </button>

          <button
            onClick={() => theme === 'light' && onToggleTheme()}
            className={`min-h-[48px] p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
              theme === 'dark'
                ? 'bg-rose-50 border-rose-300 text-rose-600 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-400'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Moon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            <span>어두운 테마</span>
          </button>
        </div>
      </div>

      {/* PWA App Installation Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              스마트폰 앱처럼 홈 화면에 추가
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAppInstalled ? '이미 홈 화면 앱으로 설치되어 사용 중입니다.' : '앱스토어 설치 없이 홈 화면에 바로 설치할 수 있습니다.'}
            </p>
          </div>
        </div>

        {!isAppInstalled && (
          <button
            onClick={handleInstallPWA}
            className="w-full h-12 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            <span>홈 화면에 앱으로 설치하기</span>
          </button>
        )}
      </div>

      {/* Service Data Policy Info */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3 text-xs text-slate-600 dark:text-slate-400">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>공식 데이터 검증 원칙</span>
        </h3>
        <p className="leading-relaxed">
          본 서비스는 임의의 가짜 쿠폰이나 유효하지 않은 URL을 생성하지 않으며, 배달의민족, 요기요, 쿠팡이츠, 땡겨요 등 공식 플랫폼의 공지 및 이벤트 정보만 수집하여 제공합니다.
        </p>
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>버전 v2.0.0 (Mobile-First)</span>
          <span>© 2026 대한민국 배달 할인 허브</span>
        </div>
      </div>

    </div>
  );
};
