import { Event } from './types';

export interface ValidationResult {
  isValid: boolean;
  reason?: string;
}

/**
 * 4. Validation Engine
 * Checks mandatory fields: title, platform (source), startDate/endDate (period), sourceUrl (link), brand.
 * Rejects event if any mandatory field is missing or empty.
 */
export function validateEvent(event: Partial<Event>): ValidationResult {
  if (!event.title || event.title.trim() === '') {
    return { isValid: false, reason: '필수 항목 누락: 제목 (title)' };
  }

  if (!event.platform || event.platform.trim() === '') {
    return { isValid: false, reason: '필수 항목 누락: 출처 (platform/source)' };
  }

  if (!event.brand || event.brand.trim() === '') {
    return { isValid: false, reason: '필수 항목 누락: 브랜드 (brand)' };
  }

  if (!event.sourceUrl || event.sourceUrl.trim() === '' || !event.sourceUrl.startsWith('http')) {
    return { isValid: false, reason: '필수 항목 누락 또는 유효하지 않은 URL: 링크 (sourceUrl)' };
  }

  if (!event.startDate || !event.endDate) {
    return { isValid: false, reason: '필수 항목 누락: 이벤트 기간 (startDate / endDate)' };
  }

  const startMs = new Date(event.startDate).getTime();
  const endMs = new Date(event.endDate).getTime();

  if (isNaN(startMs) || isNaN(endMs) || startMs > endMs) {
    return { isValid: false, reason: '유효하지 않은 이벤트 기간 형식' };
  }

  return { isValid: true };
}

export function filterValidEvents(events: Partial<Event>[]): { validEvents: Event[]; rejectedCount: number; reasons: string[] } {
  const validEvents: Event[] = [];
  const reasons: string[] = [];
  let rejectedCount = 0;

  events.forEach((item) => {
    const res = validateEvent(item);
    if (res.isValid) {
      validEvents.push(item as Event);
    } else {
      rejectedCount++;
      reasons.push(`[${item.platform || '알수없음'}] ${item.title || '제목없음'}: ${res.reason}`);
    }
  });

  return { validEvents, rejectedCount, reasons };
}
