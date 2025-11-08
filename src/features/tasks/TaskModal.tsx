import { Modal } from '@/components/Modal';
import { TaskForm } from './TaskForm';
import { useTaskStore } from '@/stores/taskStore';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import type { TaskCreateInput } from '@/utils/schemas';
import type { Task } from '@/utils/types';

export function TaskModal() {
  const { user } = useAuthStore();
  const { isTaskModalOpen, closeTaskModal, openQuickCapture } = useUIStore();
  const { createTask, updateTask, selectedTaskId, getTask } = useTaskStore();

  const task = selectedTaskId ? getTask(selectedTaskId) : undefined;

  const handleSubmit = async (data: TaskCreateInput) => {
    try {
      const normalizedData: TaskCreateInput = {
        ...data,
        dueDate: data.dueDate ?? undefined,
        reminderDate: data.reminderDate ?? undefined,
        recurrenceRule: data.recurrenceRule ?? undefined,
      };

      if (task) {
        await updateTask(task.id, normalizedData as Partial<Task>);
      } else {
        await createTask(normalizedData, user?.uid);
      }
      closeTaskModal();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleSwitchToQuickCapture = () => {
    closeTaskModal();
    openQuickCapture();
  };

  return (
    <Modal
      isOpen={isTaskModalOpen}
      onClose={closeTaskModal}
      title={task ? 'Edit Task' : 'Create New Task'}
      size="lg"
    >
      <TaskForm
        task={task}
        onSubmit={handleSubmit}
        onCancel={closeTaskModal}
        onSwitchToQuick={task ? undefined : handleSwitchToQuickCapture}
      />
    </Modal>
  );
}

