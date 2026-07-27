import { Event, CollectorResult, CollectorStatus } from '../types';

export abstract class BaseCollector {
  public readonly platform: string;
  public readonly scheduleMinutes: number;

  protected status: CollectorStatus;

  constructor(platform: string, scheduleMinutes: number) {
    this.platform = platform;
    this.scheduleMinutes = scheduleMinutes;
    this.status = {
      platform,
      scheduleMinutes,
      lastRunAt: null,
      nextRunAt: new Date(Date.now() + scheduleMinutes * 60 * 1000).toISOString(),
      totalCollected: 0,
      successCount: 0,
      failureCount: 0,
      status: 'IDLE',
    };
  }

  public getStatus(): CollectorStatus {
    return { ...this.status };
  }

  public async collect(): Promise<CollectorResult> {
    const now = new Date();
    this.status.status = 'RUNNING';
    this.status.lastRunAt = now.toISOString();

    try {
      const rawEvents = await this.fetchOfficialEvents();
      this.status.totalCollected += rawEvents.length;
      this.status.successCount += 1;
      this.status.status = 'IDLE';
      this.status.nextRunAt = new Date(Date.now() + this.scheduleMinutes * 60 * 1000).toISOString();

      return {
        platform: this.platform,
        events: rawEvents,
        collectedAt: now.toISOString(),
      };
    } catch (error: any) {
      this.status.failureCount += 1;
      this.status.status = 'ERROR';
      this.status.lastError = error?.message || '공식 수집 오류 발생';

      return {
        platform: this.platform,
        events: [],
        collectedAt: now.toISOString(),
        error: this.status.lastError,
      };
    }
  }

  protected abstract fetchOfficialEvents(): Promise<Event[]>;
}
