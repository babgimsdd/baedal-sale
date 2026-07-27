import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, ChevronRight } from 'lucide-react';
import { AiSeoResponse } from '../types';

interface AiSeoBannerProps {
  activeTab: string;
  selectedApp: string;
  region: string;
}

export const AiSeoBanner: React.FC<AiSeoBannerProps> = ({
  activeTab,
  selectedApp,
  region,
}) => {
  const [seoData, setSeoData] = useState<AiSeoResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAiSeo = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/seo-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: activeTab,
          targetApp: selectedApp,
          region: region,
        }),
      });
      const data = await res.json();
      setSeoData(data);
    } catch (err) {
      console.error('Failed to fetch AI SEO:', err);
      setSeoData({
        title: `${region} ${activeTab} 정보`,
        description: `${region} 지역에서 이용 가능한 공식 배달 할인, 무료배달, 카드 혜택 정보입니다.`,
        keywords: ['배달할인', '무료배달', '쿠폰', region, activeTab],
        summary: '공식 확인 가능한 실시간 배달 할인 정보만을 전달합니다.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAiSeo();
  }, [activeTab, selectedApp, region]);

  return (
    <div 
      id="ai-seo-banner-container"
      className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-indigo-950/40 border border-rose-500/20 rounded-2xl p-4 sm:p-5 mb-6 shadow-xl relative overflow-hidden"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              Google AI Studio (Gemini 3.6 Flash) SEO & 핵심 요약
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white mt-1">
              {loading ? 'AI가 실시간 할인 요약을 구성 중입니다...' : seoData?.title || `${region} ${activeTab} 요약`}
            </h2>
          </div>
        </div>

        <button
          onClick={fetchAiSeo}
          disabled={loading}
          id="refresh-ai-seo-btn"
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 shrink-0"
          title="AI 요약 새로고침"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-rose-400' : ''}`} />
        </button>
      </div>

      {!loading && seoData && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {seoData.description}
          </p>

          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] text-slate-400 font-semibold">주요 키워드:</span>
            {seoData.keywords?.map((kw, i) => (
              <span
                key={i}
                className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60"
              >
                #{kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
