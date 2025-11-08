import { HTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

export function Card({
  children,
  hover = false,
  padding = 'md',
  className,
  ...props
}: CardProps) {
  const paddingStyles = {
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    none: '',
  };

  const MotionCard = hover ? motion.div : 'div';

  const component = (
    <MotionCard
      className={cn(
        'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg rounded-2xl',
        paddingStyles[padding],
        className
      )}
      whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </MotionCard>
  );

  return component;
}

