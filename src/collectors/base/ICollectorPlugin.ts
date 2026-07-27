import { Event, CollectorResult, DataSourceConfig } from '../../engine/types';

/**
 * Clean Architecture Collector Plugin Interface
 * 모든 플랫폼/브랜드 수집기는 이 인터페이스를 구현해야 합니다.
 * 단 하나의 클래스/파일 추가로 신규 플랫폼 연동이 완료되는 Plugin Structure.
 */
export interface ICollectorPlugin {
  readonly id: string;
  readonly platformName: string;
  readonly config: DataSourceConfig;

  /**
   * 1. 공식 원본 데이터 크롤링 / API 요청
   */
  collect(): Promise<CollectorResult>;

  /**
   * 2. 데이터 품질 검사 (필수 항목, 유효 기간, 링크 수신 여부)
   */
  validate(rawEvents: Partial<Event>[]): Partial<Event>[];

  /**
   * 3. 도메인 표준 DiscountEvent 규격으로 데이터 정제 (Normalization)
   */
  normalize(rawEvents: Partial<Event>[]): Event[];

  /**
   * 4. 정제된 데이터를 저장소/캐시에 기록
   */
  save(events: Event[]): Promise<void>;
}
