import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft, Search, Mail, RefreshCw, HelpCircle } from 'lucide-react';
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';

const NotFound = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Track 404 errors for analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_not_found', {
        page_path: location.pathname,
        page_title: 'Page Not Found'
      });
    }
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, this would integrate with your search functionality
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="max-w-2xl mx-auto shadow-xl">
              <CardContent className="p-12">
                {/* Animated 404 Number */}
                <motion.div 
                  className="mb-8"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h1 className="text-9xl font-bold text-primary/20 leading-none relative">
                    404
                    <motion.div
                      className="absolute inset-0 text-primary/10"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.2, 0.4, 0.2]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      404
                    </motion.div>
                  </h1>
                </motion.div>
                
                {/* Error Message */}
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-3xl font-bold mb-4">
                    Oops! Page Not Found
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    The page you're looking for doesn't exist or has been moved. 
                    Don't worry, let's get you back on track!
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Attempted to access: <code className="bg-muted px-2 py-1 rounded font-mono">{location.pathname}</code>
                  </p>
                  
                  {/* Search Form */}
                  <form onSubmit={handleSearch} className="max-w-md mx-auto mb-6">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search our site..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <Button type="submit" size="sm" disabled={!searchQuery.trim()}>
                        Search
                      </Button>
                    </div>
                  </form>
                </motion.div>
              
                {/* Action Buttons */}
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button 
                    asChild 
                    size="lg"
                    className="gap-2"
                    aria-label="Return to homepage"
                  >
                    <Link to="/">
                      <Home className="h-4 w-4" />
                      Back to Home
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="gap-2"
                    aria-label="Go back to previous page"
                    onClick={() => window.history.back()}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Go Back
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="gap-2"
                    aria-label="Refresh page"
                    onClick={() => window.location.reload()}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                </motion.div>
                
                {/* Quick Actions */}
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button asChild variant="outline" className="gap-2">
                    <Link to="/contact">
                      <Mail className="h-4 w-4" />
                      Contact Support
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="gap-2">
                    <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">
                      <HelpCircle className="h-4 w-4" />
                      Site Map
                    </a>
                  </Button>
                </motion.div>
              
                {/* Helpful Links */}
                <motion.div 
                  className="pt-8 border-t border-border"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <h3 className="text-lg font-semibold mb-4">
                    Popular Pages
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <Link 
                      to="/services" 
                      className="text-primary hover:text-primary/80 transition-colors hover:underline p-2 rounded hover:bg-primary/5"
                      aria-label="View our services"
                    >
                      Our Services
                    </Link>
                    <Link 
                      to="/portfolio" 
                      className="text-primary hover:text-primary/80 transition-colors hover:underline p-2 rounded hover:bg-primary/5"
                      aria-label="View our portfolio"
                    >
                      Portfolio
                    </Link>
                    <Link 
                      to="/about" 
                      className="text-primary hover:text-primary/80 transition-colors hover:underline p-2 rounded hover:bg-primary/5"
                      aria-label="Learn about us"
                    >
                      About Us
                    </Link>
                    <Link 
                      to="/blog" 
                      className="text-primary hover:text-primary/80 transition-colors hover:underline p-2 rounded hover:bg-primary/5"
                      aria-label="Read our blog"
                    >
                      Blog
                    </Link>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
