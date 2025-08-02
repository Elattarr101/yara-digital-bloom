import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useParallax, fadeInUp, getReducedMotionVariants } from '@/hooks/useScrollAnimation';
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
  const y = useParallax(-0.3);
  
  const renderContent = () => (
    <motion.div 
      className={`space-y-8 ${variant === 'centered' ? 'text-center max-w-4xl mx-auto' : 'max-w-3xl'}`}
      initial="hidden"
      animate="visible"
      variants={getReducedMotionVariants({
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1
          }
        }
      })}
    >
      <motion.h1 
        className="hero-text"
        variants={getReducedMotionVariants(fadeInUp)}
      >
        {title}
      </motion.h1>
      
      <motion.p 
        className="subtitle-text"
        variants={getReducedMotionVariants(fadeInUp)}
      >
        {subtitle}
      </motion.p>
      
      <motion.div 
        className={`flex flex-col sm:flex-row gap-4 ${variant === 'centered' ? 'justify-center' : ''}`}
        variants={getReducedMotionVariants(fadeInUp)}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Button variant="hero" size="xl" className="group">
            {primaryCTA}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
        
        {showVideo ? (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button variant="outline-hero" size="xl" className="group">
              <Play size={20} className="group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </motion.div>
        ) : (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button variant="outline-hero" size="xl">
              {secondaryCTA}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
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
      {/* Background with parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y }}
      >
        <img
          src={backgroundImage}
          alt="Hero background"
          className="w-full h-full object-cover"
          loading="eager"
          // @ts-ignore - fetchpriority is a valid HTML attribute
          fetchpriority="high"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 gradient-hero opacity-90"></div>
      </motion.div>

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