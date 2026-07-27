import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Copy,
  Check,
  ExternalLink,
  Share2,
  Sparkles,
  Clock,
  ShieldAlert,
  Tag,
  Info,
  ShoppingBag,
  CreditCard,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { DiscountItem } from '../App';

interface DealDetailPageProps {
  item: DiscountItem;
  onBack: () => void;
  onCopyCoupon: (code: string) => void;
}

export const DealDetailPage: React.FC<DealDetailPageProps> = ({
  item,
  onBack,
  onCopyCoupon,
}) => {
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const title = item.title || item.name || item.brand;
  const affiliateUrl = item.affiliate_link || item.url || item.link || 'https://www.coupang.com';
  const imageUrl = item.imageUrl || item.image;
  const discountRate = item.discountRate;

  // Dynamic SEO Title, Description, and Open Graph Meta Tag Management
  useEffect(() => {
    const defaultTitle = document.title;
    const pageTitle = `${title} (${item.discount}) - 초특가 핫딜 | 배달/밀키트 쿠폰`;
    document.title = pageTitle;

    const metaDesc = document.querySelector('meta[name="description"]');
    const descContent = `${title} ${item.discount} 할인! ${item.linkNote || '실시간 최저가 쿠폰 및 밀키트 특가 정보'}`;
    if (metaDesc) {
      metaDesc.setAttribute('content', descContent);
    }

    const updateOgTag = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    updateOgTag('og:title', pageTitle);
    updateOgTag('og:description', descContent);
    if (item.imageUrl) {
      updateOgTag('og:image', item.imageUrl);
    }
    updateOgTag('og:type', 'product');

    return () => {
      document.title = defaultTitle;
    };
  }, [title, item]);

  const handleCopy = () => {
    if (item.couponCode) {
      onCopyCoupon(item.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `[초특가 핫딜] ${title}`,
          text: `${title} - ${item.discount} 할인 혜택!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  // Category Badge Label
  const categoryLabel =
    item.category === 'korean'
      ? '한식 밀키트'
      : item.category === 'chinese'
      ? '중식 밀키트'
      : item.category === 'western'
      ? '양식 밀키트'
      : item.category === 'coupon' || item.category_type === 'coupon'
      ? '배달/치킨 쿠폰'
      : item.category || '특가 할인';

  return (
    <div className="min-h-screen max-w-md mx-auto bg-slate-50 flex flex-col justify-between shadow-2xl relative font-sans border-x border-slate-200/60 pb-24">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between shadow-2xs">
        <button
          onClick={onBack}
          className="flex items-center space-x-1 text-slate-700 hover:text-slate-900 font-bold text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-all active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>특가 목록으로</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300/60">
            {item.app}
          </span>
          <button
            onClick={handleShare}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-all active:scale-95"
            title="공유하기"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Share Toast Notification */}
      {shareCopied && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-slate-700 animate-fade-in flex items-center space-x-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>상세페이지 링크가 복사되었습니다!</span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="p-4 space-y-4">
        {/* 1. Product Image / Hero Banner */}
        <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm group">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 flex flex-col items-center justify-center text-white p-6 text-center">
              <ShoppingBag className="w-12 h-12 mb-2 text-amber-200" />
              <p className="font-black text-lg">{item.brand}</p>
              <p className="text-xs text-amber-100 mt-1">{categoryLabel}</p>
            </div>
          )}

          {/* Badges on Image */}
          <div className="absolute top-3 left-3 flex items-center space-x-1.5">
            <span className="text-[11px] font-black px-2.5 py-1 rounded-lg bg-slate-900/80 text-white backdrop-blur-md shadow-sm">
              {categoryLabel}
            </span>
            {item.seller && (
              <span className="text-[11px] font-black px-2.5 py-1 rounded-lg bg-amber-500 text-white shadow-sm">
                🛒 {item.seller}
              </span>
            )}
          </div>

          {discountRate && (
            <div className="absolute bottom-3 right-3 bg-gradient-to-r from-red-600 to-orange-500 text-white px-3 py-1.5 rounded-xl font-black text-sm sm:text-base shadow-lg animate-pulse flex items-center space-x-1">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>🔥 {discountRate}% OFF</span>
            </div>
          )}
        </div>

        {/* 2. Product Name & Pricing Header */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center space-x-1.5 font-bold">
              <span className="text-blue-600 font-extrabold">{item.app}</span>
              <span>•</span>
              <span>{item.region || '전국 혜택'}</span>
            </div>
            {item.validity && (
              <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md font-semibold border border-amber-200/60 flex items-center space-x-1">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>{item.validity}</span>
              </span>
            )}
          </div>

          <h1 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
            {title}
          </h1>

          {/* Price & Discount Display */}
          <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
            <div className="space-y-0.5">
              <p className="text-[11px] font-semibold text-slate-400">특가 적용 가격</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-xl sm:text-2xl font-black text-red-600">
                  {item.discountPrice
                    ? `${item.discountPrice.toLocaleString()}원`
                    : item.discount}
                </span>
                {item.originalPrice && item.originalPrice > (item.discountPrice || 0) && (
                  <span className="text-xs sm:text-sm text-slate-400 line-through">
                    {item.originalPrice.toLocaleString()}원
                  </span>
                )}
              </div>
            </div>

            {discountRate && (
              <span className="text-xs font-black text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-xl">
                {discountRate}% 할인 중
              </span>
            )}
          </div>
        </div>

        {/* 3. Coupon Code Box */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 p-4 rounded-2xl border border-blue-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs font-black text-blue-950">
              <Tag className="w-4 h-4 text-blue-600" />
              <span>할인 쿠폰코드</span>
            </div>
            {item.couponCode && (
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md">
                결제 시 입력
              </span>
            )}
          </div>

          {item.couponCode ? (
            <div className="bg-white p-3 rounded-xl border border-blue-200 flex items-center justify-between shadow-2xs">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-semibold block">클릭 시 쿠폰 코드 자동 복사</span>
                <span className="font-mono font-black text-base text-blue-900 tracking-wider">
                  {item.couponCode}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 shadow-2xs active:scale-95 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>쿠폰 복사</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="bg-white/80 p-3 rounded-xl border border-blue-100 text-xs text-slate-600 font-medium">
              💡 별도 쿠폰 입력 없이 아래 [구매하러 가기] 클릭 시 자동으로 특가 할인이 적용됩니다.
            </div>
          )}
        </div>

        {/* 4. Product Description (상품 설명) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <h2 className="text-xs font-black text-slate-900 flex items-center space-x-1.5">
            <Info className="w-4 h-4 text-amber-500" />
            <span>상품 상세 정보 및 혜택</span>
          </h2>
          <div className="text-xs text-slate-700 leading-relaxed space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <p className="font-semibold text-slate-900">
              {item.linkNote || `${item.brand}의 한정 특가 상품입니다.`}
            </p>
            <p className="text-slate-600">
              본 특가 정보는 실시간 제휴 스토어 및 브랜드관 공식 세일 행사로 제공됩니다.
              {item.minOrder && ` (${item.minOrder})`}
            </p>
            {item.card_discount && item.card_discount !== '없음' && (
              <p className="text-blue-800 font-bold bg-blue-50 px-2 py-1 rounded border border-blue-100 flex items-center space-x-1 mt-1">
                <CreditCard className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>추가 결제 혜택: {item.card_discount}</span>
              </p>
            )}
          </div>
        </div>

        {/* 5. Usage Instructions (사용방법) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2.5">
          <h2 className="text-xs font-black text-slate-900 flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>특가 할인 사용방법</span>
          </h2>
          <ol className="text-xs text-slate-700 space-y-2 font-medium">
            <li className="flex items-start space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="bg-slate-900 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <span>
                상단의 <strong className="text-blue-700">[쿠폰 복사]</strong> 버튼을 눌러 쿠폰 코드를 복사합니다. (쿠폰이 없는 상품은 바로 이동)
              </span>
            </li>
            <li className="flex items-start space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="bg-slate-900 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <span>
                페이지 맨 아래의 <strong className="text-orange-600">[구매하러 가기]</strong> 버튼을 클릭하여 공식 제휴 구매 페이지로 연결합니다.
              </span>
            </li>
            <li className="flex items-start space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="bg-slate-900 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <span>
                주문 결제 단계에서 복사한 쿠폰 코드를 입력하거나 자동 할인을 확인한 뒤 결제를 완료합니다.
              </span>
            </li>
          </ol>
        </div>

        {/* 6. Precautions & Notice (주의사항) */}
        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 space-y-2 text-xs">
          <h2 className="font-black text-amber-950 flex items-center space-x-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>구매 전 주의사항</span>
          </h2>
          <ul className="text-amber-900/90 text-[11px] space-y-1 list-disc list-inside leading-snug">
            <li>
              <strong>유효기간:</strong> {item.validity || '오늘 한정 및 수량 소진 시까지'}
            </li>
            <li>
              <strong>최소 주문금액:</strong> {item.minOrder || '제한 없음'}
            </li>
            <li>
              본 할인 이벤트는 제휴 판매처 및 브랜드 사정에 따라 사전 고지 없이 조기 마감되거나 변경될 수 있습니다.
            </li>
            <li>
              제휴 마케팅 활동의 일환으로 일정액의 수수료를 제공받을 수 있으며, 구매 금액에는 영향을 주지 않습니다.
            </li>
          </ul>
        </div>
      </div>

      {/* 7. Bottom Sticky External Purchase CTA Button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 z-50 shadow-xl">
        <a
          href={affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-black text-sm sm:text-base rounded-2xl shadow-md hover:brightness-105 active:scale-98 transition-all flex items-center justify-center space-x-2"
        >
          <span>구매하러 가기</span>
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
};
