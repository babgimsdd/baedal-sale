import React, { useState, useEffect, useMemo } from 'react';
import { DeliveryAppRollingBanner } from './components/DeliveryAppRollingBanner';
import {
  Compass,
  Search,
  Plus,
  Lock,
  Unlock,
  ExternalLink,
  Copy,
  Check,
  X,
  Trash2,
  Edit3,
  Sparkles,
  Tag,
  ChevronRight,
  ShieldAlert,
  RefreshCw,
  Clock,
  ShoppingBag,
  Info,
  Share2,
  Smartphone,
  Eye,
  EyeOff,
  Key,
  Bot,
  Code,
  FileJson,
  Link as LinkIcon,
  Bell
} from 'lucide-react';

// Delivery App Type Definition
export type DeliveryApp = '전체' | '배민' | '쿠팡이츠' | '요기요' | '땡겨요' | '먹깨비' | '두잇' | '배달특급' | '대구로' | '동백통';

export interface DiscountItem {
  id: string;
  app: string;
  brand: string;
  brand_id?: string;
  discount: string;
  validity: string;
  minOrder?: string;
  category?: string;
  card_discount?: string;
  affiliate_link?: string;
  is_top_ranked?: boolean;
  couponCode?: string;
  linkNote?: string;
  createdAt: number;
}

// Initial Sample Data
const INITIAL_DISCOUNTS: DiscountItem[] = [
  {
    id: '1',
    app: '배민',
    brand: 'BBQ 치킨',
    brand_id: 'BBQ',
    discount: '4,000원 할인',
    validity: '오늘 하루만 유효',
    minOrder: '18,000원 이상',
    category: '치킨',
    card_discount: '신한카드 2,000원 추가 할인',
    affiliate_link: 'https://m.baemin.com',
    is_top_ranked: true,
    couponCode: 'BBQ0724',
    linkNote: '배달의민족 앱 브랜드관 쿠폰팩 다운로드',
    createdAt: Date.now() - 1000 * 60 * 15,
  },
  {
    id: '2',
    app: '쿠팡이츠',
    brand: '버거킹',
    brand_id: 'BURGERKING',
    discount: '5,000원 할인',
    validity: '오늘 하루만 유효',
    minOrder: '15,000원 이상',
    category: '버거',
    card_discount: '카카오페이 1,000원 즉시 할인',
    affiliate_link: 'https://eats.coupang.com',
    is_top_ranked: true,
    couponCode: 'EATS4YOU',
    linkNote: '쿠팡 와우 회원 10% 자동 할인 중복 적용 가능',
    createdAt: Date.now() - 1000 * 60 * 40,
  },
  {
    id: '3',
    app: '요기요',
    brand: '반올림피자',
    discount: '6,000원 할인',
    validity: '오늘 하루만 유효',
    minOrder: '20,000원 이상',
    category: '피자',
    couponCode: 'YOGIPIZZA',
    linkNote: '요기서결제 시 6,000원 즉시 할인 쿠폰',
    createdAt: Date.now() - 1000 * 60 * 60,
  },
  {
    id: '4',
    app: '땡겨요',
    brand: '처갓집양념치킨',
    discount: '7,000원 할인',
    validity: '오늘 하루만 유효',
    minOrder: '19,000원 이상',
    category: '치킨',
    couponCode: 'DDANG0724',
    linkNote: '땡겨요 첫주문 또는 신한카드 결제 추가혜택',
    createdAt: Date.now() - 1000 * 60 * 90,
  },
  {
    id: '5',
    app: '배민',
    brand: '동대문 엽기떡볶이',
    discount: '3,000원 할인',
    validity: '오늘 하루만 유효',
    minOrder: '14,000원 이상',
    category: '분식/야식',
    couponCode: 'YUPTTEOK',
    linkNote: '배민 포장주문 선택 시 3,000원 할인',
    createdAt: Date.now() - 1000 * 60 * 120,
  },
  {
    id: '6',
    app: '쿠팡이츠',
    brand: '공차 (Gong cha)',
    discount: '4,000원 할인',
    validity: '오늘 하루만 유효',
    minOrder: '12,000원 이상',
    category: '카페/디저트',
    couponCode: 'GONGCHA07',
    linkNote: '쿠팡이츠 음료 카테고리 딜 쿠폰',
    createdAt: Date.now() - 1000 * 60 * 180,
  },
];

// Delivery App Theme Config (Toss minimal style + App Signature Colors + Deep Link Specs)
const APP_THEMES = {
  배민: {
    name: '배달의민족',
    shortName: '배민',
    badgeBg: 'bg-[#2AC1BC]',
    badgeText: 'text-white',
    lightBg: 'bg-[#E8F8F7]',
    textColor: 'text-[#008B86]',
    borderColor: 'border-[#2AC1BC]/20',
    btnBg: 'bg-[#2AC1BC] hover:bg-[#25B1AC]',
    scheme: 'baemin://',
    packageName: 'com.sample.baemin',
    appStoreUrl: 'https://apps.apple.com/kr/app/id378084485',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.sample.baemin',
    webUrl: 'https://m.baemin.com/',
  },
  쿠팡이츠: {
    name: '쿠팡이츠',
    shortName: '쿠팡이츠',
    badgeBg: 'bg-[#00A3FF]',
    badgeText: 'text-white',
    lightBg: 'bg-[#EBF5FF]',
    textColor: 'text-[#0066CC]',
    borderColor: 'border-[#00A3FF]/20',
    btnBg: 'bg-[#00A3FF] hover:bg-[#0092E6]',
    scheme: 'coupangeats://',
    packageName: 'com.coupang.mobile.eats',
    appStoreUrl: 'https://apps.apple.com/kr/app/id1463131711',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.coupang.mobile.eats',
    webUrl: 'https://eats.coupang.com/',
  },
  요기요: {
    name: '요기요',
    shortName: '요기요',
    badgeBg: 'bg-[#FA0050]',
    badgeText: 'text-white',
    lightBg: 'bg-[#FFEBF0]',
    textColor: 'text-[#D00040]',
    borderColor: 'border-[#FA0050]/20',
    btnBg: 'bg-[#FA0050] hover:bg-[#E00048]',
    scheme: 'yogiyo://',
    packageName: 'com.fineapp.yogiyo',
    appStoreUrl: 'https://apps.apple.com/kr/app/id543708081',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.fineapp.yogiyo',
    webUrl: 'https://www.yogiyo.co.kr/',
  },
  땡겨요: {
    name: '땡겨요',
    shortName: '땡겨요',
    badgeBg: 'bg-[#FF5B00]',
    badgeText: 'text-white',
    lightBg: 'bg-[#FFF0E6]',
    textColor: 'text-[#CC4800]',
    borderColor: 'border-[#FF5B00]/20',
    btnBg: 'bg-[#FF5B00] hover:bg-[#E65200]',
    scheme: 'ddangyo://',
    packageName: 'kr.co.shinhan.ddangyo',
    appStoreUrl: 'https://apps.apple.com/kr/app/id1583726080',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=kr.co.shinhan.ddangyo',
    webUrl: 'https://www.ddangyo.com/',
  },
  먹깨비: {
    name: '먹깨비',
    shortName: '먹깨비',
    badgeBg: 'bg-[#8B5CF6]',
    badgeText: 'text-white',
    lightBg: 'bg-[#F3E8FF]',
    textColor: 'text-[#7C3AED]',
    borderColor: 'border-[#8B5CF6]/20',
    btnBg: 'bg-[#8B5CF6] hover:bg-[#7C3AED]',
    scheme: 'mukkebi://',
    packageName: 'com.mukkebi.app',
    appStoreUrl: 'https://apps.apple.com/kr/app/id1324707198',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.mukkebi.app',
    webUrl: 'https://www.mukkebi.com/',
  },
  두잇: {
    name: '두잇',
    shortName: '두잇',
    badgeBg: 'bg-[#10B981]',
    badgeText: 'text-white',
    lightBg: 'bg-[#E1F8F0]',
    textColor: 'text-[#059669]',
    borderColor: 'border-[#10B981]/20',
    btnBg: 'bg-[#10B981] hover:bg-[#059669]',
    scheme: 'doeat://',
    packageName: 'com.doeat.app',
    appStoreUrl: 'https://apps.apple.com/kr/app/id1588667634',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.doeat.app',
    webUrl: 'https://doeat.io/',
  },
  배달특급: {
    name: '배달특급',
    shortName: '배달특급',
    badgeBg: 'bg-[#2563EB]',
    badgeText: 'text-white',
    lightBg: 'bg-[#EFF6FF]',
    textColor: 'text-[#1D4ED8]',
    borderColor: 'border-[#2563EB]/20',
    btnBg: 'bg-[#2563EB] hover:bg-[#1D4ED8]',
    scheme: 'specialdelivery://',
    packageName: 'com.kgc.specialdelivery',
    appStoreUrl: 'https://apps.apple.com/kr/app/id1535497217',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.kgc.specialdelivery',
    webUrl: 'https://www.specialdelivery.or.kr/',
  },
  대구로: {
    name: '대구로',
    shortName: '대구로',
    badgeBg: 'bg-[#EC4899]',
    badgeText: 'text-white',
    lightBg: 'bg-[#FCE7F3]',
    textColor: 'text-[#DB2777]',
    borderColor: 'border-[#EC4899]/20',
    btnBg: 'bg-[#EC4899] hover:bg-[#DB2777]',
    scheme: 'daaguro://',
    packageName: 'com.daaguro.app',
    appStoreUrl: 'https://apps.apple.com/kr/app/id1576839352',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.daaguro.app',
    webUrl: 'https://daaguro.com/',
  },
  동백통: {
    name: '동백통',
    shortName: '동백통',
    badgeBg: 'bg-[#F59E0B]',
    badgeText: 'text-white',
    lightBg: 'bg-[#FEF3C7]',
    textColor: 'text-[#D97706]',
    borderColor: 'border-[#F59E0B]/20',
    btnBg: 'bg-[#F59E0B] hover:bg-[#D97706]',
    scheme: 'dongbaegtong://',
    packageName: 'com.dongbaegtong.app',
    appStoreUrl: 'https://apps.apple.com/kr/app/id1593386612',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.dongbaegtong.app',
    webUrl: 'https://www.dongbaegtong.com/',
  },
};

export default function App() {
  // State for discounts list (loads from localStorage or initial sample array)
  const [discounts, setDiscounts] = useState<DiscountItem[]>(() => {
    try {
      const saved = localStorage.getItem('delivery_compass_discounts_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load from localStorage', e);
    }
    return INITIAL_DISCOUNTS;
  });

  // Realtime Live Data Fetching State
  const [isRefreshingLive, setIsRefreshingLive] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string | null>(null);

  // Fetch Live Updated Discounts JSON from Server/GitHub
  const fetchLiveDiscounts = async (silent = false) => {
    try {
      if (!silent) setIsRefreshingLive(true);
      const res = await fetch(`/discounts.json?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setDiscounts(data);
          try {
            localStorage.setItem('delivery_compass_discounts_v1', JSON.stringify(data));
          } catch (e) {
            console.error(e);
          }
          const nowStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
          setLastUpdatedTime(nowStr);
          if (!silent) {
            showToast(`🔄 실시간 배달 핫딜 데이터 ${data.length}건 연동 완료! (${nowStr})`);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch live discounts.json:', err);
    } finally {
      setIsRefreshingLive(false);
    }
  };

  // Auto-sync live discounts on mount and every 3 minutes
  useEffect(() => {
    fetchLiveDiscounts(true);
    const interval = setInterval(() => {
      fetchLiveDiscounts(true);
    }, 180000);
    return () => clearInterval(interval);
  }, []);

  // Active filter states
  const [selectedApp, setSelectedApp] = useState<DeliveryApp>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  // Admin state & Saved Password (localStorage)
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showLoginPwdText, setShowLoginPwdText] = useState(false);

  // Stored Admin Password (defaults to '1234') with dual persistence (localStorage + cookie backup)
  const [currentAdminPassword, setCurrentAdminPassword] = useState<string>(() => {
    try {
      const local = localStorage.getItem('delivery_compass_admin_pwd');
      if (local && local.trim()) return local.trim();

      if (typeof document !== 'undefined') {
        const match = document.cookie.match(/(?:^|; )delivery_admin_pwd=([^;]*)/);
        if (match && match[1]) {
          const decoded = decodeURIComponent(match[1]);
          if (decoded && decoded.trim()) {
            localStorage.setItem('delivery_compass_admin_pwd', decoded.trim());
            return decoded.trim();
          }
        }
      }
    } catch {
      // ignore
    }
    return '1234';
  });

  // Stored Affiliate Tracking URLs (Admin Managed)
  const [affiliateUrls, setAffiliateUrls] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('delivery_affiliate_urls');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      '쿠팡이츠': 'https://eats.coupang.com',
      '배민': 'https://m.baemin.com',
      '요기요': 'https://www.yogiyo.co.kr',
      '땡겨요': 'https://www.ddangyo.com',
      '먹깨비': 'https://www.mukkebi.com',
      '두잇': 'https://doeat.io',
      '배달특급': 'https://www.specialdelivery.or.kr',
      '대구로': 'https://daaguro.com',
      '동백통': 'https://www.dongbaegtong.com',
    };
  });
  const [showAffiliateModal, setShowAffiliateModal] = useState(false);

  // Favorite Food / Brand Alert State (Saved in LocalStorage)
  const [favoriteKeywords, setFavoriteKeywords] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('delivery_favorite_keywords');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['BBQ', '버거킹', '엽기떡볶이', '치킨'];
  });
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [showFoodAlertModal, setShowFoodAlertModal] = useState(false);
  const [enableBrowserNotification, setEnableBrowserNotification] = useState<boolean>(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  });

  // User Location State (Saved in LocalStorage for 100% free Vercel hosting)
  const [userAddress, setUserAddress] = useState<string>(() => {
    try {
      return localStorage.getItem('delivery_user_address') || '서울특별시 관악구 신림동';
    } catch {
      return '서울특별시 관악구 신림동';
    }
  });

  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressInputText, setAddressInputText] = useState('');

  // GPS Location Handler
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      showToast('이 브라우저는 GPS 위치 서비스를 지원하지 않습니다.');
      return;
    }
    setIsDetectingGps(true);
    showToast('📡 현재 위치(GPS) 수신 중...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetectingGps(false);
        const lat = pos.coords.latitude;
        const sampleRegions = [
          '서울특별시 관악구 신림동',
          '서울특별시 마포구 서교동',
          '경기도 성남시 분당구 정자동',
          '대구광역시 수성구 범어동',
          '부산광역시 부산진구 부전동',
        ];
        const detectedRegion = sampleRegions[Math.floor(Math.abs(lat * 100) % sampleRegions.length)];
        setUserAddress(detectedRegion);
        try {
          localStorage.setItem('delivery_user_address', detectedRegion);
        } catch (e) {
          console.error(e);
        }
        showToast(`📍 위치 인식 성공: ${detectedRegion}`);
        setShowAddressModal(false);
      },
      () => {
        setIsDetectingGps(false);
        showToast('위치 권한이 거부되었거나 수신이 지연되었습니다. 주소를 직접 입력해 주세요.');
      },
      { timeout: 8000 }
    );
  };

  // Save admin password to both localStorage and cookie when updated
  useEffect(() => {
    try {
      localStorage.setItem('delivery_compass_admin_pwd', currentAdminPassword);
      if (typeof document !== 'undefined') {
        document.cookie = `delivery_admin_pwd=${encodeURIComponent(currentAdminPassword)}; path=/; max-age=315360000; SameSite=Lax`;
      }
    } catch (e) {
      console.error('Failed to save admin password', e);
    }
  }, [currentAdminPassword]);

  // Admin Change Password Modal State
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [changeCurrentPwd, setChangeCurrentPwd] = useState('');
  const [changeNewPwd, setChangeNewPwd] = useState('');
  const [changeNewPwdConfirm, setChangeNewPwdConfirm] = useState('');
  const [changePwdError, setChangePwdError] = useState('');
  const [showChangePwdText, setShowChangePwdText] = useState(false);

  // Gemini AI Auto-Parse State
  const [showAiParseModal, setShowAiParseModal] = useState(false);
  const [aiInputText, setAiInputText] = useState('');
  const [isParsingAi, setIsParsingAi] = useState(false);
  const [aiParseResult, setAiParseResult] = useState<Array<{
    platform: string;
    category: string;
    brand: string;
    discount: string;
    condition: string;
    duration: string;
  }> | null>(null);

  // Vercel Cron Guide Modal State
  const [showVercelGuideModal, setShowVercelGuideModal] = useState(false);

  // Admin Register / Edit Modal State
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [editingItem, setEditingItem] = useState<DiscountItem | null>(null);

  // Form Fields
  const [formApp, setFormApp] = useState<'배민' | '쿠팡이츠' | '요기요' | '땡겨요'>('배민');
  const [formBrand, setFormBrand] = useState('');
  const [formDiscount, setFormDiscount] = useState('');
  const [formValidity, setFormValidity] = useState('오늘 하루만 유효');
  const [formMinOrder, setFormMinOrder] = useState('15,000원 이상');
  const [formCategory, setFormCategory] = useState('치킨');
  const [formCouponCode, setFormCouponCode] = useState('');
  const [formLinkNote, setFormLinkNote] = useState('');

  // Selected item modal for "앱으로 이동" click
  const [activeModalItem, setActiveModalItem] = useState<DiscountItem | null>(null);
  
  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // PWA Install & Share State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallGuideModal, setShowInstallGuideModal] = useState(false);

  // Capture beforeinstallprompt event for Android / Chrome PWA install
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Handle Share Function
  const handleShare = async () => {
    const shareData = {
      title: '오늘의 배달 할인 나침반',
      text: '배민 · 쿠팡이츠 · 요기요 · 땡겨요 실시간 통합 할인 정보를 확인해 보세요!',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast('📢 성공적으로 공유되었습니다!');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          navigator.clipboard.writeText(window.location.href);
          showToast('🔗 사이트 주소가 복사되었습니다!');
        }
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('🔗 사이트 주소가 복사되었습니다! 친구에게 공유해 보세요.');
    }
  };

  // Handle Add to Home Screen Function
  const handleAddToHomeScreen = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          showToast('📲 홈 화면에 성공적으로 추가되었습니다!');
        } else {
          showToast('💡 브라우저 메뉴[⋮]에서 언제든 [홈 화면에 추가]를 할 수 있습니다.');
        }
        setDeferredPrompt(null);
      });
    } else {
      setShowInstallGuideModal(true);
    }
  };

  // Save to localStorage whenever discounts change
  useEffect(() => {
    try {
      localStorage.setItem('delivery_compass_discounts_v1', JSON.stringify(discounts));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [discounts]);

  // Show Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Filtered List calculation
  const filteredDiscounts = useMemo(() => {
    return discounts.filter((item) => {
      // App Filter
      if (selectedApp !== '전체' && item.app !== selectedApp) {
        return false;
      }
      // Category Filter
      if (selectedCategory !== '전체' && item.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchBrand = item.brand.toLowerCase().includes(query);
        const matchApp = item.app.toLowerCase().includes(query);
        const matchCategory = (item.category || '').toLowerCase().includes(query);
        const matchDiscount = item.discount.toLowerCase().includes(query);
        return matchBrand || matchApp || matchCategory || matchDiscount;
      }
      return true;
    });
  }, [discounts, selectedApp, selectedCategory, searchQuery]);

  // Count by app for tab badges
  const appCounts = useMemo(() => {
    const counts: Record<DeliveryApp, number> = {
      전체: discounts.length,
      배민: 0,
      쿠팡이츠: 0,
      요기요: 0,
      땡겨요: 0,
      먹깨비: 0,
      두잇: 0,
      배달특급: 0,
      대구로: 0,
      동백통: 0,
    };
    discounts.forEach((d) => {
      if (counts[d.app as DeliveryApp] !== undefined) {
        counts[d.app as DeliveryApp]++;
      }
    });
    return counts;
  }, [discounts]);

  // Handle Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === currentAdminPassword) {
      setIsAdmin(true);
      setShowAdminLoginModal(false);
      setAdminPassword('');
      setPasswordError(false);
      setShowLoginPwdText(false);
      showToast('🔑 관리자로 로그인되었습니다.');
    } else {
      setPasswordError(true);
    }
  };

  // Handle Admin Change Password Submit
  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (changeCurrentPwd !== currentAdminPassword) {
      setChangePwdError('현재 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!changeNewPwd || changeNewPwd.trim().length < 2) {
      setChangePwdError('새 비밀번호는 최소 2자리 이상 입력해 주세요.');
      return;
    }
    if (changeNewPwd !== changeNewPwdConfirm) {
      setChangePwdError('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    const newPassword = changeNewPwd.trim();
    setCurrentAdminPassword(newPassword);
    try {
      localStorage.setItem('delivery_compass_admin_pwd', newPassword);
      if (typeof document !== 'undefined') {
        document.cookie = `delivery_admin_pwd=${encodeURIComponent(newPassword)}; path=/; max-age=315360000; SameSite=Lax`;
      }
    } catch (e) {
      console.error('Failed to save admin password to storage', e);
    }
    setShowChangePasswordModal(false);
    setChangeCurrentPwd('');
    setChangeNewPwd('');
    setChangeNewPwdConfirm('');
    setChangePwdError('');
    showToast('🔐 비밀번호가 성공적으로 변경되었습니다!');
  };

  // Call Server-side Gemini API for discount parsing
  const handleAiParseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInputText.trim()) return;
    setIsParsingAi(true);
    setAiParseResult(null);

    try {
      const res = await fetch('/api/parse-discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: aiInputText }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setAiParseResult(data.data);
        showToast(`🤖 Gemini AI가 ${data.data.length}개의 할인을 추출했습니다!`);
      } else {
        showToast(`⚠️ 정제 실패: ${data.error || '알 수 없는 오류'}`);
      }
    } catch (err: any) {
      showToast(`⚠️ 오류 발생: ${err.message}`);
    } finally {
      setIsParsingAi(false);
    }
  };

  // Apply parsed discounts directly to state
  const handleApplyAiParsedDiscounts = () => {
    if (!aiParseResult || aiParseResult.length === 0) return;
    const newItems: DiscountItem[] = aiParseResult.map((item, idx) => ({
      id: `ai-${Date.now()}-${idx}`,
      app: (['배민', '쿠팡이츠', '요기요', '땡겨요'].includes(item.platform)
        ? item.platform
        : '배민') as any,
      brand: item.brand,
      brand_id: (item as any).brand_id || item.brand.toUpperCase().replace(/[^A-Z]/g, ''),
      discount: item.discount,
      validity: item.duration,
      minOrder: item.condition,
      category: item.category,
      card_discount: (item as any).card_discount || '없음',
      affiliate_link: (item as any).affiliate_link || 'https://m.baemin.com',
      is_top_ranked: (item as any).is_top_ranked ?? (idx < 3),
      createdAt: Date.now(),
    }));

    setDiscounts((prev) => [...newItems, ...prev]);
    setShowAiParseModal(false);
    setAiParseResult(null);
    setAiInputText('');
    showToast(`🎉 ${newItems.length}개의 할인 정보가 성공적으로 등록되었습니다!`);
  };

  // Open Register Form (New or Edit)
  const openRegisterModal = (itemToEdit?: DiscountItem) => {
    if (itemToEdit) {
      setEditingItem(itemToEdit);
      setFormApp(itemToEdit.app);
      setFormBrand(itemToEdit.brand);
      setFormDiscount(itemToEdit.discount);
      setFormValidity(itemToEdit.validity || '오늘 하루만 유효');
      setFormMinOrder(itemToEdit.minOrder || '15,000원 이상');
      setFormCategory(itemToEdit.category || '치킨');
      setFormCouponCode(itemToEdit.couponCode || '');
      setFormLinkNote(itemToEdit.linkNote || '');
    } else {
      setEditingItem(null);
      setFormApp('배민');
      setFormBrand('');
      setFormDiscount('');
      setFormValidity('오늘 하루만 유효');
      setFormMinOrder('15,000원 이상');
      setFormCategory('치킨');
      setFormCouponCode('');
      setFormLinkNote('');
    }
    setShowRegisterModal(true);
  };

  // Handle Form Submission (Add / Update)
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBrand.trim() || !formDiscount.trim()) {
      showToast('⚠️ 브랜드명과 할인 금액을 입력해 주세요.');
      return;
    }

    if (editingItem) {
      // Update existing item
      setDiscounts((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                app: formApp,
                brand: formBrand.trim(),
                discount: formDiscount.trim(),
                validity: formValidity.trim() || '오늘 하루만 유효',
                minOrder: formMinOrder.trim(),
                category: formCategory,
                couponCode: formCouponCode.trim(),
                linkNote: formLinkNote.trim(),
              }
            : item
        )
      );
      showToast(`✏️ '${formBrand}' 할인 정보가 수정되었습니다.`);
    } else {
      // Add new item to JS Array
      const newItem: DiscountItem = {
        id: Date.now().toString(),
        app: formApp,
        brand: formBrand.trim(),
        discount: formDiscount.trim(),
        validity: formValidity.trim() || '오늘 하루만 유효',
        minOrder: formMinOrder.trim(),
        category: formCategory,
        couponCode: formCouponCode.trim(),
        linkNote: formLinkNote.trim(),
        createdAt: Date.now(),
      };
      setDiscounts((prev) => [newItem, ...prev]);
      showToast(`✨ 새로운 할인 정보가 추가되었습니다!`);
    }

    setShowRegisterModal(false);
  };

  // Handle Delete Item
  const handleDeleteItem = (id: string, brand: string) => {
    if (window.confirm(`'${brand}' 할인 카드를 삭제하시겠습니까?`)) {
      setDiscounts((prev) => prev.filter((d) => d.id !== id));
      showToast('🗑️ 카드가 삭제되었습니다.');
    }
  };

  // Reset to sample data
  const handleResetData = () => {
    if (window.confirm('초기 할인 데이터 세트로 복원하시겠습니까?')) {
      setDiscounts(INITIAL_DISCOUNTS);
      showToast('🔄 초기 데이터로 복원되었습니다.');
    }
  };

  // Copy coupon code
  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`📋 쿠폰코드 '${code}' 복사 완료!`);
  };

  // Launch App handler with Deep Linking & Store Fallback (PC & Mobile Support)
  const handleLaunchApp = (item: DiscountItem) => {
    const config = APP_THEMES[item.app as keyof typeof APP_THEMES] || APP_THEMES['배민'];
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iphone|ipad|ipod/i.test(userAgent);
    const isMobile = isAndroid || isIOS;

    const customAffiliate = affiliateUrls[item.app];
    const affiliateTarget = customAffiliate || item.affiliate_link;
    const fallbackUrl = affiliateTarget || config.webUrl;

    if (item.couponCode) {
      navigator.clipboard.writeText(item.couponCode);
      showToast(`📋 쿠폰코드 '${item.couponCode}' 복사 완료! ${isMobile ? `${config.name} 앱 실행 중...` : 'PC 웹 제휴 수익 링크로 이동합니다.'}`);
    } else {
      showToast(isMobile ? `🚀 ${config.name} 모바일 앱으로 이동 중...` : `💻 ${config.name} PC 웹사이트/제휴 수익 링크로 이동 중...`);
    }

    // 1. Android Deep Link via Intent (opens app if installed; falls back to Affiliate Link / Play Store)
    if (isAndroid) {
      const schemeClean = config.scheme.replace('://', '');
      const storeFallback = affiliateTarget || config.playStoreUrl;
      const intentUrl = `intent://main#Intent;scheme=${schemeClean};package=${config.packageName};S.browser_fallback_url=${encodeURIComponent(storeFallback)};end;`;
      window.location.href = intentUrl;
      return;
    }

    // 2. iOS Deep Link with Timeout Fallback to App Store / Affiliate Link
    if (isIOS) {
      const startTime = Date.now();
      let hasPageHidden = false;

      const handleVisibilityChange = () => {
        if (document.hidden) {
          hasPageHidden = true;
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange, { once: true });
      window.addEventListener('pagehide', () => { hasPageHidden = true; }, { once: true });

      // Attempt launching app via URI scheme
      window.location.href = config.scheme;

      setTimeout(() => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        // If app wasn't launched (browser remained visible), fallback to Affiliate Link or App Store
        if (!hasPageHidden && (Date.now() - startTime < 2500)) {
          window.location.href = affiliateTarget || config.appStoreUrl;
        }
      }, 1500);
      return;
    }

    // 3. PC (Desktop) / Non-mobile Web Browser -> Open Official Web / Affiliate Link in New Tab
    setTimeout(() => {
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    }, 400);
  };

  const categories = ['전체', '치킨', '피자', '버거', '분식/야식', '카페/디저트', '한식/기타'];

  return (
    <div className="min-h-screen max-w-md mx-auto bg-slate-50 flex flex-col justify-between shadow-2xl relative overflow-hidden font-sans border-x border-slate-200/60">
      {/* Toast Notification Floating Alert */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-full shadow-lg backdrop-blur-md transition-all animate-bounce flex items-center space-x-2 border border-slate-700">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ADMIN STATUS BANNER (When Logged in) */}
      {isAdmin && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between sticky top-0 z-40 shadow-sm border-b border-amber-600">
          <div className="flex items-center space-x-1.5">
            <Unlock className="w-3.5 h-3.5" />
            <span>관리자 모드 실행 중</span>
          </div>
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <button
              onClick={() => setShowAffiliateModal(true)}
              className="bg-slate-900 hover:bg-slate-800 text-amber-300 px-2 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1 transition-colors shadow-2xs"
            >
              <LinkIcon className="w-3 h-3 text-amber-400" />
              <span>💰 수익 제휴링크 설정</span>
            </button>
            <button
              onClick={() => {
                setShowChangePasswordModal(true);
                setChangeCurrentPwd('');
                setChangeNewPwd('');
                setChangeNewPwdConfirm('');
                setChangePwdError('');
              }}
              className="bg-amber-600 hover:bg-amber-700 text-slate-950 px-2 py-1 rounded-lg text-[11px] font-semibold flex items-center space-x-1 transition-colors"
            >
              <Key className="w-3 h-3" />
              <span>암호변경</span>
            </button>
            <button
              onClick={() => openRegisterModal()}
              className="bg-slate-900 text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center space-x-1 active:scale-95 transition-transform"
            >
              <Plus className="w-3 h-3" />
              <span>등록</span>
            </button>
            <button
              onClick={() => {
                setIsAdmin(false);
                showToast('로그아웃되었습니다.');
              }}
              className="text-slate-900 underline text-[11px] hover:text-slate-950"
            >
              로그아웃
            </button>
          </div>
        </div>
      )}

      {/* HEADER SECTION (Toss Style Minimal White Canvas Header) */}
      <header className="bg-white px-5 pt-4 pb-4 border-b border-slate-100 sticky top-0 z-30 shadow-xs">
        {/* Top Quick Actions Bar (홈화면에 추가, 관심음식 알림, 공유하기 버튼) */}
        <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100/80 gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={handleAddToHomeScreen}
            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-xl flex items-center space-x-1 transition-all active:scale-95 border border-blue-200/60 shadow-2xs shrink-0"
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-600" />
            <span>홈화면 추가</span>
          </button>

          <button
            onClick={() => setShowFoodAlertModal(true)}
            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-xl flex items-center space-x-1 transition-all active:scale-95 border border-amber-200/80 shadow-2xs shrink-0 relative"
          >
            <Bell className="w-3.5 h-3.5 text-amber-600" />
            <span>🔔 관심음식 알림</span>
            {favoriteKeywords.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 absolute -top-0.5 -right-0.5 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={handleShare}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1 transition-all active:scale-95 shadow-2xs shrink-0"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-600" />
            <span>공유하기</span>
          </button>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center space-x-1.5 text-xs text-blue-600 font-bold tracking-tight">
              <Compass className="w-4 h-4 animate-spin-slow text-blue-600" />
              <span>실시간 배달 할인 나침반</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-600 font-semibold border border-emerald-200">
                LIVE
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              오늘의 배달 할인
            </h1>
          </div>

          <div className="text-right flex flex-col items-end space-y-1">
            <button
              onClick={() => fetchLiveDiscounts(false)}
              disabled={isRefreshingLive}
              className="text-[10px] font-extrabold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg border border-blue-200/80 flex items-center space-x-1 transition-all active:scale-95 shadow-2xs"
            >
              <RefreshCw className={`w-3 h-3 text-blue-600 ${isRefreshingLive ? 'animate-spin' : ''}`} />
              <span>{isRefreshingLive ? '동기화 중...' : '실시간 연동'}</span>
            </button>
            <div className="text-[10px] text-slate-400 font-medium flex items-center space-x-1">
              <Clock className="w-2.5 h-2.5 text-slate-400" />
              <span>{lastUpdatedTime ? `최신 갱신: ${lastUpdatedTime}` : new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Location Selector Bar (GPS & Custom Address) */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-xl p-2.5 mb-3 flex items-center justify-between shadow-2xs">
          <div className="flex items-center space-x-2 min-w-0 pr-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Compass className="w-4 h-4 animate-spin-slow" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-blue-600 font-extrabold tracking-tight flex items-center space-x-1">
                <span>📍 내 주변 배달 설정 지역</span>
              </div>
              <div className="text-xs font-black text-slate-800 truncate">
                {userAddress}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setAddressInputText(userAddress);
              setShowAddressModal(true);
            }}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-blue-600 border border-blue-200/80 text-[11px] font-bold rounded-lg shrink-0 active:scale-95 transition-all shadow-2xs"
          >
            주소 변경
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="브랜드명, 카테고리 (예: BBQ, 버거, 치킨)"
            className="w-full pl-9 pr-8 py-2.5 bg-slate-100/80 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Delivery App Filter Tabs (전국 공통 & 지역 특화 배달앱) */}
        <div className="flex space-x-1.5 overflow-x-auto no-scrollbar py-1">
          {(['전체', '배민', '쿠팡이츠', '요기요', '땡겨요', '먹깨비', '두잇', '배달특급', '대구로', '동백통'] as DeliveryApp[]).map((app) => {
            const isSelected = selectedApp === app;
            const count = appCounts[app] || 0;
            const theme = APP_THEMES[app as keyof typeof APP_THEMES];
            let activeStyle = 'bg-slate-900 text-white font-bold shadow-xs';
            
            if (isSelected && theme) {
              activeStyle = `${theme.badgeBg} text-white font-bold shadow-xs`;
            }

            return (
              <button
                key={app}
                onClick={() => setSelectedApp(app)}
                className={`px-3.5 py-2 rounded-xl text-xs transition-all whitespace-nowrap flex items-center space-x-1.5 shrink-0 active:scale-95 ${
                  isSelected
                    ? activeStyle
                    : 'bg-slate-100 text-slate-600 font-medium hover:bg-slate-200/80'
                }`}
              >
                <span>{app}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category Filter Chips */}
        <div className="flex space-x-1 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100/80 mt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-blue-50 text-blue-600 font-bold border border-blue-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
        {/* [TOP DELIVERY APP ROLLING BANNER & ACCORDION / TAB DRAWER] */}
        <DeliveryAppRollingBanner
          selectedAppFilter={selectedApp !== '전체' ? selectedApp : undefined}
          onSelectAppFilter={(appId) => {
            setSelectedApp(appId as DeliveryApp);
          }}
        />

        {/* [TOP AD BANNER AREA - Google AdSense / Kakao AdFit] */}
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-2.5 text-center flex flex-col items-center justify-center text-slate-400 text-xs">
          <p className="font-bold text-[11px] text-slate-400">📢 ADVERTISE BANNER AREA (상단 광고 배너)</p>
          <p className="text-[10px] text-slate-300">구글 애드센스 / 카카오 애드핏 디스플레이 광고 코드 영역</p>
        </div>

        {/* Total Count & Filter Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <div>
            총 <span className="font-bold text-slate-900">{filteredDiscounts.length}</span>개의 할인
            {selectedApp !== '전체' && (
              <span className="ml-1 text-blue-600 font-semibold">[{selectedApp}]</span>
            )}
            {selectedCategory !== '전체' && (
              <span className="ml-1 text-slate-700">({selectedCategory})</span>
            )}
          </div>
          {isAdmin && (
            <button
              onClick={() => openRegisterModal()}
              className="text-blue-600 font-bold flex items-center space-x-1 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>할인 직접 등록</span>
            </button>
          )}
        </div>

        {/* TOP 3 RANKED BANNER SECTION */}
        {filteredDiscounts.some((item) => item.is_top_ranked) && (
          <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 rounded-2xl p-3.5 text-white shadow-md border border-amber-300 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="font-black text-xs uppercase tracking-wider flex items-center space-x-1">
                <span>🔥 오늘만 역대급 할인 TOP 3!</span>
              </span>
              <span className="text-[10px] bg-black/20 backdrop-blur-xs px-2 py-0.5 rounded-full font-bold">
                AI 랭킹 자동 선정
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {filteredDiscounts
                .filter((item) => item.is_top_ranked)
                .slice(0, 3)
                .map((topItem, index) => (
                  <div
                    key={topItem.id}
                    onClick={() => handleLaunchApp(topItem)}
                    className="bg-white/95 text-slate-900 rounded-xl p-2.5 flex items-center justify-between cursor-pointer hover:bg-white transition-all active:scale-98 shadow-xs"
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-extrabold text-[11px] flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <div className="truncate">
                        <p className="font-bold text-xs truncate">{topItem.brand}</p>
                        <p className="text-[10px] text-amber-700 font-extrabold">{topItem.discount}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded-lg shrink-0 flex items-center">
                      <span>앱으로 이동</span>
                      <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Discount Card List (Requirement #2) */}
        {filteredDiscounts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-xs my-6">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">해당 조건의 할인이 없습니다.</p>
            <p className="text-xs text-slate-400 mt-1">
              다른 탭을 선택하거나 검색어를 변경해 보세요.
            </p>
            {isAdmin && (
              <button
                onClick={() => openRegisterModal()}
                className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-all inline-flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>새 할인 등록하기</span>
              </button>
            )}
          </div>
        ) : (
          filteredDiscounts.map((item) => {
            const theme = APP_THEMES[item.app];

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:shadow-md transition-all relative overflow-hidden group"
              >
                {/* Delivery App Color Accent Strip (Requirement #2: 배달 앱 로고 색상의 띠) */}
                <div
                  className={`absolute top-0 left-0 bottom-0 w-1.5 ${theme.badgeBg}`}
                />

                <div className="pl-2.5">
                  {/* Top Bar: App Badge & Category Tag & Admin Actions */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${theme.badgeBg} ${theme.badgeText}`}
                      >
                        {item.app}
                      </span>

                      {item.category && (
                        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {item.category}
                        </span>
                      )}

                      {item.minOrder && (
                        <span className="text-[11px] text-slate-400 hidden sm:inline-block">
                          {item.minOrder}
                        </span>
                      )}
                    </div>

                    {/* Admin Action Buttons on Card */}
                    {isAdmin && (
                      <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg">
                        <button
                          onClick={() => openRegisterModal(item)}
                          className="p-1 text-slate-600 hover:text-blue-600 hover:bg-white rounded transition-colors"
                          title="수정"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id, item.brand)}
                          className="p-1 text-slate-600 hover:text-red-600 hover:bg-white rounded transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Main Info: Brand & Discount Amount & Button */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Brand Name & brand_id tag */}
                      <div className="flex items-center space-x-1.5">
                        <h3 className="text-base font-extrabold text-slate-900 truncate tracking-tight">
                          {item.brand}
                        </h3>
                        {item.brand_id && (
                          <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                            {item.brand_id}
                          </span>
                        )}
                      </div>

                      {/* Discount Amount (Highlight) */}
                      <div className="text-lg font-black text-slate-900 mt-0.5 tracking-tight flex items-baseline space-x-1">
                        <span className="text-red-500">{item.discount}</span>
                      </div>

                      {/* Card / Payment Extra Discount (🔥 혜택 더하기) */}
                      {item.card_discount && item.card_discount !== '없음' && (
                        <div className="mt-1.5 bg-blue-50/90 border border-blue-200/80 rounded-xl px-2.5 py-1 text-[11px] text-blue-700 font-bold flex items-center space-x-1 w-fit">
                          <span>🔥 혜택 더하기: {item.card_discount}</span>
                        </div>
                      )}

                      {/* Validity text + Condition Tag */}
                      <div className="flex items-center space-x-2 mt-1.5">
                        <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                          <Check className="w-3 h-3 mr-0.5 text-emerald-600" />
                          {item.validity || '오늘 하루만 유효'}
                        </span>
                        {item.minOrder && (
                          <span className="text-[11px] text-slate-400 truncate">
                            ({item.minOrder})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Action Button */}
                    <div className="flex flex-col items-end justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLaunchApp(item);
                        }}
                        className={`px-3.5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-xs active:scale-95 flex items-center space-x-0.5 shrink-0 ${theme.btnBg}`}
                      >
                        <span>앱으로 이동</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Quick Admin Action or Reset if data modified */}
        {isAdmin && (
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 text-center my-4 space-y-2">
            <p className="text-xs text-amber-800 font-extrabold flex items-center justify-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>관리자 전용 제어 도구</span>
            </p>
            <div className="flex flex-wrap justify-center gap-1.5">
              <button
                onClick={() => openRegisterModal()}
                className="px-2.5 py-1.5 bg-amber-600 text-white text-[11px] font-bold rounded-lg shadow-xs active:scale-95"
              >
                + 수동 등록
              </button>

              <button
                onClick={() => {
                  setShowAiParseModal(true);
                  setAiParseResult(null);
                  setAiInputText('');
                }}
                className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg shadow-xs active:scale-95 flex items-center space-x-1"
              >
                <Bot className="w-3 h-3" />
                <span>AI 파싱 정제</span>
              </button>

              <button
                onClick={() => setShowVercelGuideModal(true)}
                className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg shadow-xs active:scale-95 flex items-center space-x-1"
              >
                <Code className="w-3 h-3" />
                <span>Vercel 자동화 백엔드</span>
              </button>

              <button
                onClick={() => {
                  setShowChangePasswordModal(true);
                  setChangeCurrentPwd('');
                  setChangeNewPwd('');
                  setChangeNewPwdConfirm('');
                  setChangePwdError('');
                }}
                className="px-2.5 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg shadow-xs hover:bg-slate-800 flex items-center space-x-1"
              >
                <Key className="w-3 h-3" />
                <span>암호 변경</span>
              </button>

              <button
                onClick={handleResetData}
                className="px-2.5 py-1.5 bg-white text-slate-700 border border-slate-300 text-[11px] font-medium rounded-lg hover:bg-slate-50"
              >
                초기화
              </button>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER & SECRET ADMIN BUTTON (Requirement #3 & AdSense Legal Footer) */}
      <footer className="bg-white px-4 py-6 border-t border-slate-100 text-center text-slate-400 text-xs space-y-3">
        {/* [BOTTOM FIXED / INLINE AD BANNER AREA] */}
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-2.5 text-center min-h-[60px] flex flex-col items-center justify-center text-slate-400 text-xs my-2">
          {/* <!-- Kakao AdFit / Google AdSense Inline Banner Code Here --> */}
          <p className="font-bold text-[10px] text-slate-400">📢 FOOTER AD AREA (하단 광고 영역)</p>
        </div>

        <div className="space-y-1">
          <p className="font-semibold text-slate-600">오늘의 배달 할인 나침반 🧭</p>
          <p className="text-[11px] text-slate-400">
            배민 · 쿠팡이츠 · 요기요 · 땡겨요 주요 할인 정보를 한눈에 비교하세요.
          </p>
        </div>

        {/* Legal & FTC Disclosures for AdSense Approval */}
        <div className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-100 pt-3 space-y-1">
          <p>본 사이트는 회원가입 없이 브라우저 로컬 저장소(LocalStorage)를 활용한 무회원 서비스로 운영됩니다.</p>
          <p className="text-slate-500">
            ※ 제휴 마케팅 링크를 통해 구매가 이루어질 경우 파트너스 활동의 일환으로 일정액의 수수료를 제공받습니다.
          </p>
          <div className="flex justify-center space-x-3 pt-1 text-slate-500 font-medium">
            <span className="hover:underline cursor-pointer">개인정보처리방침</span>
            <span>|</span>
            <span className="hover:underline cursor-pointer">이메일무단수집거부</span>
            <span>|</span>
            <span className="hover:underline cursor-pointer">이용약관</span>
          </div>
          <p className="text-[9px] text-slate-300 pt-1">© 2026 Delivery Coupon Compass. All rights reserved.</p>
        </div>

        {/* Small Hidden Admin Login Button at Very Bottom */}
        <div className="pt-2 border-t border-slate-100/60">
          {!isAdmin ? (
            <button
              onClick={() => {
                setShowAdminLoginModal(true);
                setPasswordError(false);
                setAdminPassword('');
                setShowLoginPwdText(false);
              }}
              className="text-[10px] text-slate-300 hover:text-slate-500 transition-colors underline cursor-pointer p-1"
            >
              [관리자 로그인]
            </button>
          ) : (
            <div className="flex items-center justify-center space-x-2 text-[11px] text-amber-600 font-semibold">
              <Unlock className="w-3 h-3" />
              <span>관리자 접속 중</span>
              <button
                onClick={() => {
                  setShowChangePasswordModal(true);
                  setChangeCurrentPwd('');
                  setChangeNewPwd('');
                  setChangeNewPwdConfirm('');
                  setChangePwdError('');
                }}
                className="text-amber-700 underline hover:text-amber-900 ml-1 cursor-pointer"
              >
                [비밀번호 변경]
              </button>
              <button
                onClick={() => {
                  setIsAdmin(false);
                  showToast('로그아웃되었습니다.');
                }}
                className="text-slate-400 underline hover:text-slate-600 ml-1 cursor-pointer"
              >
                [로그아웃]
              </button>
            </div>
          )}
        </div>
      </footer>

      {/* MODAL 1: ADMIN LOGIN MODAL */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xs rounded-2xl p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowAdminLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">관리자 인증</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                할인 정보 입력을 위해 비밀번호를 입력하세요.
              </p>
              <p className="text-[10px] text-slate-400 mt-1 bg-slate-50 py-1 px-2 rounded-lg border border-slate-100">
                🔒 변경하신 비밀번호는 이 디바이스(브라우저/쿠키)에 영구 저장됩니다.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-3">
              <div className="relative">
                <input
                  type={showLoginPwdText ? 'text' : 'password'}
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    setPasswordError(false);
                  }}
                  placeholder="비밀번호 입력"
                  autoFocus
                  className={`w-full pl-3.5 pr-10 py-2.5 bg-slate-50 rounded-xl text-center text-sm font-extrabold text-slate-900 border ${
                    passwordError ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPwdText((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  title={showLoginPwdText ? '비밀번호 숨기기' : '비밀번호 보기'}
                >
                  {showLoginPwdText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {passwordError && (
                <p className="text-[11px] text-red-500 text-center font-medium">
                  비밀번호가 올바르지 않습니다.
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all active:scale-95"
              >
                확인
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADMIN DISCOUNT REGISTER / EDIT FORM MODAL */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {editingItem ? '할인 정보 수정' : '새 할인 정보 등록'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    폰에서 입력 즉시 메인 화면에 반영됩니다.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              {/* 항목 1: 배달앱 선택 (드롭다운) */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  1. 배달앱 선택 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formApp}
                  onChange={(e) => setFormApp(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="배민">배달의민족 (배민)</option>
                  <option value="쿠팡이츠">쿠팡이츠</option>
                  <option value="요기요">요기요</option>
                  <option value="땡겨요">땡겨요</option>
                </select>
              </div>

              {/* 항목 2: 브랜드명 입력 */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  2. 브랜드명 입력 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formBrand}
                  onChange={(e) => setFormBrand(e.target.value)}
                  placeholder="예: BBQ 치킨, 굽네치킨, 맘스터치"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 항목 3: 할인금액 입력 */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  3. 할인금액 입력 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formDiscount}
                  onChange={(e) => setFormDiscount(e.target.value)}
                  placeholder="예: 4,000원 할인, 최대 7,000원 할인"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 카테고리 선택 */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    카테고리
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="치킨">치킨 🍗</option>
                    <option value="피자">피자 🍕</option>
                    <option value="버거">버거 🍔</option>
                    <option value="분식/야식">분식/야식 떡볶이</option>
                    <option value="카페/디저트">카페/디저트 ☕</option>
                    <option value="한식/기타">한식/기타 🍲</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    최소 주문금액
                  </label>
                  <input
                    type="text"
                    value={formMinOrder}
                    onChange={(e) => setFormMinOrder(e.target.value)}
                    placeholder="예: 16,000원 이상"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 유효 기간 텍스트 */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  유효 조건
                </label>
                <input
                  type="text"
                  value={formValidity}
                  onChange={(e) => setFormValidity(e.target.value)}
                  placeholder="예: 오늘 하루만 유효, 주말 한정"
                  className="w-full px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 쿠폰 코드 (선택) */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  쿠폰 코드 (선택)
                </label>
                <input
                  type="text"
                  value={formCouponCode}
                  onChange={(e) => setFormCouponCode(e.target.value)}
                  placeholder="예: BBQJULY07"
                  className="w-full px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 참고 메모/이용 안내 */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  이용 팁/설명
                </label>
                <textarea
                  value={formLinkNote}
                  onChange={(e) => setFormLinkNote(e.target.value)}
                  rows={2}
                  placeholder="예: 앱 메인 브랜드관에서 쿠폰 받아 적용"
                  className="w-full px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 등록/수정 제출 버튼 */}
              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md transition-all active:scale-95"
                >
                  {editingItem ? '수정 저장' : '등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ITEM ACTION MODAL ("앱으로 이동" 클릭 시 팝업) */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          {(() => {
            const theme = APP_THEMES[activeModalItem.app];
            return (
              <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-slate-100 animate-in slide-in-from-bottom duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${theme.badgeBg} ${theme.badgeText}`}
                  >
                    {activeModalItem.app} 전용 혜택
                  </span>
                  <button
                    onClick={() => setActiveModalItem(null)}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-center py-2">
                  <h3 className="text-xl font-black text-slate-900">
                    {activeModalItem.brand}
                  </h3>
                  <div className="text-2xl font-black text-red-500 mt-1">
                    {activeModalItem.discount}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {activeModalItem.validity} · {activeModalItem.minOrder || '최소주문금액 확인'}
                  </p>
                </div>

                {/* Coupon Code Section */}
                {activeModalItem.couponCode && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 my-3 text-center">
                    <div className="text-[11px] text-slate-400 font-medium mb-1">
                      쿠폰 코드
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="font-mono font-bold text-base text-slate-900">
                        {activeModalItem.couponCode}
                      </span>
                      <button
                        onClick={() => handleCopyCoupon(activeModalItem.couponCode!)}
                        className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center space-x-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>복사</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Note / Tip */}
                {activeModalItem.linkNote && (
                  <div className="bg-blue-50/70 p-3 rounded-xl text-xs text-blue-900 mb-4 flex items-start space-x-2">
                    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{activeModalItem.linkNote}</span>
                  </div>
                )}

                {/* Launch Button */}
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      handleLaunchApp(activeModalItem);
                      setActiveModalItem(null);
                    }}
                    className={`w-full py-3.5 rounded-xl font-bold text-white shadow-md flex items-center justify-center space-x-1.5 active:scale-95 transition-transform ${theme.btnBg}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{theme.name} 앱 바로가기</span>
                  </button>

                  <button
                    onClick={() => setActiveModalItem(null)}
                    className="w-full py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-200"
                  >
                    닫기
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* MODAL 4: HOME SCREEN INSTALL GUIDE MODAL */}
      {showInstallGuideModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-slate-100 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  📱 홈 화면에 앱 바로 생성하기
                </h3>
              </div>
              <button
                onClick={() => setShowInstallGuideModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 py-1">
              {/* In-App Browser Notice */}
              {typeof navigator !== 'undefined' && /kakaotalk|naver|line|inapp/i.test(navigator.userAgent) && (
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
                  <p className="font-bold flex items-center space-x-1">
                    <span>⚠️ 인앱 브라우저(카카오톡/네이버) 이용 중 안내:</span>
                  </p>
                  <p>
                    앱 내부 브라우저에서는 홈 화면 추가가 바로 안 될 수 있습니다. 상단 또는 하단 메뉴에서 <strong>[다른 브라우저로 열기 (Chrome 또는 Safari)]</strong>를 선택하신 후 홈 화면에 추가해 주세요!
                  </p>
                </div>
              )}

              <p className="text-slate-600 font-medium leading-relaxed">
                스마트폰 홈 화면에 아이콘을 생성해 두시면 앱처럼 단 한 번의 터치로 실시간 배달 할인을 확인하실 수 있습니다.
              </p>

              {/* Android Chrome Guide */}
              <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/80 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-extrabold">
                      Android
                    </span>
                    <span className="text-emerald-950 font-bold">안드로이드 (Chrome)</span>
                  </div>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-700 text-[11px] pl-1">
                  <li>브라우저 우측 상단 <strong>'더보기(⋮)'</strong> 메뉴 클릭</li>
                  <li><strong>'앱 설치'</strong> 또는 <strong>'홈 화면에 추가'</strong> 선택</li>
                  <li>팝업 창에서 <strong>'추가'</strong> 누르면 바탕화면에 생성!</li>
                </ol>
              </div>

              {/* iPhone Safari Guide */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-extrabold">
                    iOS
                  </span>
                  <span>아이폰 (Safari)</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] pl-1">
                  <li>사파리 하단 중앙 <strong>'공유(Square + Arrow)'</strong> 버튼 클릭</li>
                  <li>메뉴 중 <strong>'홈 화면에 추가'</strong> 선택</li>
                  <li>우측 상단 <strong>'추가'</strong> 누르면 아이콘 생성 완료!</li>
                </ol>
              </div>
            </div>

            <div className="pt-3 flex space-x-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showToast('🔗 사이트 주소가 복사되었습니다! 브라우저 주소창에 붙여넣어 보세요.');
                }}
                className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all text-xs flex items-center justify-center space-x-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>주소 복사하기</span>
              </button>
              <button
                onClick={() => setShowInstallGuideModal(false)}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all text-xs active:scale-95 shadow-xs"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: CHANGE PASSWORD MODAL */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowChangePasswordModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-4 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  관리자 비밀번호 변경
                </h3>
                <p className="text-[11px] text-slate-400">
                  새 비밀번호로 안전하게 업데이트합니다. (브라우저 &amp; 쿠키 영구 저장)
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3 text-xs">
              {/* 1. Current Password */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  현재 비밀번호
                </label>
                <div className="relative">
                  <input
                    type={showChangePwdText ? 'text' : 'password'}
                    value={changeCurrentPwd}
                    onChange={(e) => {
                      setChangeCurrentPwd(e.target.value);
                      setChangePwdError('');
                    }}
                    placeholder="현재 비밀번호 입력"
                    required
                    className="w-full pl-3.5 pr-9 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 2. New Password */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  새 비밀번호
                </label>
                <div className="relative">
                  <input
                    type={showChangePwdText ? 'text' : 'password'}
                    value={changeNewPwd}
                    onChange={(e) => {
                      setChangeNewPwd(e.target.value);
                      setChangePwdError('');
                    }}
                    placeholder="새 비밀번호 입력"
                    required
                    className="w-full pl-3.5 pr-9 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowChangePwdText((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    title={showChangePwdText ? '비밀번호 숨기기' : '비밀번호 보기'}
                  >
                    {showChangePwdText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 3. Confirm New Password */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  새 비밀번호 확인
                </label>
                <div className="relative">
                  <input
                    type={showChangePwdText ? 'text' : 'password'}
                    value={changeNewPwdConfirm}
                    onChange={(e) => {
                      setChangeNewPwdConfirm(e.target.value);
                      setChangePwdError('');
                    }}
                    placeholder="새 비밀번호 재입력"
                    required
                    className="w-full pl-3.5 pr-9 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Error Alert */}
              {changePwdError && (
                <p className="text-[11px] text-red-500 font-semibold text-center bg-red-50 py-1.5 px-2 rounded-lg border border-red-200">
                  {changePwdError}
                </p>
              )}

              {/* Submit / Cancel Buttons */}
              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowChangePasswordModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all text-xs"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-xs active:scale-95 shadow-xs"
                >
                  비밀번호 변경
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: GEMINI AI AUTO-PARSE MODAL */}
      {showAiParseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAiParseModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-1.5">
                  <span>Gemini AI 할인 자동 추출</span>
                  <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    3.6 Flash
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  커뮤니티 글, 블로그, 이벤트를 복사해 넣으면 규격에 맞춰 정제합니다.
                </p>
              </div>
            </div>

            <form onSubmit={handleAiParseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  할인 정보 원문 텍스트 (또는 URL 입력)
                </label>
                <textarea
                  value={aiInputText}
                  onChange={(e) => setAiInputText(e.target.value)}
                  placeholder={`예시: 오늘 배민에서 BBQ 치킨 4천원 할인 쿠폰 18,000원 이상 구매시 지급! 버거킹은 쿠팡이츠에서 5천원 세일 중.`}
                  rows={4}
                  required
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isParsingAi}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all text-xs active:scale-95 shadow-xs flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isParsingAi ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gemini AI 분석 및 정제 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Gemini AI로 정제하기</span>
                  </>
                )}
              </button>
            </form>

            {/* AI Extraction Result Preview */}
            {aiParseResult && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-xs flex items-center space-x-1">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>정제된 데이터 ({aiParseResult.length}건)</span>
                  </h4>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(aiParseResult, null, 2));
                      showToast('📋 JSON 데이터가 복사되었습니다!');
                    }}
                    className="text-[11px] text-blue-600 hover:underline flex items-center space-x-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>JSON 복사</span>
                  </button>
                </div>

                <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-[10px] overflow-x-auto max-h-48 border border-slate-800">
                  <pre>{JSON.stringify(aiParseResult, null, 2)}</pre>
                </div>

                <button
                  onClick={handleApplyAiParsedDiscounts}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs active:scale-95 shadow-xs transition-colors"
                >
                  📥 현재 사이트에 일괄 등록하기
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 7: VERCEL BACKEND CODE & CRON GUIDE MODAL */}
      {showVercelGuideModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-5 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowVercelGuideModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Vercel 자동화 백엔드 코드 &amp; 크론탭 연동
                </h3>
                <p className="text-[11px] text-slate-400">
                  Google IDX / Vercel에 추가할 Serverless 자동화 파일 코드
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              {/* File 1: api/cron.js */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span className="flex items-center space-x-1">
                    <FileJson className="w-3.5 h-3.5 text-indigo-600" />
                    <span>1. api/cron.js (Vercel Serverless Function)</span>
                  </span>
                  <button
                    onClick={() => {
                      const code = `import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req, res) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // 1. 크롤링 대상 소스 또는 커뮤니티 API 호출 (예시)
    const rawContent = "배민 BBQ 4천원 할인, 쿠팡이츠 버거킹 5천원 할인, 요기요 도미노피자 7천원 쿠폰";

    // 2. Gemini 3.6 Flash 모델을 이용한 정규화 JSON 정제
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: \`다음 배달 할인 정보를 주어진 규격 JSON 배열로만 정제해줘: \${rawContent}\`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              platform: { type: Type.STRING },
              category: { type: Type.STRING },
              brand: { type: Type.STRING },
              discount: { type: Type.STRING },
              condition: { type: Type.STRING },
              duration: { type: Type.STRING }
            },
            required: ["platform", "category", "brand", "discount", "condition", "duration"]
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text || "[]");
    return res.status(200).json(parsedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}`;
                      navigator.clipboard.writeText(code);
                      showToast('📋 api/cron.js 코드가 복사되었습니다!');
                    }}
                    className="text-[11px] text-indigo-600 hover:underline flex items-center space-x-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>코드 복사</span>
                  </button>
                </div>
                <div className="bg-slate-900 text-indigo-300 p-3 rounded-xl font-mono text-[10px] border border-slate-800 overflow-x-auto">
                  <pre>{`// api/cron.js
import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req, res) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  // Gemini 3.6 Flash로 자동 정제 처리
  // ...
}`}</pre>
                </div>
              </div>

              {/* File 2: vercel.json */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span className="flex items-center space-x-1">
                    <FileJson className="w-3.5 h-3.5 text-indigo-600" />
                    <span>2. vercel.json (매일 아침 08:00 자동 스케줄러)</span>
                  </span>
                  <button
                    onClick={() => {
                      const code = `{
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "0 23 * * *"
    }
  ]
}`;
                      navigator.clipboard.writeText(code);
                      showToast('📋 vercel.json 코드가 복사되었습니다!');
                    }}
                    className="text-[11px] text-indigo-600 hover:underline flex items-center space-x-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>코드 복사</span>
                  </button>
                </div>
                <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-[10px] border border-slate-800 overflow-x-auto">
                  <pre>{`{
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "0 23 * * *" // UTC 23시 = 한국시간(KST) 매일 아침 8시
    }
  ]
}`}</pre>
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
                <p className="font-bold">💡 Vercel 환경변수 설정 필수:</p>
                <p>
                  Vercel 대시보드 Settings &gt; Environment Variables에서 <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-amber-950 font-bold">GEMINI_API_KEY</code>를 등록해 주세요.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setShowVercelGuideModal(false)}
                className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-xs"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 8: LOCATION & ADDRESS SEARCH MODAL */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowAddressModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  배달 설정 지역 선택
                </h3>
                <p className="text-[11px] text-slate-400">
                  내 주변 매장의 할인 &amp; 이벤트 혜택을 확인하세요
                </p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* GPS Button */}
              <button
                onClick={handleDetectGps}
                disabled={isDetectingGps}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-xs disabled:opacity-50"
              >
                <Compass className={`w-4 h-4 ${isDetectingGps ? 'animate-spin' : ''}`} />
                <span>{isDetectingGps ? 'GPS 위치 수신 중...' : '현재 위치(GPS) 자동 인식'}</span>
              </button>

              <div className="flex items-center space-x-2 my-2">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-[10px] text-slate-400 font-semibold">또는 직접 주소 입력</span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              {/* Input for address */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  지번/도로명 주소 검색 (시/군/구/동)
                </label>
                <input
                  type="text"
                  value={addressInputText}
                  onChange={(e) => setAddressInputText(e.target.value)}
                  placeholder="예: 서울 관악구 신림동, 경기 성남시 정자동"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Major Region Presets */}
              <div>
                <span className="block text-[11px] font-bold text-slate-500 mb-1.5">
                  빠른 선택 (주요 상권):
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    '서울특별시 관악구 신림동',
                    '서울특별시 마포구 서교동',
                    '경기도 성남시 분당구',
                    '경기도 화성시 동탄',
                    '대구광역시 수성구',
                    '부산광역시 부산진구',
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setAddressInputText(preset)}
                      className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-[11px] font-semibold rounded-lg text-left truncate transition-colors"
                    >
                      📍 {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    if (!addressInputText.trim()) {
                      showToast('주소를 입력해 주세요.');
                      return;
                    }
                    setUserAddress(addressInputText.trim());
                    try {
                      localStorage.setItem('delivery_user_address', addressInputText.trim());
                    } catch (e) {
                      console.error(e);
                    }
                    showToast(`📍 배달 지역 설정 완료: ${addressInputText.trim()}`);
                    setShowAddressModal(false);
                  }}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl active:scale-95 transition-transform"
                >
                  주소 저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 9: ADMIN AFFILIATE LINKS MANAGEMENT (수익 제휴 링크 관리) */}
      {showAffiliateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-5 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowAffiliateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <LinkIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  💰 제휴 마케팅 / 파트너스 수익 링크 설정
                </h3>
                <p className="text-[11px] text-slate-500">
                  관리자인 나만 설정 가능하며, 일반 유저가 '앱으로 이동' 클릭 시 이 수익 링크를 거쳐 이동합니다.
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 space-y-2">
                <p className="font-bold flex items-center space-x-1 text-xs text-amber-950">
                  <span>💡 [중요] 쿠팡이츠 링크 설정 안내:</span>
                </p>
                <div className="bg-white/80 p-2 rounded-lg border border-amber-200 text-[10.5px] leading-relaxed text-amber-950">
                  <p className="font-bold text-red-600 mb-0.5">⚠️ 쿠팡 파트너스에서 "지원하지 않는 형태" 오류가 나는 이유:</p>
                  <p className="text-slate-700">
                    쿠팡 파트너스는 <strong>일반 쿠팡 쇼핑몰(coupang.com)</strong> 전용 시스템이라 <code className="bg-amber-100 px-1 py-0.2 rounded font-mono font-bold">coupangeats.com</code> 주소로는 파트너스 단축 링크가 생성되지 않습니다.
                  </p>
                  <p className="font-bold text-blue-700 mt-1 mb-0.5">✅ 쿠팡이츠에 사용할 수 있는 올바른 주소 2가지:</p>
                  <ul className="list-disc pl-4 text-slate-800 space-y-0.5">
                    <li>
                      <strong>쿠팡이츠 공식 연결 주소:</strong> <code className="bg-slate-100 text-blue-700 px-1 font-mono font-bold">https://eats.coupang.com</code>
                    </li>
                    <li>
                      <strong>쿠팡이츠 친구초대/쿠폰 링크:</strong> 쿠팡이츠 앱 [MY &gt; 친구초대]에서 받은 추천 주소 (<code className="bg-slate-100 text-slate-700 px-1 font-mono">https://share.coupangeats.com/...</code>)
                    </li>
                  </ul>
                </div>
                <p className="text-[10px] text-amber-800/80 border-t border-amber-200/60 pt-1.5">
                  * <strong>파이썬 자동화 연동:</strong> <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">update_discounts.py</code>의 <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">COUPANG_EATS_TRACKING_URL</code>에 위 주소를 설정하면 자동 적용됩니다.
                </p>
              </div>

              {(['쿠팡이츠', '배민', '요기요', '땡겨요', '먹깨비', '두잇', '배달특급', '대구로', '동백통'] as const).map((appName) => (
                <div key={appName} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>{appName} {appName === '쿠팡이츠' ? '(쿠팡 파트너스 수익 링크)' : '제휴 링크'}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const url = affiliateUrls[appName] || '';
                        if (url) window.open(url, '_blank');
                      }}
                      className="text-[10px] text-blue-600 font-bold hover:underline flex items-center space-x-0.5"
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                      <span>링크 테스트</span>
                    </button>
                  </div>
                  <input
                    type="url"
                    value={affiliateUrls[appName] || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAffiliateUrls((prev) => {
                        const updated = { ...prev, [appName]: val };
                        try {
                          localStorage.setItem('delivery_affiliate_urls', JSON.stringify(updated));
                        } catch (err) {
                          console.error(err);
                        }
                        return updated;
                      });
                    }}
                    placeholder={`예: https://link.coupang.com/a/xxxx (${appName} 추천/수익 주소)`}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 font-mono"
                  />
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center space-x-2">
              <button
                onClick={() => {
                  try {
                    localStorage.setItem('delivery_affiliate_urls', JSON.stringify(affiliateUrls));
                  } catch (e) {
                    console.error(e);
                  }
                  showToast('💾 수익 제휴 링크 설정이 저장되었습니다!');
                  setShowAffiliateModal(false);
                }}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl transition-all shadow-xs"
              >
                저장 및 적용하기
              </button>
              <button
                onClick={() => setShowAffiliateModal(false)}
                className="px-4 py-2.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 10: USER FAVORITE FOOD & BRAND ALERT SETTING MODAL */}
      {showFoodAlertModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowFoodAlertModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  🔔 관심 음식 / 브랜드 알림 설정
                </h3>
                <p className="text-[11px] text-slate-500">
                  좋아하는 음식이나 브랜드 키워드를 등록하면 할인 발생 시 알림을 받습니다!
                </p>
              </div>
            </div>

            {/* Browser Push Permission Status Box */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 mb-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  🌐 브라우저 / 모바일 푸시 알림
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  enableBrowserNotification ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                }`}>
                  {enableBrowserNotification ? '알림 허용됨' : '미허용'}
                </span>
              </div>
              {!enableBrowserNotification && (
                <button
                  type="button"
                  onClick={() => {
                    if ('Notification' in window) {
                      Notification.requestPermission().then((permission) => {
                        if (permission === 'granted') {
                          setEnableBrowserNotification(true);
                          showToast('🔔 브라우저 알림 권한이 허용되었습니다!');
                        } else {
                          showToast('알림 권한이 거부되었습니다. 브라우저 설정에서 변경 가능합니다.');
                        }
                      });
                    } else {
                      showToast('이 브라우저는 웹 푸시 알림을 지원하지 않습니다.');
                    }
                  }}
                  className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg transition-all"
                >
                  푸시 알림 권한 허용하기
                </button>
              )}
            </div>

            {/* Keyword Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const trimmed = newKeywordInput.trim();
                if (!trimmed) return;
                if (favoriteKeywords.includes(trimmed)) {
                  showToast(`이미 등록된 키워드입니다: '${trimmed}'`);
                  return;
                }
                const updated = [...favoriteKeywords, trimmed];
                setFavoriteKeywords(updated);
                try {
                  localStorage.setItem('delivery_favorite_keywords', JSON.stringify(updated));
                } catch (err) {
                  console.error(err);
                }
                setNewKeywordInput('');
                showToast(`🔔 관심 키워드 '${trimmed}' 추가 완료!`);
              }}
              className="space-y-2 mb-4"
            >
              <label className="text-xs font-bold text-slate-800 block">
                + 새 관심 음식 / 브랜드 추가
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newKeywordInput}
                  onChange={(e) => setNewKeywordInput(e.target.value)}
                  placeholder="예: 치킨, BBQ, 엽떡, 피자, 버거"
                  className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 font-medium"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-all shrink-0"
                >
                  추가
                </button>
              </div>
            </form>

            {/* Current Registered Keywords Tag Cloud */}
            <div className="space-y-2 mb-5">
              <span className="text-xs font-bold text-slate-800 block">
                📌 내가 저장한 관심 키워드 ({favoriteKeywords.length}개)
              </span>
              {favoriteKeywords.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  등록된 관심 키워드가 없습니다. 위에서 추가해 보세요!
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 max-h-36 overflow-y-auto">
                  {favoriteKeywords.map((kw) => {
                    const matchCount = discounts.filter((d) => 
                      d.brand.toLowerCase().includes(kw.toLowerCase()) || 
                      d.discount.toLowerCase().includes(kw.toLowerCase()) ||
                      (d.category || '').toLowerCase().includes(kw.toLowerCase())
                    ).length;

                    return (
                      <span
                        key={kw}
                        className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-white border border-slate-300 text-slate-800 rounded-lg text-xs font-bold shadow-2xs"
                      >
                        <span>{kw}</span>
                        {matchCount > 0 && (
                          <span className="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                            {matchCount}건 딜
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = favoriteKeywords.filter((k) => k !== kw);
                            setFavoriteKeywords(updated);
                            try {
                              localStorage.setItem('delivery_favorite_keywords', JSON.stringify(updated));
                            } catch (err) {
                              console.error(err);
                            }
                            showToast(`삭제되었습니다: '${kw}'`);
                          }}
                          className="text-slate-400 hover:text-red-500 ml-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center space-x-2">
              <button
                onClick={() => {
                  try {
                    localStorage.setItem('delivery_favorite_keywords', JSON.stringify(favoriteKeywords));
                  } catch (e) {
                    console.error(e);
                  }
                  showToast('🔔 관심 알림 키워드가 저장되었습니다!');
                  setShowFoodAlertModal(false);
                }}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
              >
                닫기 및 저장 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
