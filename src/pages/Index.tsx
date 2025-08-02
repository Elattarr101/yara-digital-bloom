import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import { Users, Target, Zap, TrendingUp, Award, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const features = [
    {
      icon: Target,
      title: 'Strategic Marketing',
      description: 'Data-driven strategies that target your ideal customers and drive measurable results.'
    },
    {
      icon: Zap,
      title: 'Fast Implementation',
      description: 'Quick turnaround times without compromising quality or attention to detail.'
    },
    {
      icon: TrendingUp,
      title: 'Growth Focused',
      description: 'Every campaign is designed to scale your business and maximize your ROI.'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Seasoned professionals with years of experience in digital marketing.'
    },
    {
      icon: Award,
      title: 'Award Winning',
      description: 'Recognized for excellence in creative campaigns and outstanding results.'
    },
    {
      icon: Rocket,
      title: 'Innovation First',
      description: 'Cutting-edge tools and techniques to keep you ahead of the competition.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Successful Projects' },
    { number: '98%', label: 'Client Satisfaction' },
    { number: '250%', label: 'Average ROI Increase' },
    { number: '24/7', label: 'Support Available' }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection
        title="Transform Your Business with Strategic Digital Marketing"
        subtitle="We help ambitious businesses grow through innovative marketing strategies, creative campaigns, and data-driven insights that deliver real results."
        primaryCTA="Start Your Journey"
        showVideo={true}
      />

      {/* Stats Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Why Choose Yara for Your Marketing Needs?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We combine creativity with strategy to deliver marketing solutions that not only look great but drive real business growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-2 border-0 shadow-soft">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                      <IconComponent size={24} className="text-secondary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Accelerate Your Growth?
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Join hundreds of successful businesses that have transformed their marketing with Yara. Let's create something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="xl" className="group">
                Get Free Consultation
                <Target size={20} className="group-hover:rotate-12 transition-transform" />
              </Button>
              <Button variant="outline" size="xl" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                View Our Work
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
