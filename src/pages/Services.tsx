import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, Users, PenTool, TrendingUp, Smartphone, Globe } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Search,
      title: 'SEO & Search Marketing',
      description: 'Dominate search results with our comprehensive SEO strategies and paid search campaigns.',
      features: ['Keyword Research', 'On-Page Optimization', 'Link Building', 'Local SEO', 'PPC Management'],
      price: 'Starting at $2,500/month'
    },
    {
      icon: Users,
      title: 'Social Media Marketing',
      description: 'Build engaged communities and drive conversions across all major social platforms.',
      features: ['Content Strategy', 'Community Management', 'Paid Social Ads', 'Influencer Partnerships', 'Analytics & Reporting'],
      price: 'Starting at $1,800/month'
    },
    {
      icon: PenTool,
      title: 'Content Marketing',
      description: 'Create compelling content that educates, engages, and converts your target audience.',
      features: ['Blog Writing', 'Video Production', 'Email Campaigns', 'Whitepapers & eBooks', 'Content Distribution'],
      price: 'Starting at $2,000/month'
    },
    {
      icon: TrendingUp,
      title: 'Marketing Analytics',
      description: 'Make data-driven decisions with comprehensive tracking and performance optimization.',
      features: ['Conversion Tracking', 'Custom Dashboards', 'A/B Testing', 'ROI Analysis', 'Performance Reports'],
      price: 'Starting at $1,200/month'
    },
    {
      icon: Smartphone,
      title: 'Mobile Marketing',
      description: 'Reach customers on-the-go with targeted mobile campaigns and app marketing strategies.',
      features: ['App Store Optimization', 'Mobile Ads', 'SMS Marketing', 'Push Notifications', 'Mobile Analytics'],
      price: 'Starting at $1,500/month'
    },
    {
      icon: Globe,
      title: 'Web Development',
      description: 'Build fast, responsive websites optimized for conversions and user experience.',
      features: ['Custom Website Design', 'E-commerce Development', 'Landing Pages', 'Performance Optimization', 'Maintenance & Support'],
      price: 'Starting at $5,000/project'
    }
  ];

  const process = [
    {
      step: '01',
      title: 'Discovery & Strategy',
      description: 'We start by understanding your business, goals, and target audience to create a customized strategy.'
    },
    {
      step: '02',
      title: 'Implementation',
      description: 'Our expert team executes the strategy using proven methodologies and cutting-edge tools.'
    },
    {
      step: '03',
      title: 'Optimization',
      description: 'We continuously monitor performance and optimize campaigns for maximum ROI and growth.'
    },
    {
      step: '04',
      title: 'Scale & Growth',
      description: 'As results improve, we scale successful strategies and explore new growth opportunities.'
    }
  ];

  return (
    <Layout>
      <HeroSection
        title="Marketing Services That Drive Real Results"
        subtitle="From SEO and social media to content marketing and analytics, we offer comprehensive digital marketing solutions tailored to your business goals."
        variant="minimal"
        primaryCTA="Get Custom Quote"
        secondaryCTA="Schedule Consultation"
      />

      {/* Services Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Our Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive marketing solutions designed to accelerate your business growth and maximize your return on investment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="group hover:shadow-large transition-all duration-300 hover:-translate-y-2 border-0 shadow-medium">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                      <IconComponent size={24} className="text-secondary" />
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                    <p className="text-muted-foreground mb-6">{service.description}</p>
                    
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-secondary rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="border-t pt-6">
                      <p className="text-sm font-semibold text-primary mb-4">{service.price}</p>
                      <Button className="w-full group">
                        Learn More
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Our Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A proven methodology that ensures successful outcomes for every client project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Transform Your Marketing?
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Let's discuss your goals and create a custom marketing strategy that drives real results for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="xl">
                Get Free Consultation
              </Button>
              <Button variant="outline" size="xl" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Download Service Guide
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;