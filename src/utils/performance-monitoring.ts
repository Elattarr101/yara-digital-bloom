// Performance and error monitoring
export interface PerformanceMetrics {
  pageLoadTime: number;
  timeToFirstByte: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  memoryUsage?: {
    used: number;
    total: number;
    limit?: number;
  };
  connectionType?: string;
  effectiveType?: string;
}

export interface ErrorReport {
  id: string;
  timestamp: number;
  type: 'javascript' | 'promise' | 'resource' | 'network';
  message: string;
  stack?: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  url?: string;
  userAgent: string;
  userId?: string;
  sessionId: string;
  pageUrl: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics | null = null;
  private errors: ErrorReport[] = [];
  private sessionId: string;
  private performanceObserver?: PerformanceObserver;

  private constructor() {
    this.sessionId = `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.initializeMonitoring();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeMonitoring() {
    if (typeof window === 'undefined') return;

    this.setupErrorHandlers();
    this.setupPerformanceObserver();
    this.collectInitialMetrics();
    
    // Collect metrics when page becomes hidden
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.collectMetrics();
      }
    });

    // Collect metrics on page unload
    window.addEventListener('beforeunload', () => {
      this.collectMetrics();
      this.sendMetrics();
    });
  }

  private setupErrorHandlers() {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.reportError({
        type: 'javascript',
        message: event.message,
        stack: event.error?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        severity: this.determineSeverity(event.error),
        context: {
          errorType: event.error?.constructor?.name,
        }
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        type: 'promise',
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack,
        severity: 'high',
        context: {
          reason: typeof event.reason === 'string' ? event.reason : event.reason?.toString(),
        }
      });
    });

    // Resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        const target = event.target as HTMLElement;
        this.reportError({
          type: 'resource',
          message: `Failed to load resource: ${target.tagName}`,
          url: (target as any).src || (target as any).href,
          severity: 'medium',
          context: {
            tagName: target.tagName,
            src: (target as any).src,
            href: (target as any).href,
          }
        });
      }
    }, true);
  }

  private setupPerformanceObserver() {
    if (!('PerformanceObserver' in window)) return;

    try {
      // Observe various performance metrics
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'largest-contentful-paint') {
            this.updateMetric('largestContentfulPaint', entry.startTime);
          } else if (entry.entryType === 'first-input') {
            this.updateMetric('firstInputDelay', (entry as any).processingStart - entry.startTime);
          } else if (entry.entryType === 'layout-shift') {
            if (!(entry as any).hadRecentInput) {
              this.updateMetric('cumulativeLayoutShift', 
                (this.metrics?.cumulativeLayoutShift || 0) + (entry as any).value);
            }
          }
        });
      });

      this.performanceObserver.observe({ 
        entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] 
      });
    } catch (error) {
      console.warn('Performance Observer setup failed:', error);
    }
  }

  private collectInitialMetrics() {
    // Wait for page load to collect initial metrics
    if (document.readyState === 'complete') {
      this.collectMetrics();
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => this.collectMetrics(), 0);
      });
    }
  }

  private collectMetrics() {
    if (!performance) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    this.metrics = {
      pageLoadTime: navigation ? navigation.loadEventEnd - navigation.fetchStart : 0,
      timeToFirstByte: navigation ? navigation.responseStart - navigation.fetchStart : 0,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      largestContentfulPaint: this.metrics?.largestContentfulPaint || 0,
      cumulativeLayoutShift: this.metrics?.cumulativeLayoutShift || 0,
      firstInputDelay: this.metrics?.firstInputDelay || 0,
      memoryUsage: this.getMemoryUsage(),
      connectionType: this.getConnectionInfo().type,
      effectiveType: this.getConnectionInfo().effectiveType,
    };
  }

  private updateMetric(key: keyof PerformanceMetrics, value: number) {
    if (!this.metrics) this.metrics = {} as PerformanceMetrics;
    (this.metrics as any)[key] = value;
  }

  private getMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
      };
    }
    return undefined;
  }

  private getConnectionInfo() {
    const connection = (navigator as any).connection || 
                     (navigator as any).mozConnection || 
                     (navigator as any).webkitConnection;
    
    return {
      type: connection?.type || 'unknown',
      effectiveType: connection?.effectiveType || 'unknown',
    };
  }

  private determineSeverity(error: Error): 'low' | 'medium' | 'high' | 'critical' {
    if (!error) return 'low';

    const criticalErrors = [
      'ChunkLoadError',
      'SecurityError',
      'TypeError',
      'ReferenceError'
    ];

    const highErrors = [
      'SyntaxError',
      'RangeError',
      'URIError'
    ];

    const errorName = error.constructor.name;
    
    if (criticalErrors.includes(errorName)) return 'critical';
    if (highErrors.includes(errorName)) return 'high';
    if (error.message.toLowerCase().includes('network')) return 'medium';
    
    return 'low';
  }

  private reportError(errorData: Partial<ErrorReport>) {
    const error: ErrorReport = {
      id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      type: errorData.type || 'javascript',
      message: errorData.message || 'Unknown error',
      stack: errorData.stack,
      filename: errorData.filename,
      lineno: errorData.lineno,
      colno: errorData.colno,
      url: errorData.url,
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
      pageUrl: window.location.href,
      severity: errorData.severity || 'medium',
      context: errorData.context,
    };

    this.errors.push(error);

    // Keep only last 50 errors
    if (this.errors.length > 50) {
      this.errors = this.errors.slice(-50);
    }

    // Report critical errors immediately
    if (error.severity === 'critical') {
      this.sendError(error);
    }

    // Report to security monitor if available
    if (typeof window !== 'undefined' && (window as any).securityMonitor) {
      (window as any).securityMonitor.logEvent({
        type: 'suspicious_activity',
        severity: error.severity,
        details: {
          reason: 'application_error',
          errorType: error.type,
          message: error.message.substring(0, 200),
          filename: error.filename,
        }
      });
    }
  }

  private sendMetrics() {
    if (!this.metrics) return;

    // Send to analytics if available
    if (typeof window !== 'undefined' && (window as any).analytics) {
      const analytics = (window as any).analytics;
      
      // Track performance metrics
      analytics.trackEvent({
        action: 'performance_metrics',
        category: 'performance',
        label: 'page_load',
        value: Math.round(this.metrics.pageLoadTime),
      });

      // Track Core Web Vitals
      if (this.metrics.largestContentfulPaint > 0) {
        analytics.trackEvent({
          action: 'core_web_vitals',
          category: 'performance',
          label: 'lcp',
          value: Math.round(this.metrics.largestContentfulPaint),
        });
      }

      if (this.metrics.firstInputDelay > 0) {
        analytics.trackEvent({
          action: 'core_web_vitals',
          category: 'performance',
          label: 'fid',
          value: Math.round(this.metrics.firstInputDelay),
        });
      }

      if (this.metrics.cumulativeLayoutShift > 0) {
        analytics.trackEvent({
          action: 'core_web_vitals',
          category: 'performance',
          label: 'cls',
          value: Math.round(this.metrics.cumulativeLayoutShift * 1000), // Convert to integer
        });
      }
    }
  }

  private sendError(error: ErrorReport) {
    // In a real implementation, you would send this to your error tracking service
    console.error('Reported Error:', error);
  }

  // Public methods
  getMetrics(): PerformanceMetrics | null {
    return this.metrics;
  }

  getErrors(): ErrorReport[] {
    return [...this.errors];
  }

  getErrorsByType(type: ErrorReport['type']): ErrorReport[] {
    return this.errors.filter(error => error.type === type);
  }

  getErrorsBySeverity(severity: ErrorReport['severity']): ErrorReport[] {
    return this.errors.filter(error => error.severity === severity);
  }

  clearErrors() {
    this.errors = [];
  }

  // Manual error reporting
  reportCustomError(message: string, severity: ErrorReport['severity'] = 'medium', context?: Record<string, any>) {
    this.reportError({
      type: 'javascript',
      message,
      severity,
      context,
    });
  }

  // Performance tracking utilities
  startTimer(name: string): () => number {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      
      // Track timing if analytics available
      if (typeof window !== 'undefined' && (window as any).analytics) {
        (window as any).analytics.trackEvent({
          action: 'custom_timing',
          category: 'performance',
          label: name,
          value: Math.round(duration),
        });
      }
      
      return duration;
    };
  }

  markFeatureUsage(feature: string) {
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.trackEvent({
        action: 'feature_usage',
        category: 'engagement',
        label: feature,
      });
    }
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();
