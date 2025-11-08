import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  iconColor = 'text-blue-600',
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-center space-y-4"
    >
      <div className={`p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 ${iconColor.replace('text-', 'bg-').replace('-600', '-100')} dark:bg-opacity-20`}>
        <Icon size={48} className={iconColor} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-sm">
        {description}
      </p>
    </motion.div>
  );
}

