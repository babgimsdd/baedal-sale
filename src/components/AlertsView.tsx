import React from 'react';
import { PushNotificationConfig, UserInterests } from '../types';
import { Bell, CheckCircle2, AlertTriangle, Smartphone, ShieldCheck } from 'lucide-react';

interface AlertsViewProps {
  config: PushNotificationConfig;
  onUpdateConfig: (config: PushNotificationConfig) => void;
  userInterests: UserInterests;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  config,
  onUpdateConfig,
  userInterests,
}) => {
  const handleRequestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        onUpdateConfig({ ...config, enabled: true });
        new Notification('대한민국 배달 할인 허브', {
          body: '실시간 배달 할인 푸시 알림이 정상 설정되었습니다!',
          icon: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=192&auto=format&fit=crop&q=80',
        });
      } else {
        alert('알림 권한이 거부되었습니다. 브라우저 설정에서 알림 허용을 켜주세요.');
      }
    } else {
      alert('현재 브라우저 환경에서는 웹 푸시 알림을 지원하지 않습니다.');
    }
  };

  return (
    <div className="space-y-4 pb-8">
      
      {/* Web Push Status Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              config.enabled ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}>
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                웹 푸시 알림 {config.enabled ? '켜짐' : '꺼짐'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                새로운 할인 등록 시 실시간으로 알려드립니다.
              </p>
            </div>
          </div>
          <button
            onClick={config.enabled ? () => onUpdateConfig({ ...config, enabled: false }) : handleRequestPermission}
            className={`min-h-[40px] px-4 rounded-xl text-xs font-bold transition-all ${
              config.enabled
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'bg-rose-600 text-white hover:bg-rose-500'
            }`}
          >
            {config.enabled ? '알림 끄기' : '알림 켜기'}
          </button>
        </div>

        {/* Detailed Notification Option Toggles */}
        {config.enabled && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs font-medium text-slate-700 dark:text-slate-300">
            <label className="flex items-center justify-between cursor-pointer py-1">
              <span>🔥 신규 할인 등록 시 알림</span>
              <input
                type="checkbox"
                checked={config.notifyNewDiscount}
                onChange={(e) => onUpdateConfig({ ...config, notifyNewDiscount: e.target.checked })}
                className="w-4 h-4 accent-rose-600"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer py-1">
              <span>🚚 무료배달 이벤트 등록 시 알림</span>
              <input
                type="checkbox"
                checked={config.notifyFreeDelivery}
                onChange={(e) => onUpdateConfig({ ...config, notifyFreeDelivery: e.target.checked })}
                className="w-4 h-4 accent-emerald-600"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer py-1">
              <span>💳 카드 할인 프로모션 알림</span>
              <input
                type="checkbox"
                checked={config.notifyCardDiscount}
                onChange={(e) => onUpdateConfig({ ...config, notifyCardDiscount: e.target.checked })}
                className="w-4 h-4 accent-blue-600"
              />
            </label>
          </div>
        )}
      </div>

      {/* Simulated Recent Alerts History List */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
          최근 수신된 알림 소식
        </h3>

        <div className="space-y-2">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
              🔥
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">[배달의민족] 치킨 브랜드 최대 7,000원 할인</span>
                <span className="text-[10px] text-slate-400">10분 전</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                관심 브랜드 BBQ 할인 쿠폰이 새로 등록되었습니다.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
              🚚
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">[쿠팡이츠] 주말 전음식 무료배달 혜택</span>
                <span className="text-[10px] text-slate-400">1시간 전</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                와우회원 무제한 무료배달 혜택이 적용됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
