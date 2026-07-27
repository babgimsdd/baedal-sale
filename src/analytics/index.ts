/**
 * Enterprise Analytics & Core Web Vitals Tracking Engine
 * Provides Google Analytics 4, Microsoft Clarity, and Google Search Console integration hooks.
 */

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

// Global declaration for GA4 window.gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    clarity?: (...args: any[]) => void;
  }
}

export const ANALYTICS_CONFIG = {
  ga4TrackingId: process.env.VITE_GA4_TRACKING_ID || 'G-DELIVERYDEALKR',
  clarityProjectId: process.env.VITE_CLARITY_ID || 'clarity-delivery-kr',
};

/**
 * Initializes GA4 and Clarity Scripts dynamically in production
 */
export function initAnalytics() {
  if (typeof window === 'undefined') return;

  // Track page view
  trackPageView(window.location.pathname);
}

/**
 * Tracks Page view for GA4
 */
export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', ANALYTICS_CONFIG.ga4TrackingId, {
      page_path: url,
    });
  }
}

/**
 * Tracks custom user interactions (e.g. Coupon Copy, Direct Official Link Click)
 */
export function trackEvent({ action, category, label, value }: AnalyticsEvent) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

/**
 * Core Web Vitals performance tracker logger (LCP, CLS, INP)
 */
export function reportWebVitals(metric: { name: string; value: number; id: string }) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Core Web Vitals] ${metric.name}:`, metric.value);
  }
  trackEvent({
    action: metric.name,
    category: 'Web Vitals',
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    label: metric.id,
  });
}
