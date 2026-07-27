import React, { useState } from 'react';
import { X, Navigation, MapPin, CheckCircle2, Search, Heart, Plus } from 'lucide-react';
import { Region, UserInterests } from '../types';
import { KOREA_REGIONS } from '../data/discountsData';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRegion: Region;
  onSelectRegion: (region: Region) => void;
  userInterests: UserInterests;
  onSaveInterests: (interests: UserInterests) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentRegion,
  onSelectRegion,
  userInterests,
  onSaveInterests,
}) => {
  const [selectedCity, setSelectedCity] = useState(currentRegion.city || '서울특별시');
  const [selectedDistrict, setSelectedDistrict] = useState(currentRegion.district || '강남구');
  const [dongInput, setDongInput] = useState(currentRegion.dong || '');
  
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeRegionData = KOREA_REGIONS.find((r) => r.city === selectedCity) || KOREA_REGIONS[0];
  const savedRegions = userInterests.savedRegions || [];

  const handleGpsDetect = () => {
    setIsDetectingGps(true);
    setGpsError(null);

    if (!navigator.geolocation) {
      setGpsError('사용하시는 브라우저에서 위치 서비스를 지원하지 않습니다.');
      setIsDetectingGps(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsDetectingGps(false);
        // 모의 역지오코딩 로직 (GPS 좌표 기반 임의의 동 할당 시뮬레이션)
        const mockDong = "역삼동";
        const mockDistrict = "강남구";
        const mockCity = "서울특별시";
        
        const detectedRegion: Region = {
          city: mockCity,
          district: mockDistrict,
          dong: mockDong,
          fullAddress: `${mockCity} ${mockDistrict} ${mockDong}`,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        onSelectRegion(detectedRegion);
        onClose();
      },
      (error) => {
        setIsDetectingGps(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsError('위치 권한 허용이 필요합니다. 브라우저 설정에서 승인해주세요.');
        } else {
          setGpsError('현재 위치를 감지할 수 없습니다. 시/구/동을 직접 입력/선택해주세요.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleConfirmLocation = () => {
    const finalDong = dongInput.trim() ? dongInput.trim() : '';
    const newRegion: Region = {
      city: selectedCity,
      district: selectedDistrict,
      dong: finalDong,
      fullAddress: finalDong ? `${selectedCity} ${selectedDistrict} ${finalDong}` : `${selectedCity} ${selectedDistrict}`,
    };
    onSelectRegion(newRegion);
    onClose();
  };

  const handleSaveCurrentRegion = () => {
    const finalDong = dongInput.trim() ? dongInput.trim() : '';
    const regionToSave: Region = {
      city: selectedCity,
      district: selectedDistrict,
      dong: finalDong,
      fullAddress: finalDong ? `${selectedCity} ${selectedDistrict} ${finalDong}` : `${selectedCity} ${selectedDistrict}`,
    };
    
    // 중복 체크
    if (!savedRegions.find(r => r.fullAddress === regionToSave.fullAddress)) {
      onSaveInterests({
        ...userInterests,
        savedRegions: [...savedRegions, regionToSave]
      });
    }
  };

  const handleSelectSavedRegion = (region: Region) => {
    onSelectRegion(region);
    onClose();
  };

  const handleRemoveSavedRegion = (fullAddress: string) => {
    onSaveInterests({
      ...userInterests,
      savedRegions: savedRegions.filter(r => r.fullAddress !== fullAddress)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div 
        id="location-modal-container"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-xl flex flex-col max-h-[85vh]"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-500" />
            <h2 className="text-base font-black text-slate-900 dark:text-white">배달 지역 설정</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          
          {/* Saved Regions Quick Select */}
          {savedRegions.length > 0 && (
            <div className="space-y-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-500" /> 내 관심 지역 (빠른 변경)
              </label>
              <div className="flex flex-wrap gap-2">
                {savedRegions.map((region) => (
                  <div key={region.fullAddress} className="inline-flex items-center bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl">
                    <button
                      onClick={() => handleSelectSavedRegion(region)}
                      className="px-3 py-1.5 text-xs font-bold text-rose-700 dark:text-rose-300 hover:text-rose-800"
                    >
                      {region.fullAddress}
                    </button>
                    <button
                      onClick={() => handleRemoveSavedRegion(region.fullAddress)}
                      className="pr-2 pl-1 py-1.5 text-rose-400 hover:text-rose-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* GPS Auto Detection Button */}
          <div className="bg-rose-50 dark:bg-rose-950/40 p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/40 flex items-center justify-between gap-2">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-rose-500" /> GPS 현재 위치 자동 감지
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                내 주변 (동/구/시) 이용 가능 할인을 즉시 확인합니다.
              </p>
            </div>
            <button
              onClick={handleGpsDetect}
              disabled={isDetectingGps}
              className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shrink-0 disabled:opacity-50 min-h-[40px] flex items-center gap-1"
            >
              {isDetectingGps ? '찾는 중...' : 'GPS 측정'}
            </button>
          </div>

          {gpsError && (
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300">
              {gpsError}
            </div>
          )}

          {/* City Selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
              시/도 선택
            </label>
            <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto p-1 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800">
              {KOREA_REGIONS.map((r) => (
                <button
                  key={r.city}
                  onClick={() => {
                    setSelectedCity(r.city);
                    setSelectedDistrict(r.districts[0]);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedCity === r.city
                      ? 'bg-rose-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {r.city}
                </button>
              ))}
            </div>
          </div>

          {/* District Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                {selectedCity} 구/시/군 선택
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-48 overflow-y-auto p-0.5">
              {activeRegionData.districts.map((dist) => {
                const isSelected = selectedDistrict === dist;
                return (
                  <button
                    key={dist}
                    onClick={() => setSelectedDistrict(dist)}
                    className={`p-2 rounded-xl text-xs font-medium text-left border transition-all flex items-center justify-between min-h-[40px] ${
                      isSelected
                        ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-700 dark:text-rose-300 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span>{dist}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dong Selection/Input */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
              동/읍/면 입력 (선택사항)
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="예: 역삼동, 정자동"
                value={dongInput}
                onChange={(e) => setDongInput(e.target.value)}
                className="w-full h-10 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 space-y-2">
          <button
            onClick={handleConfirmLocation}
            className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-rose-600 dark:hover:bg-rose-500 text-white text-sm font-bold flex items-center justify-center transition-transform active:scale-[0.98]"
          >
            선택한 위치로 설정
          </button>
          <button
            onClick={handleSaveCurrentRegion}
            className="w-full h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold flex items-center justify-center gap-1.5 transition-transform active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" /> 관심 지역 목록에 저장
          </button>
        </div>

      </div>
    </div>
  );
};
