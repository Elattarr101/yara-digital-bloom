import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-marketing.jpg';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  primaryCTA?: string;
  secondaryCTA?: string;
  showVideo?: boolean;
  backgroundImage?: string;
  variant?: 'default' | 'minimal' | 'centered';
}

const HeroSection = ({ 
  title, 
  subtitle, 
  primaryCTA = "Get Started", 
  secondaryCTA = "Learn More",
  showVideo = false,
  backgroundImage = heroImage,
  variant = 'default'
}: HeroSectionProps) => {
  const renderContent = () => (
    <div className={`space-y-8 ${variant === 'centered' ? 'text-center max-w-4xl mx-auto' : 'max-w-3xl'}`}>
      <h1 className="hero-text animate-fade-in">
        {title}
      </h1>
      
      <p className="subtitle-text animate-fade-in [animation-delay:200ms]">
        {subtitle}
      </p>
      
      <div className={`flex flex-col sm:flex-row gap-4 animate-fade-in [animation-delay:400ms] ${variant === 'centered' ? 'justify-center' : ''}`}>
        <Button variant="hero" size="xl" className="group">
          {primaryCTA}
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Button>
        
        {showVideo ? (
          <Button variant="outline-hero" size="xl" className="group">
            <Play size={20} className="group-hover:scale-110 transition-transform" />
            Watch Demo
          </Button>
        ) : (
          <Button variant="outline-hero" size="xl">
            {secondaryCTA}
          </Button>
        )}
      </div>
    </div>
  );

  if (variant === 'minimal') {
    return (
      <section className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-background to-muted">
        <div className="container-custom">
          {renderContent()}
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 gradient-hero opacity-90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom text-background">
        {renderContent()}
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-5"></div>
    </section>
  );
};

export default HeroSection;