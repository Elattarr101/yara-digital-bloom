import { useEffect, useRef } from 'react';
import { useInView, useAnimation, useMotionValue, useSpring } from 'framer-motion';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Hook for scroll-triggered animations
export const useScrollAnimation = (threshold = 0.1, triggerOnce = true) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { 
    amount: threshold, 
    once: triggerOnce,
    margin: "-100px 0px"
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else if (!triggerOnce) {
      controls.start('hidden');
    }
  }, [controls, inView, triggerOnce]);

  return { ref, controls, inView };
};

// Hook for parallax effects
export const useParallax = (multiplier = 0.5) => {
  const y = useMotionValue(0);
  const ySmooth = useSpring(y, { damping: 50, stiffness: 400 });

  useEffect(() => {
    if (!isBrowser) return;
    
    const updateY = () => {
      const scrollY = window.scrollY;
      y.set(scrollY * multiplier);
    };

    window.addEventListener('scroll', updateY);
    return () => window.removeEventListener('scroll', updateY);
  }, [y, multiplier]);

  return ySmooth;
};

// Animation variants
export const fadeInUp = {
  hidden: { 
    opacity: 0, 
    y: 60,
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
  }
};

export const fadeInLeft = {
  hidden: { 
    opacity: 0, 
    x: -60,
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
  }
};

export const fadeInRight = {
  hidden: { 
    opacity: 0, 
    x: 60,
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
  }
};

export const scaleIn = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const slideInFromRight = {
  hidden: { x: '100%', opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] }
  },
  exit: { 
    x: '100%', 
    opacity: 0,
    transition: { duration: 0.3, ease: [0.6, -0.05, 0.01, 0.99] }
  }
};

// Check for reduced motion preference
export const shouldReduceMotion = () => {
  if (!isBrowser) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Reduced motion variants
export const getReducedMotionVariants = (variants: any) => {
  if (shouldReduceMotion()) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.2 } }
    };
  }
  return variants;
};