import { Region } from '../types';

export interface LocationState {
  currentRegion: Region;
  gpsEnabled: boolean;
  gpsError?: string;
}

export const DEFAULT_REGION: Region = {
  city: '서울특별시',
  district: '강남구',
  dong: '역삼동',
  fullAddress: '서울특별시 강남구 역삼동',
  latitude: 37.5001,
  longitude: 127.0362,
};

/**
 * Location Engine
 * 위치 정보 파싱 및 지역 매칭 판별 서비스를 전담합니다.
 */
export class LocationEngine {
  /**
   * 브라우저 Geolocation API로 현재 GPS 위치를 취득합니다.
   */
  public async getGpsLocation(): Promise<Region> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation을 지원하지 않는 브라우저입니다.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          // Reverse geocoding simulation based on lat/lng
          resolve({
            city: '서울특별시',
            district: '강남구',
            dong: '역삼동',
            fullAddress: `서울특별시 강남구 역삼동 (GPS 수신 완료)`,
            latitude: lat,
            longitude: lng,
          });
        },
        (error) => {
          reject(error);
        },
        { timeout: 5000, enableHighAccuracy: true }
      );
    });
  }

  /**
   * 사용자 선택 시/도, 구/군, 동 정보를 기반으로 Region 객체를 생성합니다.
   */
  public createManualRegion(city: string, district: string, dong?: string): Region {
    const fullAddress = `${city} ${district} ${dong || ''}`.trim();
    return {
      city,
      district,
      dong,
      fullAddress,
    };
  }

  /**
   * 이벤트 지원 지역과 사용자 지역의 일치 여부를 판단합니다.
   * 예) ["전국"] -> true
   * 예) ["서울특별시"] vs "서울특별시 강남구 역삼동" -> true
   * 예) ["서울특별시 강남구"] vs "서울특별시 강남구 역삼동" -> true
   */
  public isRegionSupported(targetRegions: string[] | undefined, userRegion: Region): boolean {
    if (!targetRegions || targetRegions.length === 0) return true;
    if (targetRegions.includes('전국')) return true;

    return targetRegions.some((target) => {
      if (target === userRegion.city) return true;
      if (target === `${userRegion.city} ${userRegion.district}`) return true;
      if (target === userRegion.fullAddress) return true;
      if (userRegion.fullAddress.includes(target)) return true;
      return false;
    });
  }
}

export const locationEngine = new LocationEngine();
