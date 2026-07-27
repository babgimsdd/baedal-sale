import { Event } from '../engine/types';
import { Region, FoodCategory } from '../types';
import { rankEvents } from '../engine/rankingEngine';
import { locationEngine } from './LocationEngine';

export interface RankingJSONResult {
  generatedAt: string;
  totalCount: number;
  top10: Event[];
  regionTop10: Record<string, Event[]>;
  brandRankings: Record<string, Event[]>;
  categoryRankings: Record<FoodCategory | string, Event[]>;
}

/**
 * 8. Ranking JSON Generator Service
 * 모든 랭킹 데이터(TOP10, 지역별, 브랜드별, 카테고리별)를 JSON 구조로 일괄 생성 및 계산합니다.
 */
export class RankingService {
  /**
   * 전체 이벤트를 기반으로 모든 랭킹 JSON 데이터를 자동 계산하여 생성합니다.
   */
  public generateRankingJSON(events: Event[], userRegion?: Region): RankingJSONResult {
    const activeEvents = events.filter((e) => e.status === 'ACTIVE');
    const rankedAll = rankEvents(activeEvents, userRegion);

    // 1. 오늘의 TOP 10
    const top10 = rankedAll.slice(0, 10);

    // 2. 주요 지역별 TOP 10
    const regionNames = ['서울특별시', '경기도', '인천광역시', '부산광역시', '대구광역시', '광주광역시', '대전광역시'];
    const regionTop10: Record<string, Event[]> = {};

    regionNames.forEach((reg) => {
      const mockReg: Region = { city: reg, district: '', fullAddress: reg };
      const filtered = rankedAll.filter((ev) => locationEngine.isRegionSupported(ev.region, mockReg));
      regionTop10[reg] = filtered.slice(0, 10);
    });

    // 3. 주요 브랜드별 랭킹
    const brandRankings: Record<string, Event[]> = {};
    const brands = ['BBQ', 'BHC', '교촌치킨', '맘스터치', '굽네치킨', '도미노피자', '피자헛', '버거킹', '맥도날드', '롯데리아'];

    brands.forEach((brand) => {
      const filtered = rankedAll.filter((ev) => ev.brand.toLowerCase().includes(brand.toLowerCase()) || ev.title.includes(brand));
      if (filtered.length > 0) {
        brandRankings[brand] = filtered.slice(0, 5);
      }
    });

    // 4. 카테고리별 랭킹 (치킨, 피자, 중식, 한식, 분식, 버거, 카페, 디저트, 밀키트)
    const categoryKeywords: Record<string, string[]> = {
      치킨: ['치킨', 'bbq', 'bhc', '교촌', '굽네', '닭'],
      피자: ['피자', '도미노', '피자헛', '반올림'],
      버거: ['버거', '맘스터치', '버거킹', '맥도날드', '롯데리아'],
      중식: ['중식', '짜장', '짬뽕', '탕수육'],
      한식: ['한식', '국밥', '비빔밥', '찌개', '비비고', '햇반'],
      분식: ['분식', '떡볶이', '순대', '튀김'],
      카페: ['카페', '커피', '이디야', '투썸', '스타벅스'],
      디저트: ['디저트', '케이크', '빵', '아이스크림', '베스킨'],
      밀키트: ['밀키트', '컬리', 'cj더마켓', '스팸', '마트'],
    };

    const categoryRankings: Record<string, Event[]> = {};

    Object.entries(categoryKeywords).forEach(([cat, keywords]) => {
      const filtered = rankedAll.filter((ev) => {
        const text = `${ev.title} ${ev.description} ${ev.brand} ${ev.platform}`.toLowerCase();
        return keywords.some((kw) => text.includes(kw));
      });
      categoryRankings[cat] = filtered.slice(0, 5);
    });

    return {
      generatedAt: new Date().toISOString(),
      totalCount: rankedAll.length,
      top10,
      regionTop10,
      brandRankings,
      categoryRankings,
    };
  }
}

export const rankingService = new RankingService();
