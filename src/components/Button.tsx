import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-slate-600 dark:bg-slate-500 text-white hover:bg-slate-700 dark:hover:bg-slate-600 focus:ring-slate-500 dark:focus:ring-slate-400 shadow-md hover:shadow-lg',
    secondary:
      'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-slate-500 dark:focus:ring-slate-400 shadow-sm hover:shadow-md',
    ghost:
      'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 focus:ring-gray-300 dark:focus:ring-gray-600',
    danger:
      'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 shadow-md hover:shadow-lg',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}

