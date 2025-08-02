import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, TrendingUp, Users, Award } from 'lucide-react';

const Portfolio = () => {
  const projects = [
    {
      title: 'TechFlow Solutions',
      category: 'B2B SaaS',
      description: 'Complete digital transformation for a growing software company, including website redesign, SEO optimization, and lead generation campaigns.',
      results: [
        '300% increase in organic traffic',
        '150% boost in qualified leads',
        '45% improvement in conversion rate'
      ],
      tags: ['SEO', 'Web Design', 'Lead Generation'],
      image: 'gradient-from-blue-500-to-purple-600'
    },
    {
      title: 'GreenEarth Cosmetics',
      category: 'E-commerce',
      description: 'Social media marketing and influencer campaigns for sustainable beauty brand targeting millennials and Gen Z consumers.',
      results: [
        '250% growth in social following',
        '180% increase in online sales',
        '500K+ campaign impressions'
      ],
      tags: ['Social Media', 'Influencer Marketing', 'E-commerce'],
      image: 'gradient-from-green-400-to-blue-500'
    },
    {
      title: 'UrbanFit Gyms',
      category: 'Local Business',
      description: 'Local SEO and Google Ads campaigns to drive membership growth across 5 gym locations in major metropolitan areas.',
      results: [
        '200% increase in local search visibility',
        '120% growth in new memberships',
        '60% reduction in cost per acquisition'
      ],
      tags: ['Local SEO', 'Google Ads', 'Conversion Optimization'],
      image: 'gradient-from-orange-400-to-red-500'
    },
    {
      title: 'InnovateLegal',
      category: 'Professional Services',
      description: 'Content marketing and thought leadership strategy for a boutique law firm specializing in technology and startup law.',
      results: [
        '400% increase in website traffic',
        '80% more consultation requests',
        '15 published industry articles'
      ],
      tags: ['Content Marketing', 'SEO', 'Thought Leadership'],
      image: 'gradient-from-purple-500-to-pink-500'
    },
    {
      title: 'FreshMeal Delivery',
      category: 'Food & Beverage',
      description: 'Multi-channel digital marketing campaign for meal delivery startup targeting health-conscious urban professionals.',
      results: [
        '500% increase in app downloads',
        '300% growth in subscription revenue',
        '25% improvement in customer retention'
      ],
      tags: ['Mobile Marketing', 'Email Campaigns', 'Retention Marketing'],
      image: 'gradient-from-yellow-400-to-orange-500'
    },
    {
      title: 'CloudSecure Enterprise',
      category: 'Cybersecurity',
      description: 'Account-based marketing and sales enablement for enterprise cybersecurity solutions targeting Fortune 500 companies.',
      results: [
        '150% increase in enterprise leads',
        '75% shorter sales cycle',
        '$2M+ in pipeline generation'
      ],
      tags: ['ABM', 'Sales Enablement', 'Enterprise Marketing'],
      image: 'gradient-from-indigo-500-to-purple-600'
    }
  ];

  const categories = ['All', 'B2B SaaS', 'E-commerce', 'Local Business', 'Professional Services', 'Food & Beverage', 'Cybersecurity'];

  return (
    <Layout>
      <HeroSection
        title="Success Stories That Speak for Themselves"
        subtitle="Explore how we've helped businesses across industries achieve remarkable growth through strategic digital marketing and creative campaigns."
        variant="minimal"
        primaryCTA="Start Your Project"
        secondaryCTA="View Case Studies"
      />

      {/* Filter Buttons */}
      <section className="py-8 bg-muted/20">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button key={category} variant="outline" size="sm" className="hover:bg-secondary hover:text-secondary-foreground">
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="group overflow-hidden border-0 shadow-medium hover:shadow-large transition-all duration-300 hover:-translate-y-2">
                {/* Project Image Placeholder */}
                <div className={`h-48 bg-${project.image} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-secondary/80 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h4 className="font-semibold text-lg">{project.title}</h4>
                      <p className="text-sm opacity-90">{project.category}</p>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <ExternalLink className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
                      <Badge variant="secondary" className="text-xs">{project.category}</Badge>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Results */}
                  <div className="mb-6">
                    <h4 className="font-medium text-sm mb-3 flex items-center">
                      <TrendingUp size={16} className="mr-2 text-accent" />
                      Key Results
                    </h4>
                    <ul className="space-y-1">
                      {project.results.map((result, resultIndex) => (
                        <li key={resultIndex} className="text-xs text-muted-foreground flex items-center">
                          <Award size={12} className="mr-2 text-accent" />
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full group text-sm">
                    View Case Study
                    <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Our Impact by the Numbers
            </h2>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Real results from real campaigns across diverse industries and business models.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">500+</div>
              <div className="text-primary-foreground/80">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">$50M+</div>
              <div className="text-primary-foreground/80">Revenue Generated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">250%</div>
              <div className="text-primary-foreground/80">Average ROI Increase</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">98%</div>
              <div className="text-primary-foreground/80">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Become Our Next Success Story?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Let's discuss your goals and create a custom strategy that delivers the results your business deserves.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="default" size="xl" className="btn-primary">
                Start Your Project
              </Button>
              <Button variant="outline" size="xl">
                Download Portfolio Guide
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Portfolio;