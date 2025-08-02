import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Cookie, Settings, Shield, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const COOKIE_CONSENT_KEY = 'cookie-consent';
const COOKIE_PREFERENCES_KEY = 'cookie-preferences';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 2000);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    setShowBanner(false);
    setShowDetails(false);

    // Initialize analytics if consented
    if (prefs.analytics && typeof window !== 'undefined') {
      // Initialize analytics here
      import('../utils/analytics').then(({ analytics }) => {
        analytics.init('GA_MEASUREMENT_ID'); // Replace with your actual GA ID
      });
    }

    // Track consent choice
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'cookie_consent', {
        analytics: prefs.analytics,
        marketing: prefs.marketing,
        preferences: prefs.preferences,
      });
    }
  };

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    });
  };

  const acceptNecessary = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    });
  };

  const saveCustom = () => {
    saveConsent(preferences);
  };

  const cookieTypes = [
    {
      key: 'necessary' as keyof CookiePreferences,
      title: 'Necessary Cookies',
      description: 'Essential for the website to function properly. Cannot be disabled.',
      icon: Shield,
      required: true,
    },
    {
      key: 'analytics' as keyof CookiePreferences,
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website.',
      icon: Info,
      required: false,
    },
    {
      key: 'marketing' as keyof CookiePreferences,
      title: 'Marketing Cookies',
      description: 'Used to track visitors across websites for advertising purposes.',
      icon: Cookie,
      required: false,
    },
    {
      key: 'preferences' as keyof CookiePreferences,
      title: 'Preference Cookies',
      description: 'Remember your preferences and settings for a better experience.',
      icon: Settings,
      required: false,
    },
  ];

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center p-4"
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-2xl"
        >
          <Card className="shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Cookie className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Cookie Preferences</h3>
                    <p className="text-sm text-muted-foreground">
                      We use cookies to enhance your experience
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBanner(false)}
                  aria-label="Close cookie banner"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {!showDetails ? (
                // Simple banner
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    We use cookies and similar technologies to provide the best experience on our website. 
                    Some are necessary for functionality, while others help us improve performance and 
                    understand how you use our site.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={acceptAll} size="sm" className="flex-1">
                      Accept All
                    </Button>
                    <Button 
                      onClick={acceptNecessary} 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                    >
                      Necessary Only
                    </Button>
                    <Button 
                      onClick={() => setShowDetails(true)} 
                      variant="ghost" 
                      size="sm"
                      className="flex-1"
                    >
                      Customize
                    </Button>
                  </div>
                </div>
              ) : (
                // Detailed preferences
                <div className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Choose which cookies you want to allow. You can change these settings at any time.
                  </p>

                  <div className="space-y-4">
                    {cookieTypes.map(({ key, title, description, icon: Icon, required }) => (
                      <div 
                        key={key}
                        className="flex items-start gap-4 p-4 border border-border rounded-lg"
                      >
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{title}</h4>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={preferences[key]}
                                disabled={required}
                                onChange={(e) => setPreferences(prev => ({
                                  ...prev,
                                  [key]: e.target.checked
                                }))}
                                className="sr-only"
                              />
                              <div className={`
                                w-11 h-6 rounded-full relative transition-colors duration-200
                                ${preferences[key] ? 'bg-primary' : 'bg-muted'}
                                ${required ? 'opacity-50' : ''}
                              `}>
                                <div className={`
                                  absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
                                  ${preferences[key] ? 'translate-x-5' : 'translate-x-0.5'}
                                `} />
                              </div>
                            </label>
                          </div>
                          <p className="text-sm text-muted-foreground">{description}</p>
                          {required && (
                            <p className="text-xs text-primary mt-1">Required</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                    <Button onClick={saveCustom} size="sm" className="flex-1">
                      Save Preferences
                    </Button>
                    <Button 
                      onClick={acceptAll} 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                    >
                      Accept All
                    </Button>
                    <Button 
                      onClick={() => setShowDetails(false)} 
                      variant="ghost" 
                      size="sm"
                    >
                      Back
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Learn more about our use of cookies in our{' '}
                  <a 
                    href="/privacy-policy" 
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                  {' '}and{' '}
                  <a 
                    href="/cookie-policy" 
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cookie Policy
                  </a>
                  .
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieConsent;