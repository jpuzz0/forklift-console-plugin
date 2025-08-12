import { useEffect, useRef } from 'react';

import { initializeAnalytics } from '../initializeAnalytics';
import { sendAnalyticsEvent } from '../sendAnalyticsEvent';

import { useAnalyticsConfig } from './useAnalyticsConfig';

/**
 * React hook for forklift telemetry with ConfigMap configuration
 */
export const useForkliftAnalytics = () => {
  const { clusterId, segmentKey } = useAnalyticsConfig();
  const initializationAttempted = useRef(false);

  useEffect(() => {
    if (segmentKey && !initializationAttempted.current && !window.analytics?.track) {
      initializationAttempted.current = true;
      initializeAnalytics(segmentKey);
    }
  }, [segmentKey]);

  const trackEvent = (eventType: string, properties: Record<string, unknown> = {}) => {
    if (!segmentKey || !clusterId) {
      return;
    }

    if (!window.analytics?.track) {
      return;
    }

    sendAnalyticsEvent(eventType, properties, { clusterId, segmentKey });
  };

  return { trackEvent };
};
