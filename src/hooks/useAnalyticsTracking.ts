import { useEffect } from 'react';
import { useAnalytics } from '@/utils/analytics';

// Hook to track scroll depth
export const useScrollTracking = () => {
  const { trackScrollDepth } = useAnalytics();

  useEffect(() => {
    let maxScroll = 0;
    const scrollTracker = new Set<number>();

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.round((scrollTop / documentHeight) * 100);

      if (scrollPercentage > maxScroll) {
        maxScroll = scrollPercentage;
        
        // Track at 25%, 50%, 75%, 100%
        const milestones = [25, 50, 75, 100];
        milestones.forEach(milestone => {
          if (scrollPercentage >= milestone && !scrollTracker.has(milestone)) {
            scrollTracker.add(milestone);
            trackScrollDepth(milestone);
          }
        });
      }
    };

    const throttledScrollHandler = throttle(handleScroll, 500);
    window.addEventListener('scroll', throttledScrollHandler);

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
    };
  }, [trackScrollDepth]);
};

// Hook to track engagement time
export const useEngagementTracking = () => {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const startTime = Date.now();
    let isActive = true;
    let lastActiveTime = startTime;

    const handleActivity = () => {
      if (!isActive) {
        isActive = true;
        lastActiveTime = Date.now();
      }
    };

    const handleInactivity = () => {
      isActive = false;
    };

    // Track when user becomes inactive
    let inactivityTimer: NodeJS.Timeout;
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(handleInactivity, 30000); // 30 seconds
      handleActivity();
    };

    // Add event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetInactivityTimer, true);
    });

    resetInactivityTimer();

    // Track engagement time when component unmounts or page unloads
    const trackFinalEngagement = () => {
      const endTime = isActive ? Date.now() : lastActiveTime;
      const engagementTime = endTime - startTime;
      
      if (engagementTime > 5000) { // Only track if more than 5 seconds
        trackEvent({
          action: 'engagement_time',
          category: 'engagement',
          label: 'time_on_page',
          value: Math.round(engagementTime / 1000),
        });
      }
    };

    // Track on page unload
    window.addEventListener('beforeunload', trackFinalEngagement);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer, true);
      });
      window.removeEventListener('beforeunload', trackFinalEngagement);
      clearTimeout(inactivityTimer);
      trackFinalEngagement();
    };
  }, [trackEvent]);
};

// Hook to track button clicks
export const useButtonTracking = () => {
  const { trackButtonClick } = useAnalytics();

  const trackClick = (buttonName: string, location: string = 'unknown') => {
    trackButtonClick(buttonName, location);
  };

  return { trackClick };
};

// Hook to track form interactions
export const useFormTracking = () => {
  const { trackFormSubmission, trackEvent } = useAnalytics();

  const trackFormStart = (formName: string) => {
    trackEvent({
      action: 'form_start',
      category: 'forms',
      label: formName,
    });
  };

  const trackFormField = (formName: string, fieldName: string) => {
    trackEvent({
      action: 'form_field_interaction',
      category: 'forms',
      label: `${formName} - ${fieldName}`,
    });
  };

  const trackFormError = (formName: string, errorType: string) => {
    trackEvent({
      action: 'form_error',
      category: 'forms',
      label: `${formName} - ${errorType}`,
    });
  };

  return {
    trackFormStart,
    trackFormField,
    trackFormError,
    trackFormSubmission,
  };
};

// Utility function to throttle function calls
function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  let previous = 0;

  return function (...args: Parameters<T>) {
    const now = Date.now();
    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(null, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func.apply(null, args);
      }, remaining);
    }
  };
}