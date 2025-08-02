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

  private constructor() {}

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  // Initialize Google Analytics
  init(measurementId: string) {
    if (this.isInitialized || typeof window === 'undefined') return;

    // Create gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(...args: any[]) {
      window.dataLayer.push(args);
    };

    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
    });

    this.isInitialized = true;
    console.log('Analytics initialized');
  }

  // Track page views
  trackPageView(path: string, title?: string) {
    if (!this.isInitialized || typeof window === 'undefined') return;

    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: path,
      page_title: title || document.title,
    });
  }

  // Track custom events
  trackEvent({ action, category, label, value }: AnalyticsEvent) {
    if (!this.isInitialized || typeof window === 'undefined') return;

    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
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