import React from 'react';
import { ShieldCheck, RefreshCw, Layers } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs py-8 mt-8 pb-24">
      <div className="max-w-md md:max-w-3xl mx-auto px-4 space-y-6">
        
        {/* Core Principles */}
        <div className="grid grid-cols-1 gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800 dark:text-slate-200">100% 공식 검증 데이터 원칙</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                공개적으로 확인 가능한 배달앱 공식 이벤트 및 공지사항 정보만 제공하며, 가짜 할인이나 유효하지 않은 정보는 등록되지 않습니다.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <RefreshCw className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800 dark:text-slate-200">실시간 자동 동기화</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                배달 플랫폼의 이벤트를 수집 및 파싱하여 최신 할인 정보로 실시간 동기화 배치됩니다.
              </p>
            </div>
          </div>

        </div>

        {/* Supported Platforms */}
        <div className="text-[11px] text-slate-400 space-y-1">
          <div className="font-bold text-slate-600 dark:text-slate-300">지원 서비스 목록:</div>
          <div>배달의민족 · 요기요 · 쿠팡이츠 · 땡겨요 · 먹깨비 · 지역배달앱 · 컬리 · CJ더마켓</div>
        </div>

        {/* Copyright */}
        <div className="text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 대한민국 배달 할인 허브. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <a href="#privacy" className="hover:underline">개인정보처리방침</a>
            <a href="#terms" className="hover:underline">이용약관</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
