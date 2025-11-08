import {
  CheckCircle2,
  Circle,
  Calendar,
  Tag as TagIcon,
  MoreVertical,
  Edit,
  Trash2,
  RefreshCcw,
  Bell,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Tag } from '@/components/Tag';
import { useTaskStore } from '@/stores/taskStore';
import { useTagStore } from '@/stores/tagStore';
import { formatDate, getRelativeDate, isOverdue } from '@/utils/dateHelpers';
import { cn } from '@/utils/cn';
import type { Task } from '@/utils/types';
import { useState } from 'react';
import { celebrateTaskCompletion } from '@/utils/confetti';
import { formatRecurrenceRule } from '@/utils/recurrenceHelpers';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  showSubtasks?: boolean;
}

export function TaskCard({ task, onEdit, showSubtasks = false }: TaskCardProps) {
  const { completeTask, uncompleteTask, deleteTask, getSubtasks } = useTaskStore();
  const { tags } = useTagStore();
  const [showMenu, setShowMenu] = useState(false);

  const taskTags = tags.filter((tag) => task.tagIds.includes(tag.id));
  const subtasks = showSubtasks ? getSubtasks(task.id) : [];
  const completedSubtasks = subtasks.filter((st) => st.status === 'completed').length;
  const hasSubtasks = subtasks.length > 0;

  const isCompleted = task.status === 'completed';
  const isOverdueTask = task.dueDate ? isOverdue(task.dueDate) && !isCompleted : false;

  const handleToggleComplete = async () => {
    if (isCompleted) {
      await uncompleteTask(task.id);
    } else {
      await completeTask(task.id);
      // Celebrate with confetti! 🎉
      celebrateTaskCompletion();
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task.id);
    }
    setShowMenu(false);
  };

  const priorityColors = {
    low: 'bg-blue-100 text-blue-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      layout
    >
      <Card
        hover
        className={cn(
          'relative transition-all',
          isCompleted && 'opacity-60',
          isOverdueTask && 'border-2 border-red-300 dark:border-red-500'
        )}
      >
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={handleToggleComplete}
            className="mt-1 flex-shrink-0"
            aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {isCompleted ? (
              <CheckCircle2 className="text-green-500" size={24} />
            ) : (
              <Circle className="text-gray-400 dark:text-gray-500 hover:text-green-500 transition-colors" size={24} />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3
                  className={cn(
                    'font-semibold text-gray-800 dark:text-gray-100',
                    isCompleted && 'line-through'
                  )}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {task.description}
                  </p>
                )}
              </div>

              {/* Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Task options"
                >
                  <MoreVertical size={18} className="text-gray-500 dark:text-gray-400" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10 min-w-[120px]">
                    {onEdit && (
                      <button
                        onClick={() => {
                          onEdit(task);
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                    )}
                    <button
                      onClick={handleDelete}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {/* Priority */}
              <Badge
                variant="default"
                className={priorityColors[task.priority]}
              >
                {task.priority}
              </Badge>

              {/* Due Date */}
              {task.dueDate && (
                <div
                  className={cn(
                    'flex items-center gap-1 text-xs',
                    isOverdueTask ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
                  )}
                >
                  <Calendar size={14} />
                  <span>{getRelativeDate(task.dueDate)}</span>
                  {!isCompleted && <span className="ml-1">({formatDate(task.dueDate)})</span>}
                </div>
              )}

              {/* Recurrence */}
              {task.recurrenceRule && (
                <div className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-300">
                  <RefreshCcw size={14} />
                  <span>{formatRecurrenceRule(task.recurrenceRule)}</span>
                </div>
              )}

              {task.reminderDate && (
                <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-300">
                  <Bell size={13} />
                  <span>{format(task.reminderDate, 'PPp')}</span>
                </div>
              )}

              {/* Subtasks Progress */}
              {hasSubtasks && (
                <Badge variant="info" size="sm">
                  {completedSubtasks}/{subtasks.length} subtasks
                </Badge>
              )}

              {/* Tags */}
              {taskTags.length > 0 && (
                <div className="flex items-center gap-1">
                  <TagIcon size={14} className="text-gray-400 dark:text-gray-500" />
                  <div className="flex flex-wrap gap-1">
                    {taskTags.map((tag) => (
                      <Tag key={tag.id} tag={tag} variant="compact" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

