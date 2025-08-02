import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft, Search, Mail } from 'lucide-react';
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import SEO from '@/components/SEO';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <SEO
        title="Page Not Found - 404 Error | Yara Digital Marketing Agency"
        description="The page you're looking for doesn't exist. Browse our digital marketing services, portfolio, or contact us for help finding what you need."
        keywords="404 error, page not found"
        url={`https://yourdomain.com${location.pathname}`}
      />
      
      <div className="min-h-screen flex items-center justify-center py-16">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-2xl mx-auto shadow-xl">
            <CardContent className="p-12">
              {/* 404 Number */}
              <div className="mb-8">
                <h1 className="text-9xl font-bold text-primary/20 leading-none">
                  404
                </h1>
              </div>
              
              {/* Error Message */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">
                  Oops! Page Not Found
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  The page you're looking for doesn't exist or has been moved. 
                  Don't worry, let's get you back on track!
                </p>
                <p className="text-sm text-muted-foreground">
                  Attempted to access: <code className="bg-muted px-2 py-1 rounded">{location.pathname}</code>
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  asChild 
                  size="lg"
                  className="gap-2"
                  aria-label="Return to homepage"
                >
                  <a href="/">
                    <Home className="h-4 w-4" />
                    Back to Home
                  </a>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="gap-2"
                  aria-label="Go back to previous page"
                >
                  <button onClick={() => window.history.back()}>
                    <ArrowLeft className="h-4 w-4" />
                    Go Back
                  </button>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="gap-2"
                  aria-label="Contact us for help"
                >
                  <a href="/contact">
                    <Mail className="h-4 w-4" />
                    Contact Us
                  </a>
                </Button>
              </div>
              
              {/* Helpful Links */}
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="text-lg font-semibold mb-4">
                  Popular Pages
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <a 
                    href="/services" 
                    className="text-primary hover:text-primary/80 transition-colors hover:underline"
                    aria-label="View our services"
                  >
                    Our Services
                  </a>
                  <a 
                    href="/portfolio" 
                    className="text-primary hover:text-primary/80 transition-colors hover:underline"
                    aria-label="View our portfolio"
                  >
                    Portfolio
                  </a>
                  <a 
                    href="/about" 
                    className="text-primary hover:text-primary/80 transition-colors hover:underline"
                    aria-label="Learn about us"
                  >
                    About Us
                  </a>
                  <a 
                    href="/blog" 
                    className="text-primary hover:text-primary/80 transition-colors hover:underline"
                    aria-label="Read our blog"
                  >
                    Blog
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
