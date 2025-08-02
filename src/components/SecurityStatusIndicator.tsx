// Security status indicator component
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, AlertTriangle, CheckCircle, Clock, Eye, EyeOff } from 'lucide-react';
import { securityMonitor } from '@/utils/security-monitoring';
import { performanceMonitor } from '@/utils/performance-monitoring';
import { threatIntelligence } from '@/utils/threat-intelligence';

const SecurityStatusIndicator = () => {
  const [securityStatus, setSecurityStatus] = useState<'secure' | 'warning' | 'critical'>('secure');
  const [eventCount, setEventCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    const updateStatus = () => {
      const recentEvents = securityMonitor.getRecentEvents(60 * 60 * 1000); // Last hour
      const criticalEvents = recentEvents.filter(e => e.severity === 'critical').length;
      const highEvents = recentEvents.filter(e => e.severity === 'high').length;
      const errors = performanceMonitor.getErrors().filter(e => e.severity === 'critical').length;

      setEventCount(recentEvents.length);
      setLastUpdate(Date.now());

      if (criticalEvents > 0 || errors > 0) {
        setSecurityStatus('critical');
      } else if (highEvents > 2 || recentEvents.length > 10) {
        setSecurityStatus('warning');
      } else {
        setSecurityStatus('secure');
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (securityStatus) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4" />;
      case 'warning':
        return <Shield className="h-4 w-4" />;
      case 'secure':
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    switch (securityStatus) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'default';
      case 'secure':
        return 'secondary';
    }
  };

  const getStatusText = () => {
    switch (securityStatus) {
      case 'critical':
        return 'Critical';
      case 'warning':
        return 'Warning';
      case 'secure':
        return 'Secure';
    }
  };

  const getDetailedStatus = () => {
    const recentEvents = securityMonitor.getRecentEvents(60 * 60 * 1000);
    const errors = performanceMonitor.getErrors();
    const threats = threatIntelligence.getAlertHistory().slice(-10);

    return {
      events: recentEvents.length,
      critical: recentEvents.filter(e => e.severity === 'critical').length,
      high: recentEvents.filter(e => e.severity === 'high').length,
      errors: errors.length,
      threats: threats.length,
      quarantined: threatIntelligence.getQuarantinedSessions().length,
    };
  };

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="ghost"
        size="sm"
        className="fixed bottom-4 right-4 z-50 bg-background/80 backdrop-blur-sm border"
      >
        <Eye className="h-4 w-4" />
      </Button>
    );
  }

  const status = getDetailedStatus();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 bg-background/95 backdrop-blur-sm border shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              {getStatusIcon()}
              Security Status
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusColor() as any}>
                {getStatusText()}
              </Badge>
              <Button
                onClick={() => setIsVisible(false)}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <EyeOff className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Events (1h):</span>
                <span>{status.events}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Critical:</span>
                <span className={status.critical > 0 ? 'text-destructive font-medium' : ''}>
                  {status.critical}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">High:</span>
                <span className={status.high > 2 ? 'text-yellow-600 font-medium' : ''}>
                  {status.high}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Errors:</span>
                <span>{status.errors}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Threats:</span>
                <span>{status.threats}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quarantined:</span>
                <span>{status.quarantined}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {new Date(lastUpdate).toLocaleTimeString()}
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Security Status Details</DialogTitle>
                    <DialogDescription>
                      Comprehensive security monitoring information
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Recent Events</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{status.events}</div>
                          <div className="text-xs text-muted-foreground">Last hour</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Critical Issues</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-destructive">{status.critical}</div>
                          <div className="text-xs text-muted-foreground">Needs attention</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Active Threats</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{status.threats}</div>
                          <div className="text-xs text-muted-foreground">Detected</div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="text-center">
                      <Button 
                        onClick={() => window.location.href = '/admin'}
                        variant="default"
                      >
                        Open Security Dashboard
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityStatusIndicator;