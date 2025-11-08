import type { Task } from '@/utils/types';

const scheduledReminders = new Map<string, number>();

const hasNotificationSupport =
  typeof window !== 'undefined' && 'Notification' in window;

const canUseServiceWorker =
  typeof window !== 'undefined' && 'serviceWorker' in navigator;

const showTaskNotification = async (task: Task) => {
  if (!hasNotificationSupport) {
    return;
  }

  const notificationOptions: NotificationOptions = {
    body: task.description || 'Task reminder',
    tag: task.id,
    data: {
      taskId: task.id,
    },
  };

  if (canUseServiceWorker) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(task.title, notificationOptions);
      return;
    } catch (error) {
      console.warn('Service worker notification failed, falling back', error);
    }
  }

  // Fallback to direct Notification API
  // eslint-disable-next-line no-new
  new Notification(task.title, notificationOptions);
};

export const isNotificationSupported = hasNotificationSupport;

export const ensureNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!hasNotificationSupport) {
    return 'denied';
  }

  if (Notification.permission === 'default') {
    return Notification.requestPermission();
  }

  return Notification.permission;
};

export const cancelTaskReminder = (taskId: string) => {
  const existing = scheduledReminders.get(taskId);
  if (existing !== undefined) {
    window.clearTimeout(existing);
    scheduledReminders.delete(taskId);
  }
};

export const scheduleTaskReminder = async (task: Task) => {
  if (!hasNotificationSupport) {
    return;
  }

  if (
    !task.reminderDate ||
    task.status === 'completed' ||
    task.status === 'cancelled'
  ) {
    cancelTaskReminder(task.id);
    return;
  }

  const permission = await ensureNotificationPermission();
  if (permission !== 'granted') {
    cancelTaskReminder(task.id);
    return;
  }

  const delay = task.reminderDate.getTime() - Date.now();
  if (delay <= 0) {
    await showTaskNotification(task);
    cancelTaskReminder(task.id);
    return;
  }

  cancelTaskReminder(task.id);
  const timeoutId = window.setTimeout(async () => {
    await showTaskNotification(task);
    scheduledReminders.delete(task.id);
  }, delay);
  scheduledReminders.set(task.id, timeoutId);
};

export const rescheduleTaskReminders = async (tasks: Task[]) => {
  if (!hasNotificationSupport) {
    return;
  }

  scheduledReminders.forEach((timeoutId) => {
    window.clearTimeout(timeoutId);
  });
  scheduledReminders.clear();

  for (const task of tasks) {
    await scheduleTaskReminder(task);
  }
};


