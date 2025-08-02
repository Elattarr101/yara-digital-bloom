import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import SEO from '@/components/SEO';
import OptimizedImage from '@/components/OptimizedImage';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Branding', 'Web Design', 'Marketing', 'E-commerce'];

  const projects = [
    {
      id: 1,
      name: 'TechStart',
      service: 'Complete Branding & Website',
      industry: 'Technology Startup',
      result: '500% increase in leads within 3 months',
      description: 'Full brand identity and responsive website design',
      category: 'Branding',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop'
    },
    {
      id: 2,
      name: 'EcoClean',
      service: 'Digital Marketing Campaign',
      industry: 'Cleaning Services',
      result: '300% ROI on ad spend',
      description: 'Multi-channel marketing strategy with PPC and SEO',
      category: 'Marketing',
      image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&h=400&fit=crop'
    },
    {
      id: 3,
      name: 'FashionForward',
      service: 'E-commerce Website',
      industry: 'Fashion Retail',
      result: '200% increase in online sales',
      description: 'Modern e-commerce platform with mobile optimization',
      category: 'E-commerce',
      image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&h=400&fit=crop'
    },
    {
      id: 4,
      name: 'HealthPlus',
      service: 'Brand Redesign',
      industry: 'Healthcare',
      result: '85% improvement in brand recognition',
      description: 'Complete visual identity overhaul and brand guidelines',
      category: 'Branding',
      image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&h=400&fit=crop'
    },
    {
      id: 5,
      name: 'FoodieApp',
      service: 'Mobile App UI/UX',
      industry: 'Food Delivery',
      result: '4.8/5 app store rating',
      description: 'Intuitive food delivery app design with seamless UX',
      category: 'Web Design',
      image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=600&h=400&fit=crop'
    },
    {
      id: 6,
      name: 'LocalBiz',
      service: 'Social Media Management',
      industry: 'Local Business',
      result: '1M+ social media reach per month',
      description: 'Complete social media strategy and content creation',
      category: 'Marketing',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'
    },
    {
      id: 7,
      name: 'GreenEnergy',
      service: 'Website + SEO',
      industry: 'Renewable Energy',
      result: '250% increase in organic traffic',
      description: 'SEO-optimized website with conversion focus',
      category: 'Web Design',
      image: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600&h=400&fit=crop'
    },
    {
      id: 8,
      name: 'SportsPro',
      service: 'Complete Marketing Package',
      industry: 'Sports Equipment',
      result: '150% boost in quarterly revenue',
      description: 'Integrated marketing campaign across all channels',
      category: 'Marketing',
      image: 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=600&h=400&fit=crop'
    }
  ];

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  return (
    <Layout>
      <SEO
        title="Portfolio - Our Digital Marketing & Web Design Success Stories | Yara Agency"
        description="Explore our portfolio of successful digital marketing campaigns, stunning web designs, and transformative branding projects. See how we've helped businesses grow."
        keywords="portfolio, case studies, web design examples, digital marketing results, branding projects, client success stories"
        url="https://yourdomain.com/portfolio"
        canonical="https://yourdomain.com/portfolio"
      />
      {/* Page Intro */}
      <section className="section-padding bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="container-custom relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Our Portfolio
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground">
              Success stories that speak for themselves
            </p>
          </div>
        </div>
      </section>

      {/* Filter System */}
      <section className="py-12">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 transition-all duration-300 ${
                  activeFilter === filter 
                    ? 'bg-primary text-primary-foreground shadow-lg' 
                    : 'hover:bg-primary/10 hover:border-primary'
                }`}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <div 
                key={project.id}
                className="group bg-card rounded-2xl overflow-hidden shadow-medium hover:shadow-large transition-all duration-500 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Project Image */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <Button variant="secondary" size="lg" className="backdrop-blur-sm bg-white/90">
                      View Case Study
                      <ExternalLink size={18} className="ml-2" />
                    </Button>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <span className="text-xs px-3 py-1 bg-secondary/10 text-secondary rounded-full font-medium">
                      {project.category}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">{project.service}</p>
                  <p className="text-sm text-muted-foreground mb-4">{project.industry}</p>
                  
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                  </div>
                  
                  {/* Key Result */}
                  <div className="pt-4 border-t">
                    <p className="text-sm font-semibold text-accent">
                      📈 {project.result}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary via-secondary to-accent text-white">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Be Our Next Success Story?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Let's discuss your project and create something amazing together.
            </p>
            <Button 
              variant="secondary" 
              size="xl" 
              className="bg-white text-primary hover:bg-white/90"
            >
              Start Your Project
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Portfolio;