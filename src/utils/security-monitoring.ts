// Security monitoring and logging system
export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  severity: SecuritySeverity;
  timestamp: number;
  userId?: string;
  sessionId: string;
  ipAddress?: string;
  userAgent?: string;
  details: Record<string, any>;
  metadata: {
    page: string;
    referrer?: string;
    country?: string;
    device?: string;
  };
}

export type SecurityEventType = 
  | 'failed_login'
  | 'suspicious_activity'
  | 'rate_limit_exceeded'
  | 'invalid_input'
  | 'xss_attempt'
  | 'sql_injection_attempt'
  | 'csrf_attempt'
  | 'unauthorized_access'
  | 'data_breach_attempt'
  | 'malware_detected'
  | 'unusual_location'
  | 'multiple_failed_attempts'
  | 'session_hijack_attempt'
  | 'privilege_escalation_attempt';

export type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical';

interface SecurityConfig {
  enabled: boolean;
  logLevel: SecuritySeverity;
  realTimeAlerts: boolean;
  maxEventsPerSession: number;
  alertThresholds: {
    failedLogins: number;
    suspiciousActivity: number;
    rateLimitViolations: number;
  };
  retention: {
    days: number;
    maxEvents: number;
  };
}

class SecurityMonitor {
  private static instance: SecurityMonitor;
  private config: SecurityConfig;
  private events: SecurityEvent[] = [];
  private sessionId: string;
  private alertCallbacks: ((event: SecurityEvent) => void)[] = [];

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.config = {
      enabled: true,
      logLevel: 'medium',
      realTimeAlerts: true,
      maxEventsPerSession: 1000,
      alertThresholds: {
        failedLogins: 5,
        suspiciousActivity: 3,
        rateLimitViolations: 10,
      },
      retention: {
        days: 30,
        maxEvents: 10000,
      },
    };

    this.initializeMonitoring();
  }

  static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor();
    }
    return SecurityMonitor.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeMonitoring() {
    if (typeof window === 'undefined') return;

    // Monitor for suspicious patterns
    this.setupEventListeners();
    this.startPeriodicChecks();
    this.loadStoredEvents();
  }

  private setupEventListeners() {
    if (typeof window === 'undefined') return;

    // Monitor for rapid successive requests (potential bot activity)
    let requestCount = 0;
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      requestCount++;
      setTimeout(() => requestCount--, 1000);
      
      if (requestCount > 10) {
        this.logEvent({
          type: 'suspicious_activity',
          severity: 'high',
          details: { 
            reason: 'rapid_requests',
            requestCount,
            url: args[0]?.toString()
          }
        });
      }
      
      return originalFetch.apply(window, args);
    };

    // Monitor for console manipulation attempts
    const originalConsole = window.console;
    ['log', 'warn', 'error'].forEach(method => {
      const original = originalConsole[method];
      originalConsole[method] = (...args) => {
        const message = args.join(' ');
        if (this.detectMaliciousConsoleActivity(message)) {
          this.logEvent({
            type: 'suspicious_activity',
            severity: 'medium',
            details: { 
              reason: 'console_manipulation',
              message: message.substring(0, 200)
            }
          });
        }
        return original.apply(originalConsole, args);
      };
    });

    // Monitor for DevTools opening (basic detection)
    let devtools = { open: false, orientation: null };
    const threshold = 160;

    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          this.logEvent({
            type: 'suspicious_activity',
            severity: 'low',
            details: { reason: 'devtools_opened' }
          });
        }
      } else {
        devtools.open = false;
      }
    }, 500);

    // Monitor for unusual mouse patterns
    let mouseEvents: { x: number; y: number; time: number }[] = [];
    document.addEventListener('mousemove', (e) => {
      mouseEvents.push({ x: e.clientX, y: e.clientY, time: Date.now() });
      
      // Keep only last 50 events
      if (mouseEvents.length > 50) {
        mouseEvents = mouseEvents.slice(-50);
      }

      // Check for bot-like patterns
      if (mouseEvents.length >= 10) {
        const isLinearPattern = this.detectLinearMousePattern(mouseEvents.slice(-10));
        if (isLinearPattern) {
          this.logEvent({
            type: 'suspicious_activity',
            severity: 'medium',
            details: { reason: 'bot_like_mouse_pattern' }
          });
        }
      }
    });
  }

  private detectMaliciousConsoleActivity(message: string): boolean {
    const suspiciousPatterns = [
      /password/i,
      /token/i,
      /api[_\\s]?key/i,
      /secret/i,
      /credential/i,
      /hack/i,
      /exploit/i,
      /inject/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(message));
  }

  private detectLinearMousePattern(events: { x: number; y: number; time: number }[]): boolean {
    if (events.length < 5) return false;

    // Check if mouse movements are too linear (indicating bot)
    const slopes = [];
    for (let i = 1; i < events.length; i++) {
      const dx = events[i].x - events[i-1].x;
      const dy = events[i].y - events[i-1].y;
      if (dx !== 0) {
        slopes.push(dy / dx);
      }
    }

    if (slopes.length < 3) return false;

    // Check if slopes are too similar (linear movement)
    const avgSlope = slopes.reduce((sum, slope) => sum + slope, 0) / slopes.length;
    const variance = slopes.reduce((sum, slope) => sum + Math.pow(slope - avgSlope, 2), 0) / slopes.length;
    
    return variance < 0.1; // Very linear movement
  }

  private startPeriodicChecks() {
    // Check for anomalies every 30 seconds
    setInterval(() => {
      this.performSecurityChecks();
      this.cleanupOldEvents();
    }, 30000);
  }

  private performSecurityChecks() {
    // Check recent event patterns
    const recentEvents = this.getRecentEvents(5 * 60 * 1000); // Last 5 minutes
    
    // Detect rapid failed logins
    const failedLogins = recentEvents.filter(e => e.type === 'failed_login');
    if (failedLogins.length >= this.config.alertThresholds.failedLogins) {
      this.logEvent({
        type: 'multiple_failed_attempts',
        severity: 'high',
        details: { 
          attemptCount: failedLogins.length,
          timeWindow: '5_minutes'
        }
      });
    }

    // Detect suspicious activity clusters
    const suspiciousEvents = recentEvents.filter(e => e.type === 'suspicious_activity');
    if (suspiciousEvents.length >= this.config.alertThresholds.suspiciousActivity) {
      this.logEvent({
        type: 'suspicious_activity',
        severity: 'critical',
        details: { 
          reason: 'activity_cluster',
          eventCount: suspiciousEvents.length
        }
      });
    }
  }

  private cleanupOldEvents() {
    const cutoffTime = Date.now() - (this.config.retention.days * 24 * 60 * 60 * 1000);
    this.events = this.events.filter(event => event.timestamp > cutoffTime);

    if (this.events.length > this.config.retention.maxEvents) {
      this.events = this.events.slice(-this.config.retention.maxEvents);
    }

    this.persistEvents();
  }

  private loadStoredEvents() {
    try {
      const stored = localStorage.getItem('security_events');
      if (stored) {
        this.events = JSON.parse(stored).filter((event: SecurityEvent) => {
          const cutoffTime = Date.now() - (this.config.retention.days * 24 * 60 * 60 * 1000);
          return event.timestamp > cutoffTime;
        });
      }
    } catch (error) {
      console.warn('Failed to load stored security events:', error);
    }
  }

  private persistEvents() {
    try {
      localStorage.setItem('security_events', JSON.stringify(this.events));
    } catch (error) {
      console.warn('Failed to persist security events:', error);
    }
  }

  // Public methods
  logEvent(eventData: {
    type: SecurityEventType;
    severity: SecuritySeverity;
    details: Record<string, any>;
    userId?: string;
  }) {
    if (!this.config.enabled) return;

    const event: SecurityEvent = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: eventData.type,
      severity: eventData.severity,
      timestamp: Date.now(),
      userId: eventData.userId,
      sessionId: this.sessionId,
      details: eventData.details,
      metadata: {
        page: window.location.pathname,
        referrer: document.referrer,
        device: this.getDeviceInfo(),
      }
    };

    // Add user agent and IP if available
    if (typeof navigator !== 'undefined') {
      event.userAgent = navigator.userAgent;
    }

    this.events.push(event);

    // Limit events per session
    if (this.events.filter(e => e.sessionId === this.sessionId).length > this.config.maxEventsPerSession) {
      console.warn('Security: Maximum events per session exceeded');
      return;
    }

    this.persistEvents();

    // Trigger real-time alerts
    if (this.config.realTimeAlerts && this.shouldAlert(event)) {
      this.triggerAlert(event);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Security Event:', event);
    }
  }

  private shouldAlert(event: SecurityEvent): boolean {
    const severityLevels = { low: 1, medium: 2, high: 3, critical: 4 };
    const configLevel = severityLevels[this.config.logLevel];
    const eventLevel = severityLevels[event.severity];
    
    return eventLevel >= configLevel;
  }

  private triggerAlert(event: SecurityEvent) {
    this.alertCallbacks.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Security alert callback error:', error);
      }
    });
  }

  private getDeviceInfo(): string {
    if (typeof navigator === 'undefined') return 'unknown';
    
    const ua = navigator.userAgent;
    if (/Mobile|Android|iPhone|iPad/.test(ua)) return 'mobile';
    if (/Tablet/.test(ua)) return 'tablet';
    return 'desktop';
  }

  getRecentEvents(timeWindowMs: number): SecurityEvent[] {
    const cutoff = Date.now() - timeWindowMs;
    return this.events.filter(event => event.timestamp > cutoff);
  }

  getAllEvents(): SecurityEvent[] {
    return [...this.events];
  }

  getEventsByType(type: SecurityEventType): SecurityEvent[] {
    return this.events.filter(event => event.type === type);
  }

  getEventsBySeverity(severity: SecuritySeverity): SecurityEvent[] {
    return this.events.filter(event => event.severity === severity);
  }

  onAlert(callback: (event: SecurityEvent) => void) {
    this.alertCallbacks.push(callback);
  }

  updateConfig(updates: Partial<SecurityConfig>) {
    this.config = { ...this.config, ...updates };
  }

  getConfig(): SecurityConfig {
    return { ...this.config };
  }

  // Security utilities
  reportFailedLogin(userId?: string, reason?: string) {
    this.logEvent({
      type: 'failed_login',
      severity: 'medium',
      details: { reason: reason || 'invalid_credentials' },
      userId
    });
  }

  reportSuspiciousActivity(reason: string, details: Record<string, any> = {}) {
    this.logEvent({
      type: 'suspicious_activity',
      severity: 'high',
      details: { reason, ...details }
    });
  }

  reportRateLimitExceeded(endpoint: string, limit: number) {
    this.logEvent({
      type: 'rate_limit_exceeded',
      severity: 'medium',
      details: { endpoint, limit }
    });
  }

  reportInvalidInput(field: string, value: string, reason: string) {
    this.logEvent({
      type: 'invalid_input',
      severity: 'low',
      details: { 
        field, 
        valueLength: value?.length || 0,
        reason,
        value: value?.substring(0, 100) // Truncate for privacy
      }
    });
  }
}

export const securityMonitor = SecurityMonitor.getInstance();
