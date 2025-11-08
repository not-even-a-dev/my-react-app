import { HTMLAttributes } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { getContrastTextColor } from '@/utils/colorHelpers';
import type { Tag as TagType } from '@/utils/types';

interface TagComponentProps extends HTMLAttributes<HTMLSpanElement> {
  tag: TagType;
  onRemove?: () => void;
  variant?: 'default' | 'compact';
}

export function Tag({
  tag,
  onRemove,
  variant = 'default',
  className,
  ...props
}: TagComponentProps) {
  const tagColor = tag.color || '#A8D8EA';
  // Use the full opacity tag color to determine text contrast
  const textColor = getContrastTextColor(tagColor);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full text-sm',
        variant === 'default' ? 'px-3 py-1' : 'px-2 py-0.5',
        className
      )}
      style={{ 
        backgroundColor: `${tagColor}40`, 
        color: textColor,
        border: `1px solid ${tagColor}60` // Add subtle border for better definition
      }}
      {...props}
    >
      {tag.name}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:opacity-70 transition-opacity"
          aria-label={`Remove ${tag.name} tag`}
        >
          <X size={14} />
        </button>
      )}
    </span>
  );
}

