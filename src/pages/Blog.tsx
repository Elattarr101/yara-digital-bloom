import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, ArrowRight, Search, User } from 'lucide-react';

const Blog = () => {
  const featuredPost = {
    title: 'The Future of Digital Marketing: AI and Automation Trends for 2024',
    excerpt: 'Discover how artificial intelligence and marketing automation are reshaping the digital landscape and what it means for your business strategy.',
    author: 'Sarah Johnson',
    date: 'December 15, 2024',
    readTime: '8 min read',
    category: 'Strategy',
    image: 'gradient-from-purple-600-to-blue-600'
  };

  const blogPosts = [
    {
      title: 'How to Optimize Your Website for Voice Search in 2024',
      excerpt: 'Voice search is changing how people find information online. Learn the strategies to optimize your content for voice queries.',
      author: 'Michael Chen',
      date: 'December 12, 2024',
      readTime: '6 min read',
      category: 'SEO',
      image: 'gradient-from-blue-500-to-teal-500'
    },
    {
      title: 'Social Media ROI: Measuring What Actually Matters',
      excerpt: 'Beyond likes and follows - discover the metrics that truly indicate social media success and drive business growth.',
      author: 'Emily Rodriguez',
      date: 'December 10, 2024',
      readTime: '5 min read',
      category: 'Social Media',
      image: 'gradient-from-pink-500-to-rose-500'
    },
    {
      title: 'Email Marketing Automation That Converts',
      excerpt: 'Build email sequences that nurture leads and drive sales with our proven automation strategies and templates.',
      author: 'David Kim',
      date: 'December 8, 2024',
      readTime: '7 min read',
      category: 'Email Marketing',
      image: 'gradient-from-orange-500-to-red-500'
    },
    {
      title: 'The Complete Guide to Google Ads Optimization',
      excerpt: 'Maximize your ad spend efficiency with advanced bidding strategies, keyword research, and campaign optimization techniques.',
      author: 'Sarah Johnson',
      date: 'December 5, 2024',
      readTime: '10 min read',
      category: 'PPC',
      image: 'gradient-from-green-500-to-blue-500'
    },
    {
      title: 'Content Marketing Trends That Will Dominate 2024',
      excerpt: 'Stay ahead of the curve with emerging content formats, distribution strategies, and engagement tactics.',
      author: 'Michael Chen',
      date: 'December 3, 2024',
      readTime: '6 min read',
      category: 'Content Marketing',
      image: 'gradient-from-indigo-500-to-purple-500'
    },
    {
      title: 'Local SEO Strategies for Multi-Location Businesses',
      excerpt: 'Scale your local search presence across multiple locations with proven strategies and best practices.',
      author: 'Emily Rodriguez',
      date: 'December 1, 2024',
      readTime: '8 min read',
      category: 'Local SEO',
      image: 'gradient-from-yellow-500-to-orange-500'
    }
  ];

  const categories = ['All', 'Strategy', 'SEO', 'Social Media', 'Email Marketing', 'PPC', 'Content Marketing', 'Local SEO'];

  return (
    <Layout>
      <HeroSection
        title="Marketing Insights & Industry Trends"
        subtitle="Stay ahead of the curve with expert insights, proven strategies, and the latest trends in digital marketing from our team of specialists."
        variant="minimal"
        primaryCTA="Subscribe to Newsletter"
        secondaryCTA="Browse Categories"
      />

      {/* Search and Categories */}
      <section className="py-8 bg-muted/20">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search articles..."
                className="pl-10"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button key={category} variant="outline" size="sm" className="hover:bg-secondary hover:text-secondary-foreground">
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Featured Article</h2>
            <Card className="overflow-hidden border-0 shadow-large hover:shadow-large transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image */}
                <div className={`h-64 lg:h-auto bg-${featuredPost.image} relative`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-secondary/80 flex items-center justify-center">
                    <div className="text-center text-white p-8">
                      <Badge className="mb-4 bg-white/20 text-white">{featuredPost.category}</Badge>
                      <h3 className="text-2xl font-bold">Featured</h3>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                  <Badge variant="secondary" className="w-fit mb-4">{featuredPost.category}</Badge>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight">{featuredPost.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{featuredPost.excerpt}</p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User size={16} />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={16} />
                        <span>{featuredPost.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={16} />
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-fit group">
                    Read Full Article
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Latest Articles
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Expert insights and actionable strategies to help you grow your business through better marketing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card key={index} className="group overflow-hidden border-0 shadow-soft hover:shadow-large transition-all duration-300 hover:-translate-y-2">
                {/* Image */}
                <div className={`h-48 bg-${post.image} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/60 to-secondary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Badge className="absolute top-4 left-4 bg-white/90 text-primary">{post.category}</Badge>
                </div>

                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3 leading-tight group-hover:text-secondary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center space-x-2">
                      <User size={14} />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock size={14} />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                    <Button variant="ghost" size="sm" className="p-0 h-auto hover:text-secondary">
                      Read More
                      <ArrowRight size={14} className="ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Never Miss a Marketing Insight
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Get the latest marketing strategies, industry trends, and expert tips delivered straight to your inbox every week.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 flex-1"
              />
              <Button variant="secondary" size="lg" className="px-8">
                Subscribe
              </Button>
            </form>
            
            <p className="text-sm text-primary-foreground/70 mt-4">
              Join 5,000+ marketers who read our weekly newsletter. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;