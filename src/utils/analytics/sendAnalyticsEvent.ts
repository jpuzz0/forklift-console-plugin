import { initializeAnalytics } from './initializeAnalytics';
import type { AnalyticsConfig } from './types';

/**
 * Sends analytics event to Segment with cluster configuration
 */
export const sendAnalyticsEvent = (
  eventType: string,
  properties: Record<string, unknown>,
  config: AnalyticsConfig,
) => {
  initializeAnalytics(config.segmentKey);

  const eventData = {
    clusterId: config.clusterId,
    plugin: 'forklift-console-plugin',
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
    version: process.env.VERSION ?? 'unknown',
    ...properties,
  };

  const { analytics } = window;

  if (!analytics) {
    return;
  }

  try {
    console.log(`[Forklift Analytics] Tracking event: ${eventType}`, { config, eventData });
    analytics.track(eventType, eventData, {
      context: {
        ip: '0.0.0.0',
      },
    });
  } catch (error) {
    console.warn(`[Forklift Analytics] Failed to track ${eventType}:`, error);
  }
};
