// Analytics utility functions with enhanced configuration management
import { analyticsConfig, type AnalyticsConfig } from '@/config/analytics';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    __ANALYTICS_CONFIG__?: Partial<AnalyticsConfig>;
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
  private config: AnalyticsConfig;

  private constructor() {
    this.config = analyticsConfig.getConfig();
    
    // Listen for configuration changes
    if (typeof window !== 'undefined') {
      window.addEventListener('analytics-config-changed', (event: any) => {
        this.config = event.detail;
        this.handleConfigChange();
      });
    }
  }

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  private handleConfigChange() {
    if (this.config.enabled && this.config.measurementId && !this.isInitialized) {
      this.init(this.config.measurementId);
    } else if (!this.config.enabled && this.isInitialized) {
      this.disable();
    }
  }

  // Initialize Google Analytics with configuration-driven settings
  init(measurementId?: string) {
    const finalMeasurementId = measurementId || this.config.measurementId;
    
    if (!finalMeasurementId) {
      if (this.config.debug) {
        console.warn('Analytics: No measurement ID provided');
      }
      return;
    }

    if (!this.config.enabled) {
      if (this.config.debug) {
        console.log('Analytics: Disabled by configuration');
      }
      return;
    }

    if (this.isInitialized) {
      if (this.config.debug) {
        console.log('Analytics: Already initialized');
      }
      return;
    }

    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      if (this.config.debug) {
        console.warn('Analytics: Not in browser environment');
      }
      return;
    }

    try {
      this.measurementId = finalMeasurementId;
      analyticsConfig.setMeasurementId(finalMeasurementId);

      // Check if gtag is already loaded
      if (window.gtag) {
        if (this.config.debug) {
          console.log('Google Analytics already initialized');
        }
        this.isInitialized = true;
        return;
      }

      // Create gtag script with error handling
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${finalMeasurementId}`;
      script.onerror = () => {
        console.error('Analytics: Failed to load Google Analytics script');
      };
      document.head.appendChild(script);

      // Initialize dataLayer and gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function(...args: any[]) {
        window.dataLayer.push(args);
      };

      // Configure with enhanced privacy settings
      window.gtag('js', new Date());
      window.gtag('config', finalMeasurementId, {
        page_title: document.title,
        page_location: window.location.href,
        anonymize_ip: this.config.privacyMode,
        allow_google_signals: !this.config.privacyMode,
        allow_ad_personalization_signals: !this.config.privacyMode,
        debug_mode: this.config.debug,
        send_page_view: true,
      });

      this.isInitialized = true;
      
      if (this.config.debug) {
        console.log(`Analytics initialized with ID: ${finalMeasurementId}`, {
          privacyMode: this.config.privacyMode,
          debug: this.config.debug
        });
      }
    } catch (error) {
      console.error('Analytics: Initialization failed:', error);
    }
  }

  // Disable analytics
  disable() {
    if (typeof window !== 'undefined' && window.gtag) {
      // Disable GA tracking
      window.gtag('config', this.measurementId || '', {
        send_page_view: false,
        transport_type: 'beacon'
      });
    }
    
    analyticsConfig.disable();
    if (this.config.debug) {
      console.log('Analytics: Disabled');
    }
  }

  // Track page views with enhanced validation
  trackPageView(path: string, title?: string) {
    if (!this.config.enabled || !this.isInitialized || typeof window === 'undefined' || !window.gtag || !this.measurementId) {
      if (this.config.debug) {
        console.warn('Analytics: Not properly initialized or disabled');
      }
      return;
    }

    // Validate and sanitize inputs
    const sanitizedPath = this.sanitizePath(path);
    const sanitizedTitle = this.sanitizeTitle(title || document.title);

    try {
      window.gtag('config', this.measurementId, {
        page_path: sanitizedPath,
        page_title: sanitizedTitle,
        custom_map: {
          privacy_mode: this.config.privacyMode
        }
      });

      if (this.config.debug) {
        console.log('Analytics: Page view tracked', { path: sanitizedPath, title: sanitizedTitle });
      }
    } catch (error) {
      console.error('Analytics: Failed to track page view:', error);
    }
  }

  // Track custom events with enhanced validation
  trackEvent({ action, category, label, value }: AnalyticsEvent) {
    if (!this.config.enabled || !this.isInitialized || typeof window === 'undefined' || !window.gtag) {
      if (this.config.debug) {
        console.warn('Analytics: Not properly initialized or disabled');
      }
      return;
    }

    // Validate and sanitize inputs
    const sanitizedAction = this.sanitizeEventAction(action);
    const sanitizedCategory = this.sanitizeEventCategory(category);
    const sanitizedLabel = label ? this.sanitizeEventLabel(label) : undefined;
    const validatedValue = this.validateEventValue(value);

    try {
      window.gtag('event', sanitizedAction, {
        event_category: sanitizedCategory,
        event_label: sanitizedLabel,
        value: validatedValue,
        custom_map: {
          privacy_mode: this.config.privacyMode,
          timestamp: Date.now()
        }
      });

      if (this.config.debug) {
        console.log('Analytics: Event tracked', { 
          action: sanitizedAction, 
          category: sanitizedCategory, 
          label: sanitizedLabel, 
          value: validatedValue 
        });
      }
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

  // Input sanitization methods
  private sanitizePath(path: string): string {
    return path
      .replace(/[<>]/g, '') // Remove angle brackets
      .substring(0, 2048) // Limit URL length
      .trim();
  }

  private sanitizeTitle(title: string): string {
    return title
      .replace(/[<>]/g, '') // Remove angle brackets
      .substring(0, 100) // Limit title length
      .trim();
  }

  private sanitizeEventAction(action: string): string {
    return action
      .replace(/[^a-zA-Z0-9_-]/g, '_') // Only allow alphanumeric, underscore, hyphen
      .substring(0, 40)
      .trim();
  }

  private sanitizeEventCategory(category: string): string {
    return category
      .replace(/[^a-zA-Z0-9_-]/g, '_') // Only allow alphanumeric, underscore, hyphen
      .substring(0, 40)
      .trim();
  }

  private sanitizeEventLabel(label: string): string {
    return label
      .replace(/[<>]/g, '') // Remove angle brackets
      .substring(0, 100)
      .trim();
  }

  private validateEventValue(value?: number): number | undefined {
    if (value === undefined) return undefined;
    if (typeof value !== 'number' || isNaN(value)) return undefined;
    if (value < 0 || value > Number.MAX_SAFE_INTEGER) return undefined;
    return Math.round(value);
  }

  // Configuration management
  updateConfiguration(updates: Partial<AnalyticsConfig>) {
    analyticsConfig.updateConfig(updates);
  }

  getConfiguration(): AnalyticsConfig {
    return this.config;
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