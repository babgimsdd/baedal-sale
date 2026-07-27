import { BaseCollector } from './collectors/BaseCollector';
import { DynamicSourceCollector } from './collectors/DynamicSourceCollector';
import { CollectorStatus, CollectorResult, DataSourceConfig } from './types';
import sourcesData from './sources.json';

/**
 * 8. Independent Platform Scheduler Manager (sources.json 기반 동적 컬렉터)
 * Configures distinct polling schedules for each platform & brand loaded directly from sources.json
 */
export class PlatformScheduler {
  private collectors: Map<string, BaseCollector> = new Map();

  constructor() {
    this.loadFromSourcesConfig();
  }

  public loadFromSourcesConfig() {
    const sources = sourcesData as DataSourceConfig[];
    sources.forEach((source) => {
      if (source.enabled) {
        const collector = new DynamicSourceCollector(source);
        this.registerCollector(collector);
      }
    });
  }

  public registerCollector(collector: BaseCollector) {
    this.collectors.set(collector.platform, collector);
  }

  public getAllStatuses(): CollectorStatus[] {
    return Array.from(this.collectors.values()).map((c) => c.getStatus());
  }

  public async runAllCollectors(): Promise<CollectorResult[]> {
    const results: CollectorResult[] = [];
    for (const collector of this.collectors.values()) {
      const res = await collector.collect();
      results.push(res);
    }
    return results;
  }

  public async runCollectorByPlatform(platform: string): Promise<CollectorResult | null> {
    const collector = this.collectors.get(platform);
    if (!collector) return null;
    return await collector.collect();
  }
}

export const platformScheduler = new PlatformScheduler();
