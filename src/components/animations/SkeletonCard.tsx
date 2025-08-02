import { motion } from 'framer-motion';

interface SkeletonCardProps {
  className?: string;
  variant?: 'blog' | 'service' | 'portfolio';
}

const SkeletonCard = ({ className = '', variant = 'blog' }: SkeletonCardProps) => {
  const baseClasses = "animate-pulse bg-muted rounded-lg";
  
  const variants = {
    blog: (
      <div className={`${baseClasses} ${className}`}>
        <div className="aspect-video bg-muted-foreground/20 rounded-t-lg mb-4"></div>
        <div className="p-6 space-y-3">
          <div className="h-4 bg-muted-foreground/20 rounded w-1/4"></div>
          <div className="h-6 bg-muted-foreground/20 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted-foreground/20 rounded w-full"></div>
            <div className="h-4 bg-muted-foreground/20 rounded w-2/3"></div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <div className="h-6 w-6 bg-muted-foreground/20 rounded-full"></div>
            <div className="h-4 bg-muted-foreground/20 rounded w-24"></div>
            <div className="h-4 bg-muted-foreground/20 rounded w-16"></div>
          </div>
        </div>
      </div>
    ),
    service: (
      <div className={`${baseClasses} ${className} p-8`}>
        <div className="w-16 h-16 bg-muted-foreground/20 rounded-2xl mb-6"></div>
        <div className="space-y-3">
          <div className="h-6 bg-muted-foreground/20 rounded w-3/4"></div>
          <div className="h-4 bg-muted-foreground/20 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted-foreground/20 rounded w-full"></div>
            <div className="h-4 bg-muted-foreground/20 rounded w-5/6"></div>
            <div className="h-4 bg-muted-foreground/20 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    ),
    portfolio: (
      <div className={`${baseClasses} ${className}`}>
        <div className="h-64 bg-muted-foreground/20 rounded-t-lg"></div>
        <div className="p-6 space-y-3">
          <div className="h-6 bg-muted-foreground/20 rounded w-3/4"></div>
          <div className="h-4 bg-muted-foreground/20 rounded w-1/2"></div>
        </div>
      </div>
    )
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {variants[variant]}
    </motion.div>
  );
};

export default SkeletonCard;