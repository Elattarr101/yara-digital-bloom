import Layout from '@/components/Layout';
import { TrendingUp, Layout as LayoutIcon, Palette, Share2, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useScrollAnimation, fadeInUp, staggerContainer, scaleIn, getReducedMotionVariants } from '@/hooks/useScrollAnimation';
import AnimatedCounter from '@/components/animations/AnimatedCounter';
import heroImage from '@/assets/hero-marketing.jpg';

const Index = () => {
  const services = [
    {
      icon: TrendingUp,
      title: 'Digital Marketing',
      tagline: 'Grow your online presence',
      description: 'Drive targeted traffic and increase conversions with our comprehensive SEO, PPC, and email marketing strategies tailored to your business goals.'
    },
    {
      icon: LayoutIcon,
      title: 'Web Design',
      tagline: 'Beautiful, functional websites',
      description: 'Create stunning, responsive websites that not only look amazing but convert visitors into customers with optimized user experiences.'
    },
    {
      icon: Palette,
      title: 'Branding',
      tagline: 'Memorable brand identities',
      description: 'Build distinctive brand identities that resonate with your target audience through strategic logo design and comprehensive brand guidelines.'
    },
    {
      icon: Share2,
      title: 'Social Media',
      tagline: 'Engage your audience',
      description: 'Connect with your customers across all social platforms with engaging content, community management, and targeted advertising campaigns.'
    }
  ];

  const clientLogos = [
    'Nike', 'Apple', 'Google', 'Microsoft', 'Amazon', 'Tesla', 'Samsung', 'Coca-Cola'
  ];

  const featuredWork = [
    {
      title: 'TechStart Rebranding',
      category: 'Brand Identity',
      image: 'gradient-from-blue-600-to-purple-600'
    },
    {
      title: 'EcoClean Campaign',
      category: 'Digital Marketing',
      image: 'gradient-from-green-500-to-teal-500'
    },
    {
      title: 'Fashion Forward Website',
      category: 'Web Design',
      image: 'gradient-from-pink-500-to-rose-500'
    }
  ];

  const stats = [
    { number: 500, suffix: '+', label: 'Successful Projects' },
    { number: 98, suffix: '%', label: 'Client Satisfaction' },
    { number: 150, suffix: '+', label: 'Happy Clients' },
    { number: 24, suffix: '/7', label: 'Support Available' }
  ];

  const { ref: servicesRef, controls: servicesControls } = useScrollAnimation();
  const { ref: statsRef, controls: statsControls } = useScrollAnimation();
  const { ref: logoRef, controls: logoControls } = useScrollAnimation();
  const { ref: workRef, controls: workControls } = useScrollAnimation();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Animated Background */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 gradient-hero opacity-90"></div>
          
          {/* Animated Shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]"></div>
            <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-primary/30 rounded-full blur-2xl animate-pulse [animation-delay:2s]"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 container-custom text-background">
          <div className="max-w-4xl space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight animate-fade-in">
              We Create Digital Experiences That Drive Results
            </h1>
            
            <p className="text-xl sm:text-2xl lg:text-3xl text-background/90 max-w-3xl animate-fade-in [animation-delay:200ms] select-none">
              Transform your business with data-driven marketing strategies and stunning design that converts visitors into customers
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in [animation-delay:400ms]">
              <Button variant="hero" size="xl" className="group">
                Get Started
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button variant="outline-hero" size="xl">
                View Our Work
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-background/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-background/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            animate="visible"
            variants={getReducedMotionVariants(staggerContainer)}
          >
            <motion.h2 
              className="text-3xl lg:text-4xl font-bold mb-6"
              variants={getReducedMotionVariants(fadeInUp)}
            >
              Our Expertise
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              variants={getReducedMotionVariants(fadeInUp)}
            >
              We combine creativity with strategy to deliver comprehensive digital solutions that drive measurable results.
            </motion.p>
          </motion.div>

          <motion.div 
            ref={servicesRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            animate={servicesControls}
            variants={getReducedMotionVariants(staggerContainer)}
          >
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={index}
                  variants={getReducedMotionVariants(scaleIn)}
                  whileHover={{ 
                    y: -8,
                    scale: 1.02,
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                  className="h-full"
                >
                  <Card className="group h-full border-0 shadow-soft hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <CardContent className="p-8 text-center h-full flex flex-col">
                      <motion.div 
                        className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-all duration-300"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <IconComponent size={32} className="text-primary" />
                      </motion.div>
                      
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
                      <p className="text-primary font-medium mb-4">{service.tagline}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">
                        {service.description}
                      </p>
                      
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Button variant="ghost" className="group/btn text-primary hover:text-primary p-0">
                          Learn More
                          <ArrowRight size={16} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom">
          <motion.div 
            ref={statsRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial="hidden"
            animate={statsControls}
            variants={getReducedMotionVariants(staggerContainer)}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                variants={getReducedMotionVariants(fadeInUp)}
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  <AnimatedCounter 
                    end={stat.number} 
                    suffix={stat.suffix}
                    className="text-primary-foreground"
                  />
                </div>
                <p className="text-primary-foreground/80">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Client Logos Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 animate-fade-in">
              Trusted by Industry Leaders
            </h2>
          </div>

          {/* Infinite Scroll Container */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll">
              {/* First set of logos */}
              {clientLogos.map((logo, index) => (
                <div 
                  key={`first-${index}`}
                  className="flex-shrink-0 mx-8 lg:mx-12 group cursor-pointer"
                >
                  <div className="w-32 h-20 bg-muted rounded-lg flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110 shadow-soft">
                    <span className="text-lg font-bold text-muted-foreground group-hover:text-primary">
                      {logo}
                    </span>
                  </div>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {clientLogos.map((logo, index) => (
                <div 
                  key={`second-${index}`}
                  className="flex-shrink-0 mx-8 lg:mx-12 group cursor-pointer"
                >
                  <div className="w-32 h-20 bg-muted rounded-lg flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110 shadow-soft">
                    <span className="text-lg font-bold text-muted-foreground group-hover:text-primary">
                      {logo}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 animate-fade-in">
              Recent Success Stories
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in [animation-delay:200ms]">
              Discover how we've helped businesses transform their digital presence and achieve remarkable growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredWork.map((work, index) => (
              <Card 
                key={index} 
                className="group overflow-hidden border-0 shadow-medium hover:shadow-large transition-all duration-300 hover:-translate-y-2 cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 100 + 400}ms` }}
              >
                {/* Image with Overlay */}
                <div className={`h-64 bg-${work.image} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/60 to-secondary/60"></div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <Button variant="secondary" className="group/btn">
                      View Case Study
                      <ExternalLink size={16} className="ml-2 group-hover/btn:scale-110 transition-transform" />
                    </Button>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {work.category}
                    </span>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-secondary transition-colors">
                    {work.title}
                  </h3>
                  <p className="text-muted-foreground">{work.category}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-primary-foreground relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border border-primary-foreground rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border border-primary-foreground rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 border border-primary-foreground rounded-full"></div>
          <div className="absolute bottom-32 right-1/3 w-24 h-24 border border-primary-foreground rounded-full"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 animate-fade-in">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 animate-fade-in [animation-delay:200ms]">
              Let's discuss how we can help you achieve your digital marketing goals and drive measurable results for your business.
            </p>
            <Button 
              variant="secondary" 
              size="xl" 
              className="group animate-fade-in [animation-delay:400ms]"
            >
              Schedule a Free Consultation
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
