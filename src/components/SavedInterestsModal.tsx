import React, { useState } from 'react';
import { X, Heart, Plus, Trash2, CheckCircle, Utensils, Store, Smartphone } from 'lucide-react';
import { UserInterests, FoodCategory, DeliveryApp } from '../types';

interface SavedInterestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInterests: UserInterests;
  onSaveInterests: (newInterests: UserInterests) => void;
}

const FOOD_OPTIONS: FoodCategory[] = ['치킨', '피자', '햄버거', '중식', '일식', '분식', '족발/보쌈', '디저트/카페', '밀키트/마트'];
const BRAND_OPTIONS = ['bbq', 'bhc', '교촌치킨', '도미노피자', '버거킹', '맥도날드', '비비고', '햇반', '프레시지'];
const APP_OPTIONS: DeliveryApp[] = ['배달의민족', '요기요', '쿠팡이츠', '땡겨요', '먹깨비', '지역 배달앱', '컬리', 'CJ더마켓', '기타 밀키트'];

export const SavedInterestsModal: React.FC<SavedInterestsModalProps> = ({
  isOpen,
  onClose,
  userInterests,
  onSaveInterests,
}) => {
  const [foods, setFoods] = useState<FoodCategory[]>(userInterests.favoriteFoods);
  const [brands, setBrands] = useState<string[]>(userInterests.favoriteBrands);
  const [apps, setApps] = useState<DeliveryApp[]>(userInterests.favoriteApps);
  const [customBrandInput, setCustomBrandInput] = useState('');

  if (!isOpen) return null;

  const toggleFood = (food: FoodCategory) => {
    setFoods((prev) =>
      prev.includes(food) ? prev.filter((f) => f !== food) : [...prev, food]
    );
  };

  const toggleBrand = (brand: string) => {
    setBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleApp = (app: DeliveryApp) => {
    setApps((prev) =>
      prev.includes(app) ? prev.filter((a) => a !== app) : [...prev, app]
    );
  };

  const addCustomBrand = () => {
    if (!customBrandInput.trim()) return;
    if (!brands.includes(customBrandInput.trim())) {
      setBrands([...brands, customBrandInput.trim()]);
    }
    setCustomBrandInput('');
  };

  const handleSave = () => {
    onSaveInterests({
      favoriteFoods: foods,
      favoriteBrands: brands,
      favoriteApps: apps,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        id="saved-interests-modal-container"
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
            <h2 className="text-lg font-bold text-white">내 관심 할인 설정</h2>
          </div>
          <button
            onClick={onClose}
            id="close-interests-modal-btn"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            💡 관심 음식, 관심 브랜드, 관심 배달앱을 등록해두면 새로운 할인 이벤트가 시작되었을 때 맞춤 알림을 받아보실 수 있습니다.
          </p>

          {/* Favorite Foods */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-amber-400" /> 관심 음식 선택
            </label>
            <div className="flex flex-wrap gap-2">
              {FOOD_OPTIONS.map((f) => {
                const isSelected = foods.includes(f);
                return (
                  <button
                    key={f}
                    onClick={() => toggleFood(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white border-slate-700/60'
                    }`}
                  >
                    <span>{f}</span>
                    {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Favorite Brands */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Store className="w-4 h-4 text-rose-400" /> 관심 브랜드 설정
            </label>
            <div className="flex flex-wrap gap-2">
              {BRAND_OPTIONS.map((b) => {
                const isSelected = brands.includes(b);
                return (
                  <button
                    key={b}
                    onClick={() => toggleBrand(b)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-rose-500 text-white border-rose-400 font-bold'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white border-slate-700/60'
                    }`}
                  >
                    <span>{b}</span>
                    {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Brand Input */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="직접 브랜드 입력 (예: 처갓집, 엽기떡볶이)"
                value={customBrandInput}
                onChange={(e) => setCustomBrandInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomBrand()}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
              <button
                onClick={addCustomBrand}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> 추가
              </button>
            </div>
          </div>

          {/* Favorite Apps */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-cyan-400" /> 관심 배달 서비스
            </label>
            <div className="flex flex-wrap gap-2">
              {APP_OPTIONS.map((a) => {
                const isSelected = apps.includes(a);
                return (
                  <button
                    key={a}
                    onClick={() => toggleApp(a)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white border-slate-700/60'
                    }`}
                  >
                    <span>{a}</span>
                    {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            선택 항목: 음식 {foods.length}개 / 브랜드 {brands.length}개 / 앱 {apps.length}개
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              id="save-interests-btn"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-md shadow-rose-600/20"
            >
              설정 저장
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
