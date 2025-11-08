import { useEffect } from 'react';
import { useUIStore } from '@/stores/uiStore';

const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  const tagName = target.tagName.toLowerCase();
  return tagName === 'input' || tagName === 'textarea' || tagName === 'select';
};

export function useGlobalShortcuts() {
  const {
    openQuickCapture,
    closeQuickCapture,
    openTaskModal,
    closeTaskModal,
    isQuickCaptureOpen,
    isTaskModalOpen,
  } = useUIStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const metaOrCtrl = event.metaKey || event.ctrlKey;

      if (isEditableTarget(event.target)) {
        return;
      }

      if (metaOrCtrl && !event.shiftKey && key === 'k') {
        event.preventDefault();
        if (isTaskModalOpen) {
          closeTaskModal();
        }
        if (isQuickCaptureOpen) {
          closeQuickCapture();
        } else {
          openQuickCapture();
        }
        return;
      }

      if (metaOrCtrl && event.shiftKey && key === 'k') {
        event.preventDefault();
        if (isTaskModalOpen) {
          closeTaskModal();
        } else {
          if (isQuickCaptureOpen) {
            closeQuickCapture();
          }
          openTaskModal();
        }
        return;
      }

      if (event.key === 'Escape') {
        if (isQuickCaptureOpen) {
          closeQuickCapture();
          event.preventDefault();
        } else if (isTaskModalOpen) {
          closeTaskModal();
          event.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    closeQuickCapture,
    closeTaskModal,
    isQuickCaptureOpen,
    isTaskModalOpen,
    openQuickCapture,
    openTaskModal,
  ]);
}


