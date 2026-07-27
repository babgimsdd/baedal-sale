import React, { useState } from 'react';
import { X, Bell, BellOff, ShieldCheck, Zap, CheckCircle2, Smartphone } from 'lucide-react';
import { PushNotificationConfig } from '../types';

interface PushNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PushNotificationConfig;
  onUpdateConfig: (newConfig: PushNotificationConfig) => void;
}

export const PushNotificationModal: React.FC<PushNotificationModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
}) => {
  const [enabled, setEnabled] = useState(config.enabled);
  const [notifyNewDiscount, setNotifyNewDiscount] = useState(config.notifyNewDiscount);
  const [notifyFreeDelivery, setNotifyFreeDelivery] = useState(config.notifyFreeDelivery);
  const [notifyCardDiscount, setNotifyCardDiscount] = useState(config.notifyCardDiscount);
  const [notifyMyInterestsOnly, setNotifyMyInterestsOnly] = useState(config.notifyMyInterestsOnly);
  const [permissionState, setPermissionState] = useState<string>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  if (!isOpen) return null;

  const handleTogglePermission = async () => {
    if (typeof Notification === 'undefined') {
      alert('현재 사용 중인 브라우저는 웹 푸시 알림을 지원하지 않습니다.');
      return;
    }

    if (!enabled) {
      const result = await Notification.requestPermission();
      setPermissionState(result);
      if (result === 'granted') {
        setEnabled(true);
      } else {
        alert('브라우저 알림 권한이 거부되었습니다. 브라우저 주소창 차단 해제를 확인해주세요.');
      }
    } else {
      setEnabled(false);
    }
  };

  const handleSendTestPush = () => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification('대한민국 배달 할인 허브 알림', {
        body: '🎉 [배달의민족/요기요] 새로운 무료배달 & 브랜드 쿠폰이 등록되었습니다!',
        icon: '/favicon.ico',
      });
    }
    setTestNotificationSent(true);
    setTimeout(() => setTestNotificationSent(false), 3000);
  };

  const handleSave = () => {
    onUpdateConfig({
      enabled,
      notifyNewDiscount,
      notifyFreeDelivery,
      notifyCardDiscount,
      notifyMyInterestsOnly,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        id="push-modal-container"
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">웹 푸시 알림 구조 설정</h2>
          </div>
          <button
            onClick={onClose}
            id="close-push-modal-btn"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          
          {/* Main Toggle Banner */}
          <div className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${
            enabled
              ? 'bg-emerald-950/40 border-emerald-500/30'
              : 'bg-slate-800/60 border-slate-700/60'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                {enabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  {enabled ? '실시간 할인 푸시 알림 활성화' : '알림 비활성화 상태'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  서비스 워커 기반 실시간 배달 할인 등록 수신 구조
                </p>
              </div>
            </div>

            <button
              onClick={handleTogglePermission}
              id="toggle-push-permission-btn"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                enabled
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {enabled ? '끄기' : '알림 허용'}
            </button>
          </div>

          {/* Sub Notification Preference Controls */}
          <div className="space-y-3 pt-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              알림 상세 수신 옵션
            </p>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <span className="text-xs font-medium text-slate-200">새로운 신규 할인 정보 수신</span>
              <input
                type="checkbox"
                checked={notifyNewDiscount}
                onChange={(e) => setNotifyNewDiscount(e.target.checked)}
                className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <span className="text-xs font-medium text-slate-200">무료배달 이벤트 즉시 알림</span>
              <input
                type="checkbox"
                checked={notifyFreeDelivery}
                onChange={(e) => setNotifyFreeDelivery(e.target.checked)}
                className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <span className="text-xs font-medium text-slate-200">카드/페이사 제휴 할인 수신</span>
              <input
                type="checkbox"
                checked={notifyCardDiscount}
                onChange={(e) => setNotifyCardDiscount(e.target.checked)}
                className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <span className="text-xs font-medium text-rose-300 font-bold">내 관심 목록(음식/브랜드/앱) 할인만 수신</span>
              <input
                type="checkbox"
                checked={notifyMyInterestsOnly}
                onChange={(e) => setNotifyMyInterestsOnly(e.target.checked)}
                className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Test Push Trigger */}
          <div className="pt-2">
            <button
              onClick={handleSendTestPush}
              id="send-test-push-btn"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2 border border-slate-700"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>테스트 웹 푸시 알림 발송 테스트</span>
            </button>
            {testNotificationSent && (
              <p className="text-[11px] text-emerald-400 text-center mt-1.5 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 테스트 푸시 알림 신호가 브라우저에 전달되었습니다.
              </p>
            )}
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-950/40 p-3 rounded-xl border border-slate-800 leading-relaxed">
            <span className="font-bold text-slate-400">웹 푸시 시스템 구조:</span>
            <br />
            Service Worker (VAPID Key) ↔ GitHub Actions 6시간 주기로 공식 이벤트 수집 ↔ FCM / WebPush API 발송 구조로 설계되어 있습니다.
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs text-slate-500">권한 상태: {permissionState}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              id="save-push-config-btn"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-md shadow-rose-600/20"
            >
              설정 완료
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
