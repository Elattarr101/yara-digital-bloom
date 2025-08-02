// Security dashboard component for monitoring
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Clock, 
  Users, 
  Ban,
  Eye,
  TrendingUp,
  Zap,
  Globe
} from 'lucide-react';
import { securityMonitor, type SecurityEvent } from '@/utils/security-monitoring';
import { advancedRateLimit } from '@/utils/advanced-rate-limiting';
import { performanceMonitor, type ErrorReport } from '@/utils/performance-monitoring';
import { securityHeaders } from '@/utils/security-headers';

const SecurityDashboard = () => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [errors, setErrors] = useState<ErrorReport[]>([]);
  const [cspViolations, setCspViolations] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadData = () => {
      setSecurityEvents(securityMonitor.getAllEvents());
      setErrors(performanceMonitor.getErrors());
      setCspViolations(securityHeaders.getCSPViolations());
    };

    loadData();
    const interval = setInterval(loadData, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [refreshKey]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': 
      case 'high': 
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium': 
        return <Shield className="h-4 w-4" />;
      case 'low': 
        return <Eye className="h-4 w-4" />;
      default: 
        return <Activity className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getRecentEvents = (hours: number = 24) => {
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    return securityEvents.filter(event => event.timestamp > cutoff);
  };

  const getEventStats = () => {
    const recent = getRecentEvents();
    const stats = {
      total: recent.length,
      critical: recent.filter(e => e.severity === 'critical').length,
      high: recent.filter(e => e.severity === 'high').length,
      medium: recent.filter(e => e.severity === 'medium').length,
      low: recent.filter(e => e.severity === 'low').length,
    };
    return stats;
  };

  const getRateLimitStats = () => {
    return {
      contactForm: advancedRateLimit.getStats('contact_form'),
      loginAttempts: advancedRateLimit.getStats('login_attempts'),
      apiRequests: advancedRateLimit.getStats('api_requests'),
      blocked: advancedRateLimit.getBlockedIdentifiers().length,
    };
  };

  const stats = getEventStats();
  const rateLimitStats = getRateLimitStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Security Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor security events, performance, and threats in real-time
          </p>
        </div>
        <Button 
          onClick={() => setRefreshKey(prev => prev + 1)}
          variant="outline"
          size="sm"
        >
          <Activity className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events (24h)</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.critical + stats.high} high priority events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Limit Violations</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rateLimitStats.contactForm.violations + rateLimitStats.loginAttempts.violations}
            </div>
            <p className="text-xs text-muted-foreground">
              {rateLimitStats.blocked} blocked identifiers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Application Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errors.length}</div>
            <p className="text-xs text-muted-foreground">
              {errors.filter(e => e.severity === 'critical').length} critical errors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CSP Violations</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cspViolations.length}</div>
            <p className="text-xs text-muted-foreground">
              Content Security Policy violations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* High Priority Alerts */}
      {(stats.critical > 0 || stats.high > 0) && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Security Alert:</strong> {stats.critical + stats.high} high-priority security events detected in the last 24 hours.
            Immediate attention recommended.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="errors">Application Errors</TabsTrigger>
          <TabsTrigger value="rate-limits">Rate Limiting</TabsTrigger>
          <TabsTrigger value="csp">CSP Violations</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>
                Latest security events and threats detected by the monitoring system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityEvents.slice(0, 20).map((event) => (
                  <div key={event.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      {getSeverityIcon(event.severity)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant={getSeverityColor(event.severity) as any}>
                            {event.severity}
                          </Badge>
                          <Badge variant="outline">
                            {event.type.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatTimestamp(event.timestamp)}
                        </span>
                      </div>
                      <div className="text-sm">
                        <strong>Details:</strong> {JSON.stringify(event.details, null, 2)}
                      </div>
                      {event.metadata.page && (
                        <div className="text-xs text-muted-foreground">
                          Page: {event.metadata.page}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {securityEvents.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No security events recorded yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors">
          <Card>
            <CardHeader>
              <CardTitle>Application Errors</CardTitle>
              <CardDescription>
                JavaScript errors, promise rejections, and resource loading failures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {errors.slice(0, 20).map((error) => (
                  <div key={error.id} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant={getSeverityColor(error.severity) as any}>
                          {error.severity}
                        </Badge>
                        <Badge variant="outline">
                          {error.type}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatTimestamp(error.timestamp)}
                      </span>
                    </div>
                    <div className="text-sm">
                      <strong>Message:</strong> {error.message}
                    </div>
                    {error.filename && (
                      <div className="text-xs text-muted-foreground">
                        File: {error.filename}:{error.lineno}:{error.colno}
                      </div>
                    )}
                    {error.stack && (
                      <details className="text-xs">
                        <summary className="cursor-pointer text-muted-foreground">
                          Stack trace
                        </summary>
                        <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                          {error.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
                {errors.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No errors recorded yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rate-limits">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Rate Limit Statistics</CardTitle>
                <CardDescription>
                  Current rate limiting status across different endpoints
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Contact Form</span>
                    <span className="text-sm text-muted-foreground">
                      {rateLimitStats.contactForm.totalRequests} requests
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Login Attempts</span>
                    <span className="text-sm text-muted-foreground">
                      {rateLimitStats.loginAttempts.totalRequests} attempts
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">API Requests</span>
                    <span className="text-sm text-muted-foreground">
                      {rateLimitStats.apiRequests.totalRequests} requests
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Blocked Identifiers</CardTitle>
                <CardDescription>
                  Currently blocked IPs and identifiers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {advancedRateLimit.getBlockedIdentifiers().map((identifier, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm font-mono">{identifier}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          advancedRateLimit.unblockIdentifier(identifier);
                          setRefreshKey(prev => prev + 1);
                        }}
                      >
                        Unblock
                      </Button>
                    </div>
                  ))}
                  {advancedRateLimit.getBlockedIdentifiers().length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                      No blocked identifiers
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="csp">
          <Card>
            <CardHeader>
              <CardTitle>Content Security Policy Violations</CardTitle>
              <CardDescription>
                Violations of the Content Security Policy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cspViolations.slice(0, 20).map((violation, index) => (
                  <div key={index} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="destructive">CSP Violation</Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatTimestamp(violation.timestamp)}
                      </span>
                    </div>
                    <div className="text-sm space-y-1">
                      <div><strong>Blocked URI:</strong> {violation.violation.blockedURI}</div>
                      <div><strong>Violated Directive:</strong> {violation.violation.violatedDirective}</div>
                      {violation.violation.sourceFile && (
                        <div><strong>Source:</strong> {violation.violation.sourceFile}:{violation.violation.lineNumber}</div>
                      )}
                    </div>
                  </div>
                ))}
                {cspViolations.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No CSP violations recorded
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityDashboard;