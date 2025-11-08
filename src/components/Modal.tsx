import { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Card } from './Card';
import { cn } from '@/utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  cardPadding?: 'sm' | 'md' | 'lg' | 'none';
  cardClassName?: string;
  contentClassName?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  cardPadding = 'lg',
  cardClassName,
  contentClassName,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className={`w-full ${sizeClasses[size]}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Card
                padding={cardPadding}
                className={cn(
                  'max-h-[90vh] overflow-y-auto',
                  cardClassName
                )}
              >
                {/* Header */}
                {(title || showCloseButton) && (
                  <div className="flex items-center justify-between mb-4">
                    {title && (
                      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    )}
                    {showCloseButton && (
                      <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Close modal"
                      >
                        <X size={20} className="text-gray-500" />
                      </button>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className={cn(contentClassName)}>{children}</div>
              </Card>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

