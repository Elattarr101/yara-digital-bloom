// Analytics configuration management
export interface AnalyticsConfig {
  enabled: boolean;
  measurementId: string | null;
  privacyMode: boolean;
  debug: boolean;
}

class AnalyticsConfigManager {
  private static instance: AnalyticsConfigManager;
  private config: AnalyticsConfig = {
    enabled: false,
    measurementId: null,
    privacyMode: true,
    debug: false
  };

  private constructor() {
    this.loadConfiguration();
  }

  static getInstance(): AnalyticsConfigManager {
    if (!AnalyticsConfigManager.instance) {
      AnalyticsConfigManager.instance = new AnalyticsConfigManager();
    }
    return AnalyticsConfigManager.instance;
  }

  private loadConfiguration() {
    // Load from localStorage or environment
    const storedConfig = localStorage.getItem('analytics-config');
    if (storedConfig) {
      try {
        this.config = { ...this.config, ...JSON.parse(storedConfig) };
      } catch (error) {
        console.warn('Failed to parse stored analytics config:', error);
      }
    }

    // Override with runtime configuration if available
    if (typeof window !== 'undefined') {
      const runtimeConfig = (window as any).__ANALYTICS_CONFIG__;
      if (runtimeConfig) {
        this.config = { ...this.config, ...runtimeConfig };
      }
    }
  }

  getConfig(): AnalyticsConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<AnalyticsConfig>) {
    this.config = { ...this.config, ...updates };
    
    // Persist to localStorage
    try {
      localStorage.setItem('analytics-config', JSON.stringify(this.config));
    } catch (error) {
      console.warn('Failed to persist analytics config:', error);
    }

    // Notify about configuration change
    window.dispatchEvent(new CustomEvent('analytics-config-changed', {
      detail: this.config
    }));
  }

  setMeasurementId(measurementId: string) {
    this.updateConfig({ 
      measurementId, 
      enabled: !!measurementId 
    });
  }

  enable() {
    if (this.config.measurementId) {
      this.updateConfig({ enabled: true });
    } else {
      console.warn('Cannot enable analytics without measurement ID');
    }
  }

  disable() {
    this.updateConfig({ enabled: false });
  }

  togglePrivacyMode(enabled: boolean) {
    this.updateConfig({ privacyMode: enabled });
  }

  setDebugMode(enabled: boolean) {
    this.updateConfig({ debug: enabled });
  }
}

export const analyticsConfig = AnalyticsConfigManager.getInstance();