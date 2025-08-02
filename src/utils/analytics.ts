// Analytics utility functions
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export class Analytics {
  private static instance: Analytics;
  private isInitialized = false;
  private measurementId: string | null = null;

  private constructor() {}

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  // Initialize Google Analytics with enhanced security
  init(measurementId: string) {
    if (!measurementId) {
      console.warn('Analytics: No measurement ID provided');
      return;
    }

    if (this.isInitialized) {
      console.log('Analytics: Already initialized');
      return;
    }

    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      console.warn('Analytics: Not in browser environment');
      return;
    }

    try {
      this.measurementId = measurementId;

      // Check if gtag is already loaded
      if (window.gtag) {
        console.log('Google Analytics already initialized');
        this.isInitialized = true;
        return;
      }

      // Create gtag script with error handling
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      script.onerror = () => {
        console.error('Analytics: Failed to load Google Analytics script');
      };
      document.head.appendChild(script);

      // Initialize dataLayer and gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function(...args: any[]) {
        window.dataLayer.push(args);
      };

      // Configure with privacy-focused settings
      window.gtag('js', new Date());
      window.gtag('config', measurementId, {
        page_title: document.title,
        page_location: window.location.href,
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      });

      this.isInitialized = true;
      console.log(`Analytics initialized with ID: ${measurementId}`);
    } catch (error) {
      console.error('Analytics: Initialization failed:', error);
    }
  }

  // Track page views
  trackPageView(path: string, title?: string) {
    if (!this.isInitialized || typeof window === 'undefined' || !window.gtag || !this.measurementId) {
      console.warn('Analytics: Not properly initialized');
      return;
    }

    try {
      window.gtag('config', this.measurementId, {
        page_path: path,
        page_title: title || document.title,
      });
    } catch (error) {
      console.error('Analytics: Failed to track page view:', error);
    }
  }

  // Track custom events
  trackEvent({ action, category, label, value }: AnalyticsEvent) {
    if (!this.isInitialized || typeof window === 'undefined' || !window.gtag) {
      console.warn('Analytics: Not properly initialized');
      return;
    }

    try {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    } catch (error) {
      console.error('Analytics: Failed to track event:', error);
    }
  }

  // Track form submissions
  trackFormSubmission(formName: string, success: boolean = true) {
    this.trackEvent({
      action: success ? 'form_submit_success' : 'form_submit_error',
      category: 'forms',
      label: formName,
    });
  }

  // Track button clicks
  trackButtonClick(buttonName: string, location: string) {
    this.trackEvent({
      action: 'button_click',
      category: 'engagement',
      label: `${buttonName} - ${location}`,
    });
  }

  // Track scroll depth
  trackScrollDepth(percentage: number) {
    if (percentage % 25 === 0) { // Track at 25%, 50%, 75%, 100%
      this.trackEvent({
        action: 'scroll_depth',
        category: 'engagement',
        label: `${percentage}%`,
        value: percentage,
      });
    }
  }

  // Track file downloads
  trackDownload(filename: string, fileType: string) {
    this.trackEvent({
      action: 'file_download',
      category: 'downloads',
      label: `${filename} (${fileType})`,
    });
  }

  // Track external link clicks
  trackExternalLink(url: string) {
    this.trackEvent({
      action: 'external_link_click',
      category: 'engagement',
      label: url,
    });
  }

  // Track search queries
  trackSearch(query: string, resultsCount?: number) {
    this.trackEvent({
      action: 'search',
      category: 'search',
      label: query,
      value: resultsCount,
    });
  }

  // Track user engagement time
  trackEngagementTime(timeOnPage: number) {
    this.trackEvent({
      action: 'engagement_time',
      category: 'engagement',
      label: 'time_on_page',
      value: Math.round(timeOnPage / 1000), // Convert to seconds
    });
  }
}

// Export singleton instance
export const analytics = Analytics.getInstance();

// Hook for React components
export const useAnalytics = () => {
  return {
    trackEvent: analytics.trackEvent.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackFormSubmission: analytics.trackFormSubmission.bind(analytics),
    trackButtonClick: analytics.trackButtonClick.bind(analytics),
    trackScrollDepth: analytics.trackScrollDepth.bind(analytics),
    trackDownload: analytics.trackDownload.bind(analytics),
    trackExternalLink: analytics.trackExternalLink.bind(analytics),
    trackSearch: analytics.trackSearch.bind(analytics),
  };
};