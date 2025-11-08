import { useTaskStore } from '@/stores/taskStore';
import { TaskCard } from './TaskCard';
import { Task as TaskType } from '@/utils/types';
import { AnimatePresence } from 'framer-motion';
import { EmptyState } from '@/components/EmptyState';
import { CheckSquare } from 'lucide-react';

interface TaskListProps {
  tasks?: TaskType[];
  onEdit?: (task: TaskType) => void;
  showSubtasks?: boolean;
}

export function TaskList({
  tasks,
  onEdit,
  showSubtasks = false,
}: TaskListProps) {
  const { getFilteredTasks } = useTaskStore();
  const displayTasks = tasks || getFilteredTasks();

  if (displayTasks.length === 0) {
    return (
      <EmptyState
        icon={CheckSquare}
        title="No tasks found"
        description="Create your first task to get started!"
      />
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {displayTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            showSubtasks={showSubtasks}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

