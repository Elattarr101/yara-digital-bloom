// Enhanced rate limiting with advanced patterns
export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (identifier: string) => string;
  skipSuccessful?: boolean;
  skipFailedRequests?: boolean;
  onLimitReached?: (identifier: string) => void;
}

export interface RateLimitResult {
  allowed: boolean;
  remainingRequests?: number;
  resetTime?: number;
  retryAfter?: number;
}

interface RateLimitEntry {
  requests: number;
  windowStart: number;
  lastRequest: number;
  violations: number;
}

class AdvancedRateLimit {
  private static instance: AdvancedRateLimit;
  private limits = new Map<string, RateLimitEntry>();
  private configs = new Map<string, RateLimitConfig>();
  private blockedIPs = new Set<string>();
  private suspiciousActivity = new Map<string, number>();

  private constructor() {
    this.setupDefaultLimits();
    this.startCleanupInterval();
  }

  static getInstance(): AdvancedRateLimit {
    if (!AdvancedRateLimit.instance) {
      AdvancedRateLimit.instance = new AdvancedRateLimit();
    }
    return AdvancedRateLimit.instance;
  }

  private setupDefaultLimits() {
    // Contact form rate limiting
    this.configs.set('contact_form', {
      maxRequests: 3,
      windowMs: 15 * 60 * 1000, // 15 minutes
      onLimitReached: (identifier) => {
        this.handleLimitReached('contact_form', identifier);
      }
    });

    // Login attempts
    this.configs.set('login_attempts', {
      maxRequests: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
      onLimitReached: (identifier) => {
        this.handleLimitReached('login_attempts', identifier);
      }
    });

    // API requests
    this.configs.set('api_requests', {
      maxRequests: 100,
      windowMs: 60 * 1000, // 1 minute
      onLimitReached: (identifier) => {
        this.handleLimitReached('api_requests', identifier);
      }
    });

    // Search requests
    this.configs.set('search_requests', {
      maxRequests: 20,
      windowMs: 60 * 1000, // 1 minute
      onLimitReached: (identifier) => {
        this.handleLimitReached('search_requests', identifier);
      }
    });

    // File uploads
    this.configs.set('file_uploads', {
      maxRequests: 10,
      windowMs: 60 * 60 * 1000, // 1 hour
      onLimitReached: (identifier) => {
        this.handleLimitReached('file_uploads', identifier);
      }
    });
  }

  private startCleanupInterval() {
    // Clean up old entries every 5 minutes
    setInterval(() => {
      this.cleanupExpiredEntries();
    }, 5 * 60 * 1000);
  }

  private cleanupExpiredEntries() {
    const now = Date.now();
    
    for (const [key, entry] of this.limits.entries()) {
      const [limitType] = key.split(':');
      const config = this.configs.get(limitType);
      
      if (config && now - entry.windowStart > config.windowMs * 2) {
        this.limits.delete(key);
      }
    }
  }

  private handleLimitReached(limitType: string, identifier: string) {
    // Track violations
    const violationKey = `${limitType}:${identifier}`;
    const violations = this.suspiciousActivity.get(violationKey) || 0;
    this.suspiciousActivity.set(violationKey, violations + 1);

    // Block IP after multiple violations
    if (violations >= 3) {
      this.blockedIPs.add(identifier);
      
      // Auto-unblock after 24 hours
      setTimeout(() => {
        this.blockedIPs.delete(identifier);
        this.suspiciousActivity.delete(violationKey);
      }, 24 * 60 * 60 * 1000);
    }

    // Report to security monitor
    if (typeof window !== 'undefined' && (window as any).securityMonitor) {
      (window as any).securityMonitor.reportRateLimitExceeded(limitType, this.configs.get(limitType)?.maxRequests || 0);
    }
  }

  private getKey(limitType: string, identifier: string): string {
    const config = this.configs.get(limitType);
    const key = config?.keyGenerator ? config.keyGenerator(identifier) : identifier;
    return `${limitType}:${key}`;
  }

  private isBlocked(identifier: string): boolean {
    return this.blockedIPs.has(identifier);
  }

  private detectSuspiciousPatterns(limitType: string, identifier: string): boolean {
    const key = this.getKey(limitType, identifier);
    const entry = this.limits.get(key);
    
    if (!entry) return false;

    const now = Date.now();
    const timeBetweenRequests = now - entry.lastRequest;

    // Detect bot-like behavior (requests too fast or too regular)
    if (timeBetweenRequests < 100) { // Less than 100ms between requests
      return true;
    }

    // Check for suspicious request patterns
    const config = this.configs.get(limitType);
    if (config && entry.requests > config.maxRequests * 0.8) {
      // Approaching limit quickly
      const timeInWindow = now - entry.windowStart;
      const requestRate = entry.requests / timeInWindow * 1000; // requests per second
      
      if (requestRate > 10) { // More than 10 requests per second
        return true;
      }
    }

    return false;
  }

  // Public methods
  check(limitType: string, identifier: string): RateLimitResult {
    // Check if identifier is blocked
    if (this.isBlocked(identifier)) {
      return {
        allowed: false,
        retryAfter: 24 * 60 * 60 * 1000, // 24 hours
      };
    }

    const config = this.configs.get(limitType);
    if (!config) {
      throw new Error(`Rate limit configuration not found for: ${limitType}`);
    }

    const key = this.getKey(limitType, identifier);
    const now = Date.now();
    let entry = this.limits.get(key);

    // Initialize or reset window if expired
    if (!entry || now - entry.windowStart > config.windowMs) {
      entry = {
        requests: 0,
        windowStart: now,
        lastRequest: 0,
        violations: 0,
      };
    }

    // Check for suspicious patterns
    if (this.detectSuspiciousPatterns(limitType, identifier)) {
      // Report suspicious activity
      if (typeof window !== 'undefined' && (window as any).securityMonitor) {
        (window as any).securityMonitor.reportSuspiciousActivity(
          'rate_limit_suspicious_pattern',
          { limitType, identifier, requests: entry.requests }
        );
      }
      
      // Increase violation count
      entry.violations++;
      
      // Temporary block for suspicious behavior
      if (entry.violations >= 3) {
        this.blockedIPs.add(identifier);
        setTimeout(() => this.blockedIPs.delete(identifier), 60 * 60 * 1000); // 1 hour
        
        return {
          allowed: false,
          retryAfter: 60 * 60 * 1000, // 1 hour
        };
      }
    }

    // Check if limit exceeded
    if (entry.requests >= config.maxRequests) {
      const resetTime = entry.windowStart + config.windowMs;
      const retryAfter = resetTime - now;

      config.onLimitReached?.(identifier);

      return {
        allowed: false,
        remainingRequests: 0,
        resetTime,
        retryAfter: Math.max(0, retryAfter),
      };
    }

    // Allow request
    entry.requests++;
    entry.lastRequest = now;
    this.limits.set(key, entry);

    const resetTime = entry.windowStart + config.windowMs;
    const remainingRequests = config.maxRequests - entry.requests;

    return {
      allowed: true,
      remainingRequests,
      resetTime,
    };
  }

  // Specific method implementations
  checkContactForm(email: string): RateLimitResult {
    return this.check('contact_form', email.toLowerCase());
  }

  checkLoginAttempts(identifier: string): RateLimitResult {
    return this.check('login_attempts', identifier.toLowerCase());
  }

  checkAPIRequests(identifier: string): RateLimitResult {
    return this.check('api_requests', identifier);
  }

  checkSearchRequests(identifier: string): RateLimitResult {
    return this.check('search_requests', identifier);
  }

  checkFileUploads(identifier: string): RateLimitResult {
    return this.check('file_uploads', identifier);
  }

  // Administrative methods
  addCustomLimit(limitType: string, config: RateLimitConfig) {
    this.configs.set(limitType, config);
  }

  removeLimit(limitType: string) {
    this.configs.delete(limitType);
    
    // Remove all entries for this limit type
    for (const key of this.limits.keys()) {
      if (key.startsWith(`${limitType}:`)) {
        this.limits.delete(key);
      }
    }
  }

  reset(limitType: string, identifier?: string) {
    if (identifier) {
      const key = this.getKey(limitType, identifier);
      this.limits.delete(key);
    } else {
      // Reset all entries for this limit type
      for (const key of this.limits.keys()) {
        if (key.startsWith(`${limitType}:`)) {
          this.limits.delete(key);
        }
      }
    }
  }

  getStats(limitType: string): {
    totalRequests: number;
    activeWindows: number;
    violations: number;
    blockedIdentifiers: number;
  } {
    let totalRequests = 0;
    let activeWindows = 0;
    let violations = 0;

    for (const [key, entry] of this.limits.entries()) {
      if (key.startsWith(`${limitType}:`)) {
        totalRequests += entry.requests;
        activeWindows++;
        violations += entry.violations;
      }
    }

    let blockedIdentifiers = 0;
    for (const [key, count] of this.suspiciousActivity.entries()) {
      if (key.startsWith(`${limitType}:`)) {
        blockedIdentifiers += count >= 3 ? 1 : 0;
      }
    }

    return {
      totalRequests,
      activeWindows,
      violations,
      blockedIdentifiers,
    };
  }

  isIdentifierBlocked(identifier: string): boolean {
    return this.blockedIPs.has(identifier);
  }

  unblockIdentifier(identifier: string) {
    this.blockedIPs.delete(identifier);
    
    // Clear suspicious activity for this identifier
    for (const key of this.suspiciousActivity.keys()) {
      if (key.endsWith(`:${identifier}`)) {
        this.suspiciousActivity.delete(key);
      }
    }
  }

  getBlockedIdentifiers(): string[] {
    return Array.from(this.blockedIPs);
  }
}

export const advancedRateLimit = AdvancedRateLimit.getInstance();