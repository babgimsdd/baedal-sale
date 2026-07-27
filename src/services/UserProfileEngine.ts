import { Region } from '../types';

export interface UserProfile {
  savedEventIds: string[];
  clickedEventIds: string[];
  viewedEventIds: string[];
  categoryAffinities: Record<string, number>; // 카테고리별 누적 점수
  brandAffinities: Record<string, number>;    // 브랜드별 누적 점수
  platformAffinities: Record<string, number>; // 플랫폼별 누적 점수
  recentSearches: string[];
  location?: Region;
  updatedAt: string;
}

const STORAGE_KEY = 'delivery_deal_user_profile_v1';

const DEFAULT_PROFILE: UserProfile = {
  savedEventIds: [],
  clickedEventIds: [],
  viewedEventIds: [],
  categoryAffinities: {},
  brandAffinities: {},
  platformAffinities: {},
  recentSearches: [],
  updatedAt: new Date().toISOString(),
};

/**
 * 1. User Profile Engine (LocalStorage 전용 개인정보 보호 프로필 관리자)
 * 모든 유저 데이터는 브라우저 내부 LocalStorage에만 저장되며 외부 서버로 전송되지 않습니다.
 */
export class UserProfileEngine {
  private profile: UserProfile;

  constructor() {
    this.profile = this.loadProfile();
  }

  private loadProfile(): UserProfile {
    if (typeof window === 'undefined') return DEFAULT_PROFILE;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(data) };
      }
    } catch (e) {
      console.warn('Failed to load user profile from LocalStorage:', e);
    }
    return DEFAULT_PROFILE;
  }

  private saveProfile() {
    if (typeof window === 'undefined') return;
    try {
      this.profile.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile));
    } catch (e) {
      console.warn('Failed to save user profile to LocalStorage:', e);
    }
  }

  public getProfile(): UserProfile {
    return { ...this.profile };
  }

  /**
   * 이벤트 조회/클릭/저장 시 선호도 가중치 자동 축적
   */
  public trackInteraction(
    eventId: string,
    action: 'VIEW' | 'CLICK' | 'SAVE',
    brand?: string,
    platform?: string,
    category?: string
  ) {
    const weight = action === 'SAVE' ? 5 : action === 'CLICK' ? 3 : 1;

    if (action === 'SAVE' && !this.profile.savedEventIds.includes(eventId)) {
      this.profile.savedEventIds.push(eventId);
    }
    if (action === 'CLICK' && !this.profile.clickedEventIds.includes(eventId)) {
      this.profile.clickedEventIds.push(eventId);
    }
    if (!this.profile.viewedEventIds.includes(eventId)) {
      this.profile.viewedEventIds.unshift(eventId);
      if (this.profile.viewedEventIds.length > 50) this.profile.viewedEventIds.pop();
    }

    if (brand) {
      this.profile.brandAffinities[brand] = (this.profile.brandAffinities[brand] || 0) + weight;
    }
    if (platform) {
      this.profile.platformAffinities[platform] = (this.profile.platformAffinities[platform] || 0) + weight;
    }
    if (category) {
      this.profile.categoryAffinities[category] = (this.profile.categoryAffinities[category] || 0) + weight;
    }

    this.saveProfile();
  }

  public trackSearch(keyword: string) {
    if (!keyword.trim()) return;
    const filtered = this.profile.recentSearches.filter((k) => k !== keyword);
    this.profile.recentSearches = [keyword, ...filtered].slice(0, 10);
    this.saveProfile();
  }

  public setLocation(location: Region) {
    this.profile.location = location;
    this.saveProfile();
  }
}

export const userProfileEngine = new UserProfileEngine();
