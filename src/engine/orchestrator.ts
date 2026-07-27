import { PlatformScheduler } from './scheduler';
import { filterValidEvents } from './validationEngine';
import { deduplicateEvents } from './deduplicationEngine';
import { processDeadLinks } from './deadLinkChecker';
import { processAutoReplacement } from './autoReplaceEngine';
import { rankEvents } from './rankingEngine';
import { Event, PipelineSummary, CollectorStatus } from './types';
import { dataCache } from './cache';

export interface DataEnginePipelineResult {
  activeEvents: Event[];
  allEvents: Event[];
  summary: PipelineSummary;
  collectorStatuses: CollectorStatus[];
  rejectedReasons: string[];
}

export class DataEngineOrchestrator {
  private scheduler: PlatformScheduler;

  constructor() {
    this.scheduler = new PlatformScheduler();
  }

  public async runPipeline(forceRefresh: boolean = false): Promise<DataEnginePipelineResult> {
    const cacheKey = 'master_pipeline_events';

    // 1. Check Cache
    if (!forceRefresh) {
      const cached = dataCache.get<DataEnginePipelineResult>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // 2. Step 1 & 2: Collect from platform collectors
    const collectorResults = await this.scheduler.runAllCollectors();
    let rawFetchedEvents: Event[] = [];

    collectorResults.forEach((res) => {
      rawFetchedEvents.push(...res.events);
    });

    // 3. Step 4: Validation Engine (Checks mandatory title, source, period, link, brand)
    const { validEvents, rejectedCount, reasons } = filterValidEvents(rawFetchedEvents);

    // 4. Step 5: Deduplication Engine (Same title, platform, period)
    const { uniqueEvents, removedCount } = deduplicateEvents(validEvents);

    // 5. Step 6: Dead Link Checker
    const { checkedEvents, deadCount } = await processDeadLinks(uniqueEvents);

    // 6. Step 7: Auto Replace & Expiry Engine
    const { processedEvents, expiredCount, replacedCount } = processAutoReplacement(checkedEvents);

    // 7. Step 8: Ranking Engine (Scoring and Ranking)
    const rankedAllEvents = rankEvents(processedEvents);

    // 8. Filter Active Feed
    const activeEvents = rankedAllEvents.filter((item) => item.status === 'ACTIVE');

    const summary: PipelineSummary = {
      timestamp: new Date().toISOString(),
      totalFetched: rawFetchedEvents.length,
      validCount: validEvents.length,
      dedupedCount: removedCount,
      deadLinkCount: deadCount,
      autoReplacedCount: replacedCount,
      finalActiveCount: activeEvents.length,
    };

    const result: DataEnginePipelineResult = {
      activeEvents,
      allEvents: rankedAllEvents,
      summary,
      collectorStatuses: this.scheduler.getAllStatuses(),
      rejectedReasons: reasons,
    };

    // Store in cache (15 mins TTL)
    dataCache.set(cacheKey, result, 15);

    return result;
  }

  public getCollectorStatuses(): CollectorStatus[] {
    return this.scheduler.getAllStatuses();
  }

  public async runSinglePlatform(platform: string): Promise<DataEnginePipelineResult> {
    await this.scheduler.runCollectorByPlatform(platform);
    return await this.runPipeline(true);
  }
}

export const dataEngineOrchestrator = new DataEngineOrchestrator();
