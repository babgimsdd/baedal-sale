import { Event } from './types';

export interface InteractionLog {
  eventId: string;
  type: 'VIEW' | 'SAVE' | 'CLICK';
  timestamp: string; // ISO string
}

/**
 * 4. Trending Engine (최근 24시간 실시간 실시간 트렌딩 계산 엔진)
 */
export class TrendingEngine {
  private logs: InteractionLog[] = [];

  /**
   * 사용자 인터랙션 기록 추가 (조회, 저장, 링크 클릭)
   */
  public logInteraction(eventId: string, type: 'VIEW' | 'SAVE' | 'CLICK') {
    this.logs.push({
      eventId,
      type,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 최근 24시간 이내의 로그만 필터링합니다.
   */
  private getRecentLogs(hours: number = 24): InteractionLog[] {
    const cutoff = new Date().getTime() - hours * 60 * 60 * 1000;
    return this.logs.filter((log) => new Date(log.timestamp).getTime() >= cutoff);
  }

  /**
   * 이벤트별 트렌딩 점수 계산
   * - VIEW: 1점
   * - SAVE: 3점
   * - CLICK: 5점
   */
  public getTrendingScores(hours: number = 24): Record<string, number> {
    const recentLogs = this.getRecentLogs(hours);
    const scores: Record<string, number> = {};

    recentLogs.forEach((log) => {
      const weight = log.type === 'CLICK' ? 5 : log.type === 'SAVE' ? 3 : 1;
      scores[log.eventId] = (scores[log.eventId] || 0) + weight;
    });

    return scores;
  }

  /**
   * 트렌딩 점수가 높은 순으로 이벤트 배열을 정렬
   */
  public sortEventsByTrending(events: Event[], hours: number = 24): Event[] {
    const scores = this.getTrendingScores(hours);
    return [...events].sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0));
  }
}

export const trendingEngine = new TrendingEngine();
