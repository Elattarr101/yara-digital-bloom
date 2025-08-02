// Threat intelligence and automated security responses
export interface ThreatSignature {
  id: string;
  name: string;
  pattern: RegExp | string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  mitigation: string;
  enabled: boolean;
  lastUpdated: number;
}

export interface SecurityPolicy {
  id: string;
  name: string;
  rules: SecurityRule[];
  enabled: boolean;
  priority: number;
}

export interface SecurityRule {
  id: string;
  condition: string;
  action: 'block' | 'alert' | 'rate_limit' | 'quarantine';
  parameters: Record<string, any>;
}

class ThreatIntelligence {
  private static instance: ThreatIntelligence;
  private signatures: Map<string, ThreatSignature> = new Map();
  private policies: Map<string, SecurityPolicy> = new Map();
  private quarantinedSessions = new Set<string>();
  private alertHistory: Array<{
    timestamp: number;
    signature: string;
    severity: string;
    details: any;
  }> = [];

  private constructor() {
    this.initializeDefaultSignatures();
    this.initializeDefaultPolicies();
    this.startThreatDetection();
  }

  static getInstance(): ThreatIntelligence {
    if (!ThreatIntelligence.instance) {
      ThreatIntelligence.instance = new ThreatIntelligence();
    }
    return ThreatIntelligence.instance;
  }

  private initializeDefaultSignatures() {
    const defaultSignatures: ThreatSignature[] = [
      {
        id: 'sql_injection_basic',
        name: 'SQL Injection Pattern',
        pattern: /(union\s+select|select\s+\*\s+from|drop\s+table|insert\s+into|delete\s+from)/i,
        severity: 'high',
        description: 'Detects common SQL injection patterns',
        mitigation: 'Input validation and parameterized queries',
        enabled: true,
        lastUpdated: Date.now()
      },
      {
        id: 'xss_script_tag',
        name: 'XSS Script Tag',
        pattern: /<script[^>]*>.*?<\/script>/gi,
        severity: 'high',
        description: 'Detects script tag injection attempts',
        mitigation: 'HTML encoding and CSP enforcement',
        enabled: true,
        lastUpdated: Date.now()
      },
      {
        id: 'path_traversal',
        name: 'Path Traversal',
        pattern: /(\.\.|%2e%2e|\.\.%2f|%2e%2e%2f)/i,
        severity: 'medium',
        description: 'Detects directory traversal attempts',
        mitigation: 'Path validation and sandboxing',
        enabled: true,
        lastUpdated: Date.now()
      },
      {
        id: 'command_injection',
        name: 'Command Injection',
        pattern: /(\||\|\||&|&&|;|`|\$\(|\${)/,
        severity: 'critical',
        description: 'Detects command injection attempts',
        mitigation: 'Input sanitization and command escaping',
        enabled: true,
        lastUpdated: Date.now()
      },
      {
        id: 'credential_stuffing',
        name: 'Credential Stuffing',
        pattern: 'multiple_failed_logins_rapid',
        severity: 'high',
        description: 'Detects rapid login attempts from same source',
        mitigation: 'Rate limiting and CAPTCHA',
        enabled: true,
        lastUpdated: Date.now()
      },
      {
        id: 'bot_detection',
        name: 'Bot Activity',
        pattern: 'automated_behavior_pattern',
        severity: 'medium',
        description: 'Detects automated bot behavior',
        mitigation: 'CAPTCHA and behavioral analysis',
        enabled: true,
        lastUpdated: Date.now()
      }
    ];

    defaultSignatures.forEach(sig => {
      this.signatures.set(sig.id, sig);
    });
  }

  private initializeDefaultPolicies() {
    const defaultPolicies: SecurityPolicy[] = [
      {
        id: 'critical_threat_response',
        name: 'Critical Threat Auto-Response',
        rules: [
          {
            id: 'block_critical',
            condition: 'severity === "critical"',
            action: 'block',
            parameters: { duration: 24 * 60 * 60 * 1000 } // 24 hours
          }
        ],
        enabled: true,
        priority: 1
      },
      {
        id: 'high_threat_response',
        name: 'High Threat Response',
        rules: [
          {
            id: 'rate_limit_high',
            condition: 'severity === "high" && count > 3',
            action: 'rate_limit',
            parameters: { maxRequests: 1, windowMs: 60000 } // 1 request per minute
          }
        ],
        enabled: true,
        priority: 2
      },
      {
        id: 'suspicious_activity',
        name: 'Suspicious Activity Monitoring',
        rules: [
          {
            id: 'quarantine_suspicious',
            condition: 'type === "suspicious_activity" && count > 5',
            action: 'quarantine',
            parameters: { duration: 60 * 60 * 1000 } // 1 hour
          }
        ],
        enabled: true,
        priority: 3
      }
    ];

    defaultPolicies.forEach(policy => {
      this.policies.set(policy.id, policy);
    });
  }

  private startThreatDetection() {
    if (typeof window === 'undefined') return;

    // Listen for security events from security monitor
    window.addEventListener('analytics-config-changed', () => {
      // Reinitialize threat detection when analytics config changes
      this.updateThreatDetection();
    });

    // Periodic threat assessment
    setInterval(() => {
      this.performThreatAssessment();
    }, 30000); // Every 30 seconds
  }

  private updateThreatDetection() {
    // Update threat detection based on current security configuration
    console.log('Threat detection updated based on configuration changes');
  }

  private performThreatAssessment() {
    if (typeof window === 'undefined' || !(window as any).securityMonitor) return;

    const securityMonitor = (window as any).securityMonitor;
    const recentEvents = securityMonitor.getRecentEvents(5 * 60 * 1000); // Last 5 minutes

    // Analyze event patterns
    const eventCounts = new Map<string, number>();
    const severityCounts = new Map<string, number>();

    recentEvents.forEach((event: any) => {
      const eventType = event.type;
      const severity = event.severity;

      eventCounts.set(eventType, (eventCounts.get(eventType) || 0) + 1);
      severityCounts.set(severity, (severityCounts.get(severity) || 0) + 1);
    });

    // Check for threat patterns
    this.evaluateThreatPatterns(eventCounts, severityCounts);
  }

  private evaluateThreatPatterns(eventCounts: Map<string, number>, severityCounts: Map<string, number>) {
    // Detect coordinated attacks
    if (eventCounts.get('failed_login') && eventCounts.get('failed_login')! > 10) {
      this.triggerSecurityResponse('credential_stuffing', {
        eventCount: eventCounts.get('failed_login'),
        timeWindow: '5_minutes'
      });
    }

    // Detect scanning attempts
    if (eventCounts.get('suspicious_activity') && eventCounts.get('suspicious_activity')! > 5) {
      this.triggerSecurityResponse('scanning_detected', {
        eventCount: eventCounts.get('suspicious_activity'),
        timeWindow: '5_minutes'
      });
    }

    // Detect mass exploitation attempts
    const totalCritical = severityCounts.get('critical') || 0;
    const totalHigh = severityCounts.get('high') || 0;
    
    if (totalCritical + totalHigh > 10) {
      this.triggerSecurityResponse('mass_exploitation', {
        criticalEvents: totalCritical,
        highEvents: totalHigh,
        timeWindow: '5_minutes'
      });
    }
  }

  private triggerSecurityResponse(threatType: string, details: any) {
    // Log the threat
    this.alertHistory.push({
      timestamp: Date.now(),
      signature: threatType,
      severity: 'high',
      details
    });

    // Execute security policies
    for (const [policyId, policy] of this.policies.entries()) {
      if (!policy.enabled) continue;

      for (const rule of policy.rules) {
        if (this.evaluateCondition(rule.condition, { threatType, details })) {
          this.executeSecurityAction(rule.action, rule.parameters, threatType);
        }
      }
    }

    // Report to security monitor
    if (typeof window !== 'undefined' && (window as any).securityMonitor) {
      (window as any).securityMonitor.logEvent({
        type: 'suspicious_activity',
        severity: 'critical',
        details: {
          reason: 'automated_threat_response',
          threatType,
          ...details
        }
      });
    }
  }

  private evaluateCondition(condition: string, context: any): boolean {
    try {
      // Simple condition evaluation (in production, use a proper expression parser)
      const func = new Function('context', `
        const { threatType, details } = context;
        const severity = details.severity || 'medium';
        const count = details.eventCount || details.criticalEvents || details.highEvents || 0;
        const type = threatType;
        
        return ${condition};
      `);
      
      return func(context);
    } catch (error) {
      console.error('Error evaluating security condition:', error);
      return false;
    }
  }

  private executeSecurityAction(action: string, parameters: any, threatType: string) {
    switch (action) {
      case 'block':
        this.blockThreat(threatType, parameters);
        break;
      case 'rate_limit':
        this.applyRateLimit(threatType, parameters);
        break;
      case 'quarantine':
        this.quarantineSession(threatType, parameters);
        break;
      case 'alert':
        this.sendAlert(threatType, parameters);
        break;
    }
  }

  private blockThreat(threatType: string, parameters: any) {
    // Add to blocked list
    if (typeof window !== 'undefined' && (window as any).advancedRateLimit) {
      const sessionId = this.getCurrentSessionId();
      if (sessionId) {
        (window as any).advancedRateLimit.blockIdentifier(sessionId);
      }
    }

    console.warn(`Threat blocked: ${threatType}`, parameters);
  }

  private applyRateLimit(threatType: string, parameters: any) {
    // Apply additional rate limiting
    if (typeof window !== 'undefined' && (window as any).advancedRateLimit) {
      const sessionId = this.getCurrentSessionId();
      if (sessionId) {
        // Temporarily reduce rate limits for this session
        // Implementation would depend on the specific rate limiting system
      }
    }

    console.warn(`Rate limit applied for threat: ${threatType}`, parameters);
  }

  private quarantineSession(threatType: string, parameters: any) {
    const sessionId = this.getCurrentSessionId();
    if (sessionId) {
      this.quarantinedSessions.add(sessionId);
      
      // Auto-remove after duration
      setTimeout(() => {
        this.quarantinedSessions.delete(sessionId);
      }, parameters.duration || 60 * 60 * 1000); // Default 1 hour
    }

    console.warn(`Session quarantined for threat: ${threatType}`, parameters);
  }

  private sendAlert(threatType: string, parameters: any) {
    // Send alert to administrators
    console.error(`Security Alert: ${threatType}`, parameters);
    
    // In production, this would send notifications to administrators
    if (typeof window !== 'undefined') {
      // Could show a toast notification or send to a monitoring service
    }
  }

  private getCurrentSessionId(): string | null {
    if (typeof window !== 'undefined' && (window as any).securityMonitor) {
      const events = (window as any).securityMonitor.getAllEvents();
      return events.length > 0 ? events[0].sessionId : null;
    }
    return null;
  }

  // Public methods
  scanContent(content: string): Array<{ signature: ThreatSignature; matches: string[] }> {
    const threats: Array<{ signature: ThreatSignature; matches: string[] }> = [];

    for (const [signatureId, signature] of this.signatures.entries()) {
      if (!signature.enabled) continue;

      const pattern = signature.pattern;
      let matches: string[] = [];

      if (pattern instanceof RegExp) {
        const regexMatches = content.match(pattern);
        if (regexMatches) {
          matches = regexMatches;
        }
      } else if (typeof pattern === 'string') {
        // Handle string patterns (custom logic)
        if (this.evaluateStringPattern(pattern, content)) {
          matches = [pattern];
        }
      }

      if (matches.length > 0) {
        threats.push({ signature, matches });
      }
    }

    return threats;
  }

  private evaluateStringPattern(pattern: string, content: string): boolean {
    // Custom pattern evaluation logic
    switch (pattern) {
      case 'multiple_failed_logins_rapid':
        // This would be evaluated based on recent security events
        return false; // Placeholder
      case 'automated_behavior_pattern':
        // This would be evaluated based on user interaction patterns
        return false; // Placeholder
      default:
        return content.includes(pattern);
    }
  }

  addSignature(signature: ThreatSignature) {
    this.signatures.set(signature.id, signature);
  }

  removeSignature(signatureId: string) {
    this.signatures.delete(signatureId);
  }

  updateSignature(signatureId: string, updates: Partial<ThreatSignature>) {
    const existing = this.signatures.get(signatureId);
    if (existing) {
      this.signatures.set(signatureId, { ...existing, ...updates, lastUpdated: Date.now() });
    }
  }

  getSignatures(): ThreatSignature[] {
    return Array.from(this.signatures.values());
  }

  addPolicy(policy: SecurityPolicy) {
    this.policies.set(policy.id, policy);
  }

  removePolicy(policyId: string) {
    this.policies.delete(policyId);
  }

  getPolicies(): SecurityPolicy[] {
    return Array.from(this.policies.values());
  }

  getAlertHistory(): Array<{
    timestamp: number;
    signature: string;
    severity: string;
    details: any;
  }> {
    return [...this.alertHistory];
  }

  isSessionQuarantined(sessionId?: string): boolean {
    const checkSessionId = sessionId || this.getCurrentSessionId();
    return checkSessionId ? this.quarantinedSessions.has(checkSessionId) : false;
  }

  clearQuarantine(sessionId: string) {
    this.quarantinedSessions.delete(sessionId);
  }

  getQuarantinedSessions(): string[] {
    return Array.from(this.quarantinedSessions);
  }
}

export const threatIntelligence = ThreatIntelligence.getInstance();