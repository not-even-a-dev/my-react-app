import { Modal } from '@/components/Modal';
import { TaskForm } from './TaskForm';
import { useUIStore } from '@/stores/uiStore';
import { useTaskStore } from '@/stores/taskStore';
import { useAuthStore } from '@/stores/authStore';
import type { TaskCreateInput } from '@/utils/schemas';

export function QuickCaptureModal() {
  const { isQuickCaptureOpen, closeQuickCapture, openTaskModal } = useUIStore();
  const { createTask } = useTaskStore();
  const { user } = useAuthStore();
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toLowerCase().includes('mac');
  const quickShortcutLabel = isMac ? '⌘K' : 'Ctrl+K';
  const advancedShortcutLabel = isMac ? '⇧⌘K' : 'Ctrl+Shift+K';

  const handleSubmit = async (data: TaskCreateInput) => {
    try {
      await createTask(
        {
          ...data,
          status: data.status ?? 'pending',
          priority: data.priority ?? 'medium',
          tagIds: data.tagIds ?? [],
        },
        user?.uid
      );
      closeQuickCapture();
    } catch (error) {
      console.error('Failed to save task from quick capture:', error);
    }
  };

  const handleSwitchToAdvanced = () => {
    closeQuickCapture();
    openTaskModal();
  };

  return (
    <Modal
      isOpen={isQuickCaptureOpen}
      onClose={closeQuickCapture}
      title="Quick capture"
      size="md"
      contentClassName="space-y-4"
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300">
          <p className="font-semibold text-slate-700 dark:text-slate-200">Tip</p>
          <p>
            Press <span className="font-semibold">{quickShortcutLabel}</span> to open quick capture
            from anywhere. For the advanced editor use{' '}
            <span className="font-semibold">{advancedShortcutLabel}</span>.
          </p>
        </div>
        <TaskForm
          onSubmit={handleSubmit}
          onCancel={closeQuickCapture}
          mode="quick"
          onSwitchToAdvanced={handleSwitchToAdvanced}
        />
      </div>
    </Modal>
  );
}


