import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { TrendingUp, Code, Palette, FileText, ArrowRight, CheckCircle } from 'lucide-react';

const Services = () => {
  const services = [
    {
      id: 'digital-marketing',
      icon: TrendingUp,
      title: 'DIGITAL MARKETING',
      description: 'Drive traffic, generate leads, and boost sales with our proven digital marketing strategies',
      included: [
        'SEO Optimization',
        'PPC Advertising', 
        'Email Marketing',
        'Analytics & Reporting'
      ],
      keyResult: 'Average 300% ROI increase for our clients',
      price: 'Starting from $500/month'
    },
    {
      id: 'web-design',
      icon: Code,
      title: 'WEB DESIGN & DEVELOPMENT',
      description: 'Beautiful, responsive websites that convert visitors into customers',
      included: [
        'Custom Design',
        'Mobile Optimization',
        'E-commerce Solutions',
        'CMS Integration'
      ],
      keyResult: '95% of our websites load in under 3 seconds',
      price: 'Starting from $1,000'
    },
    {
      id: 'branding',
      icon: Palette,
      title: 'BRANDING & IDENTITY',
      description: 'Create a memorable brand that stands out from the competition',
      included: [
        'Logo Design',
        'Brand Guidelines',
        'Business Cards',
        'Marketing Materials'
      ],
      keyResult: 'Brands see 40% increase in recognition within 6 months',
      price: 'Starting from $300'
    },
    {
      id: 'content-creation',
      icon: FileText,
      title: 'CONTENT CREATION',
      description: 'Engaging content that tells your story and connects with your audience',
      included: [
        'Copywriting',
        'Photography',
        'Video Production',
        'Social Media Content'
      ],
      keyResult: 'Content generates 3x more engagement than industry average',
      price: 'Starting from $200'
    }
  ];

  return (
    <Layout>
      {/* Page Header */}
      <section className="section-padding bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="container-custom relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Our Services
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground">
              Comprehensive digital solutions to grow your business
            </p>
          </div>
        </div>
      </section>

      {/* Services Accordion */}
      <section className="section-padding">
        <div className="container-custom">
          <Accordion type="single" collapsible className="space-y-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              const isEven = index % 2 === 0;
              
              return (
                <AccordionItem 
                  key={service.id} 
                  value={service.id}
                  className="border-none bg-card rounded-2xl shadow-medium hover:shadow-large transition-all duration-300"
                >
                  <AccordionTrigger className="p-8 hover:no-underline group">
                    <div className="flex items-center gap-8 w-full text-left">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <IconComponent size={32} className="text-primary group-hover:text-secondary transition-colors" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-lg text-muted-foreground">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="px-8 pb-8">
                    <div className={`grid md:grid-cols-3 gap-8 ${isEven ? '' : 'md:grid-flow-col-dense'}`}>
                      {/* What's Included */}
                      <div className="md:col-span-1">
                        <h4 className="font-semibold text-lg mb-4 text-primary">What's Included</h4>
                        <ul className="space-y-3">
                          {service.included.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start gap-3">
                              <CheckCircle size={20} className="text-secondary mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Key Result & Price */}
                      <div className="md:col-span-2 space-y-6">
                        <div className="bg-secondary/10 rounded-xl p-6">
                          <h4 className="font-semibold text-lg mb-3 text-secondary">Key Result</h4>
                          <p className="text-lg font-medium">{service.keyResult}</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Starting Price</p>
                            <p className="text-2xl font-bold text-accent">{service.price}</p>
                          </div>
                          <Button size="lg" className="group">
                            Learn More
                            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-padding bg-gradient-to-r from-primary via-secondary to-accent text-white">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Not sure which service you need?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Schedule a free consultation to discuss your goals and find the perfect solution for your business.
            </p>
            <Button 
              variant="secondary" 
              size="xl" 
              className="bg-white text-primary hover:bg-white/90"
            >
              Schedule Free Consultation
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;