// Security headers and CSP management
export interface SecurityHeaders {
  contentSecurityPolicy?: string;
  xFrameOptions?: string;
  xContentTypeOptions?: string;
  xXSSProtection?: string;
  strictTransportSecurity?: string;
  referrerPolicy?: string;
  permissionsPolicy?: string;
}

export interface CSPDirectives {
  defaultSrc?: string[];
  scriptSrc?: string[];
  styleSrc?: string[];
  imgSrc?: string[];
  connectSrc?: string[];
  fontSrc?: string[];
  mediaSrc?: string[];
  frameSrc?: string[];
  objectSrc?: string[];
  childSrc?: string[];
  workerSrc?: string[];
  manifestSrc?: string[];
  formAction?: string[];
  frameAncestors?: string[];
  baseUri?: string[];
  upgradeInsecureRequests?: boolean;
  blockAllMixedContent?: boolean;
}

class SecurityHeadersManager {
  private static instance: SecurityHeadersManager;
  private cspViolations: Array<{
    violation: SecurityPolicyViolationEvent;
    timestamp: number;
  }> = [];

  private defaultCSP: CSPDirectives = {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'", // Required for some React features
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
      "https://cdnjs.cloudflare.com",
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'", // Required for styled-components and CSS-in-JS
      "https://fonts.googleapis.com",
    ],
    imgSrc: [
      "'self'",
      "data:",
      "blob:",
      "https:",
      "https://www.google-analytics.com",
    ],
    connectSrc: [
      "'self'",
      "https://tgzeogmauexqkvbsittb.supabase.co",
      "wss://tgzeogmauexqkvbsittb.supabase.co",
      "https://www.google-analytics.com",
      "https://api.github.com", // For any GitHub integrations
    ],
    fontSrc: [
      "'self'",
      "https://fonts.gstatic.com",
    ],
    mediaSrc: ["'self'", "data:", "blob:"],
    frameSrc: [
      "'self'",
      "https://www.youtube.com",
      "https://player.vimeo.com",
    ],
    objectSrc: ["'none'"],
    childSrc: ["'self'"],
    workerSrc: ["'self'", "blob:"],
    manifestSrc: ["'self'"],
    formAction: ["'self'"],
    frameAncestors: ["'none'"],
    baseUri: ["'self'"],
    upgradeInsecureRequests: true,
    blockAllMixedContent: true,
  };

  private constructor() {
    this.initializeSecurityHeaders();
    this.setupCSPViolationReporting();
  }

  static getInstance(): SecurityHeadersManager {
    if (!SecurityHeadersManager.instance) {
      SecurityHeadersManager.instance = new SecurityHeadersManager();
    }
    return SecurityHeadersManager.instance;
  }

  private initializeSecurityHeaders() {
    if (typeof document === 'undefined') return;

    // Set meta tags for security headers (backup for when server headers aren't available)
    this.setMetaHeaders();
    
    // Apply CSP if not already set by server
    if (!this.hasExistingCSP()) {
      this.applyCSP(this.defaultCSP);
    }
  }

  private setMetaHeaders() {
    const headers = [
      {
        name: 'X-Content-Type-Options',
        content: 'nosniff'
      },
      {
        name: 'X-Frame-Options',
        content: 'DENY'
      },
      {
        name: 'X-XSS-Protection',
        content: '1; mode=block'
      },
      {
        name: 'Referrer-Policy',
        content: 'strict-origin-when-cross-origin'
      },
      {
        name: 'Permissions-Policy',
        content: 'camera=(), microphone=(), geolocation=(), payment=()'
      }
    ];

    headers.forEach(header => {
      let meta = document.querySelector(`meta[http-equiv="${header.name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('http-equiv', header.name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', header.content);
    });
  }

  private hasExistingCSP(): boolean {
    // Check if CSP is already set via meta tag or if we detect CSP violations handler
    return !!(
      document.querySelector('meta[http-equiv="Content-Security-Policy"]') ||
      document.querySelector('meta[http-equiv="Content-Security-Policy-Report-Only"]')
    );
  }

  private applyCSP(directives: CSPDirectives) {
    const cspString = this.buildCSPString(directives);
    
    let meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('http-equiv', 'Content-Security-Policy');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', cspString);
  }

  private buildCSPString(directives: CSPDirectives): string {
    const cspParts: string[] = [];

    Object.entries(directives).forEach(([directive, value]) => {
      if (directive === 'upgradeInsecureRequests' && value) {
        cspParts.push('upgrade-insecure-requests');
      } else if (directive === 'blockAllMixedContent' && value) {
        cspParts.push('block-all-mixed-content');
      } else if (Array.isArray(value) && value.length > 0) {
        const kebabDirective = directive.replace(/([A-Z])/g, '-$1').toLowerCase();
        cspParts.push(`${kebabDirective} ${value.join(' ')}`);
      }
    });

    return cspParts.join('; ');
  }

  private setupCSPViolationReporting() {
    if (typeof document === 'undefined') return;

    document.addEventListener('securitypolicyviolation', (event) => {
      this.handleCSPViolation(event);
    });
  }

  private handleCSPViolation(violation: SecurityPolicyViolationEvent) {
    // Store violation for analysis
    this.cspViolations.push({
      violation,
      timestamp: Date.now()
    });

    // Keep only last 100 violations
    if (this.cspViolations.length > 100) {
      this.cspViolations = this.cspViolations.slice(-100);
    }

    // Log violation details
    const violationDetails = {
      blockedURI: violation.blockedURI,
      violatedDirective: violation.violatedDirective,
      originalPolicy: violation.originalPolicy,
      sourceFile: violation.sourceFile,
      lineNumber: violation.lineNumber,
      columnNumber: violation.columnNumber,
    };

    // Report to security monitor
    if (typeof window !== 'undefined' && (window as any).securityMonitor) {
      (window as any).securityMonitor.logEvent({
        type: 'suspicious_activity',
        severity: this.getViolationSeverity(violation),
        details: {
          reason: 'csp_violation',
          ...violationDetails
        }
      });
    }

    // Log for debugging
    console.warn('CSP Violation:', violationDetails);
  }

  private getViolationSeverity(violation: SecurityPolicyViolationEvent): 'low' | 'medium' | 'high' | 'critical' {
    // Determine severity based on violation type
    if (violation.violatedDirective.includes('script-src')) {
      return 'high'; // Script violations are serious
    }
    if (violation.violatedDirective.includes('object-src') || 
        violation.violatedDirective.includes('frame-src')) {
      return 'medium';
    }
    return 'low';
  }

  // Public methods
  updateCSP(directives: Partial<CSPDirectives>) {
    const newDirectives = { ...this.defaultCSP, ...directives };
    this.applyCSP(newDirectives);
  }

  addToDirective(directive: keyof CSPDirectives, sources: string[]) {
    const currentDirectives = { ...this.defaultCSP };
    const directiveArray = currentDirectives[directive] as string[] | undefined;
    
    if (Array.isArray(directiveArray)) {
      currentDirectives[directive] = [...directiveArray, ...sources].filter(
        (source, index, arr) => arr.indexOf(source) === index // Remove duplicates
      ) as any;
      this.applyCSP(currentDirectives);
    }
  }

  removeFromDirective(directive: keyof CSPDirectives, sources: string[]) {
    const currentDirectives = { ...this.defaultCSP };
    const directiveArray = currentDirectives[directive] as string[] | undefined;
    
    if (Array.isArray(directiveArray)) {
      currentDirectives[directive] = directiveArray.filter(
        source => !sources.includes(source)
      ) as any;
      this.applyCSP(currentDirectives);
    }
  }

  getCSPViolations(): Array<{
    violation: SecurityPolicyViolationEvent;
    timestamp: number;
  }> {
    return [...this.cspViolations];
  }

  clearViolations() {
    this.cspViolations = [];
  }

  // CSRF Protection utilities
  generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  setCSRFToken(token: string) {
    // Store in multiple places for reliability
    sessionStorage.setItem('csrf_token', token);
    
    // Also set as meta tag for easy access
    let meta = document.querySelector('meta[name="csrf-token"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'csrf-token');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', token);
  }

  getCSRFToken(): string | null {
    // Try to get from session storage first
    let token = sessionStorage.getItem('csrf_token');
    
    // Fallback to meta tag
    if (!token) {
      const meta = document.querySelector('meta[name="csrf-token"]');
      token = meta?.getAttribute('content') || null;
    }

    return token;
  }

  validateCSRFToken(submittedToken: string): boolean {
    const storedToken = this.getCSRFToken();
    return storedToken === submittedToken && storedToken !== null;
  }

  // Content sanitization
  sanitizeHTML(html: string): string {
    // Basic HTML sanitization - remove script tags and dangerous attributes
    return html
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/<object[^>]*>.*?<\/object>/gi, '')
      .replace(/<embed[^>]*>.*?<\/embed>/gi, '');
  }

  sanitizeURL(url: string): string {
    try {
      const parsed = new URL(url);
      // Only allow http/https protocols
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return '';
      }
      return parsed.toString();
    } catch {
      return '';
    }
  }
}

export const securityHeaders = SecurityHeadersManager.getInstance();
