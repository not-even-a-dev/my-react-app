import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-6 mb-4">
        <Icon size={48} className="text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm mb-4">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-slate-600 dark:bg-slate-500 text-white rounded-xl font-medium hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

