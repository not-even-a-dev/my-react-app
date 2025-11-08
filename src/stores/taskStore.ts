import { create } from 'zustand';
import type { Task, TaskStatus, TaskPriority } from '@/utils/types';
import type { TaskCreateInput } from '@/utils/schemas';
import { taskAdapter } from '@/db/adapters';
import { getNextOccurrence } from '@/utils/recurrenceHelpers';
import {
  scheduleTaskReminder,
  cancelTaskReminder,
  rescheduleTaskReminders,
} from '@/utils/notificationService';

const RECENT_TASK_META_KEY = 'todo.recentTaskMeta';
const MAX_RECENT_TASK_META = 10;

export interface RecentTaskMeta {
  priority: TaskPriority;
  tagIds: string[];
  dueHour?: number;
  createdAt: Date;
}

const loadRecentTaskMeta = (): RecentTaskMeta[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(RECENT_TASK_META_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as Array<{
      priority: TaskPriority;
      tagIds?: string[];
      dueHour?: number;
      createdAt: string;
    }>;

    return parsed
      .map((item) => ({
        priority: item.priority,
        tagIds: item.tagIds ?? [],
        dueHour: typeof item.dueHour === 'number' ? item.dueHour : undefined,
        createdAt: new Date(item.createdAt),
      }))
      .filter((item) => !Number.isNaN(item.createdAt.getTime()));
  } catch (error) {
    console.warn('Failed to load recent task metadata', error);
    return [];
  }
};

const saveRecentTaskMeta = (meta: RecentTaskMeta[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const serializable = meta.map((item) => ({
      priority: item.priority,
      tagIds: item.tagIds,
      dueHour: item.dueHour,
      createdAt: item.createdAt.toISOString(),
    }));
    window.localStorage.setItem(RECENT_TASK_META_KEY, JSON.stringify(serializable));
  } catch (error) {
    console.warn('Failed to persist recent task metadata', error);
  }
};

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  filters: {
    status?: TaskStatus;
    priority?: TaskPriority;
    tagIds?: string[];
    projectId?: string;
    searchQuery?: string;
    dueDateRange?: { start: Date; end: Date };
  };
  selectedTaskId: string | null;
  recentTaskMeta: RecentTaskMeta[];
}

interface TaskActions {
  // Data operations
  loadTasks: (userId?: string) => Promise<void>;
  getTask: (id: string) => Task | undefined;
  createTask: (input: TaskCreateInput, userId?: string) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  uncompleteTask: (id: string) => Promise<void>;

  // Filtering and querying
  setFilter: (filter: Partial<TaskState['filters']>) => void;
  clearFilters: () => void;
  getFilteredTasks: () => Task[];

  // Reordering
  reorderTasks: (taskIds: string[]) => Promise<void>;
  moveTask: (taskId: string, newOrder: number) => Promise<void>;

  // Selection
  selectTask: (id: string | null) => void;

  // Queries
  getTasksByStatus: (status: TaskStatus) => Task[];
  getOverdueTasks: (userId?: string) => Promise<Task[]>;
  getDueTodayTasks: (userId?: string) => Promise<Task[]>;
  getSubtasks: (parentTaskId: string) => Task[];

  // Reset
  reset: () => void;
}

const initialState: TaskState = {
  tasks: [],
  isLoading: false,
  error: null,
  filters: {},
  selectedTaskId: null,
  recentTaskMeta: loadRecentTaskMeta(),
};

export const useTaskStore = create<TaskState & TaskActions>((set, get) => ({
  ...initialState,

  // Load all tasks
  loadTasks: async (userId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await taskAdapter.getAll(userId);
      // Sort by order, then by due date, then by creation date
      tasks.sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        if (a.dueDate && b.dueDate) {
          return a.dueDate.getTime() - b.dueDate.getTime();
        }
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return a.createdAt.getTime() - b.createdAt.getTime();
      });
      await rescheduleTaskReminders(tasks);
      set({ tasks, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load tasks',
        isLoading: false,
      });
    }
  },

  // Get single task
  getTask: (id: string) => {
    return get().tasks.find((task) => task.id === id);
  },

  // Create task
  createTask: async (input: TaskCreateInput, userId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const createInput: TaskCreateInput = { ...input };
      if (createInput.recurrenceRule && createInput.dueDate) {
        const next = getNextOccurrence(
          createInput.recurrenceRule,
          createInput.dueDate,
          createInput.dueDate
        );
        createInput.nextOccurrence = next ?? undefined;
      } else if (createInput.nextOccurrence === null) {
        createInput.nextOccurrence = undefined;
      }

      const task = await taskAdapter.create(createInput, userId);
      await scheduleTaskReminder(task);
      set((state) => ({
        tasks: [...state.tasks, task],
        recentTaskMeta: (() => {
          const entry: RecentTaskMeta = {
            priority: task.priority,
            tagIds: task.tagIds || [],
            dueHour: task.dueDate ? task.dueDate.getHours() : undefined,
            createdAt: new Date(),
          };
          const updated = [entry, ...state.recentTaskMeta].slice(0, MAX_RECENT_TASK_META);
          saveRecentTaskMeta(updated);
          return updated;
        })(),
        isLoading: false,
      }));
      return task;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create task',
        isLoading: false,
      });
      throw error;
    }
  },

  // Update task
  updateTask: async (id: string, updates: Partial<Task>) => {
    set({ isLoading: true, error: null });
    try {
      const existing = get().tasks.find((task) => task.id === id);
      const updatesWithRecurrence: Partial<Task> = { ...updates };

      if (existing) {
        const merged: Task = { ...existing, ...updatesWithRecurrence };
        if (merged.recurrenceRule && merged.dueDate) {
          const next = getNextOccurrence(
            merged.recurrenceRule,
            merged.dueDate,
            merged.dueDate
          );
          updatesWithRecurrence.nextOccurrence = next ?? undefined;
        } else if (
          Object.prototype.hasOwnProperty.call(updatesWithRecurrence, 'recurrenceRule') &&
          !merged.recurrenceRule
        ) {
          updatesWithRecurrence.nextOccurrence = undefined;
        }
      }

      const updatedTaskRecord = await taskAdapter.update(id, updatesWithRecurrence);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? updatedTaskRecord : task
        ),
        recentTaskMeta: (() => {
          if (!updatedTaskRecord) {
            return state.recentTaskMeta;
          }
          const entry: RecentTaskMeta = {
            priority: updatedTaskRecord.priority,
            tagIds: updatedTaskRecord.tagIds || [],
            dueHour: updatedTaskRecord.dueDate ? updatedTaskRecord.dueDate.getHours() : undefined,
            createdAt: new Date(),
          };
          const updated = [entry, ...state.recentTaskMeta].slice(0, MAX_RECENT_TASK_META);
          saveRecentTaskMeta(updated);
          return updated;
        })(),
        isLoading: false,
      }));
      await scheduleTaskReminder(updatedTaskRecord);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update task',
        isLoading: false,
      });
    }
  },

  // Delete task
  deleteTask: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await taskAdapter.delete(id);
      cancelTaskReminder(id);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        selectedTaskId:
          state.selectedTaskId === id ? null : state.selectedTaskId,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete task',
        isLoading: false,
      });
    }
  },

  // Complete task
  completeTask: async (id: string) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task || task.status === 'completed') return;

    await get().updateTask(id, {
      status: 'completed',
      completedAt: new Date(),
      nextOccurrence: undefined,
    });

    if (task.recurrenceRule && task.dueDate) {
      const nextDate = getNextOccurrence(task.recurrenceRule, task.dueDate, task.dueDate);
      if (nextDate) {
        const nextTask: TaskCreateInput = {
          title: task.title,
          description: task.description,
          status: 'pending',
          priority: task.priority,
          dueDate: nextDate,
          tagIds: [...task.tagIds],
          recurrenceRule: task.recurrenceRule,
          projectId: task.projectId,
          reminderDate: task.reminderDate,
          order: task.order,
        };

        await get().createTask(nextTask, task.userId);
      }
    }
  },

  // Uncomplete task
  uncompleteTask: async (id: string) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task || task.status !== 'completed') return;

    await get().updateTask(id, {
      status: 'pending',
      completedAt: undefined,
    });
  },

  // Set filter
  setFilter: (filter: Partial<TaskState['filters']>) => {
    set((state) => ({
      filters: { ...state.filters, ...filter },
    }));
  },

  // Clear filters
  clearFilters: () => {
    set({ filters: {} });
  },

  // Get filtered tasks
  getFilteredTasks: () => {
    const { tasks, filters } = get();
    let filtered = [...tasks];

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter((task) => task.status === filters.status);
    }

    // Filter by priority
    if (filters.priority) {
      filtered = filtered.filter((task) => task.priority === filters.priority);
    }

    // Filter by tags
    if (filters.tagIds && filters.tagIds.length > 0) {
      filtered = filtered.filter((task) =>
        filters.tagIds!.some((tagId) => task.tagIds.includes(tagId))
      );
    }

    // Filter by project
    if (filters.projectId) {
      filtered = filtered.filter((task) => task.projectId === filters.projectId);
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
      );
    }

    // Filter by due date range
    if (filters.dueDateRange) {
      const { start, end } = filters.dueDateRange;
      filtered = filtered.filter((task) => {
        if (!task.dueDate) return false;
        const dueDate = task.dueDate.getTime();
        return dueDate >= start.getTime() && dueDate <= end.getTime();
      });
    }

    return filtered;
  },

  // Reorder tasks
  reorderTasks: async (taskIds: string[]) => {
    try {
      await taskAdapter.reorder(taskIds);
      // Update local state
      const tasks = get().tasks;
      const taskMap = new Map(tasks.map((t) => [t.id, t]));
      const reorderedTasks = taskIds
        .map((id, index) => {
          const task = taskMap.get(id);
          return task ? { ...task, order: index } : null;
        })
        .filter((t): t is Task => t !== null);

      // Add any tasks not in the reordered list
      const remainingTasks = tasks.filter(
        (task) => !taskIds.includes(task.id)
      );
      const maxOrder = reorderedTasks.length > 0
        ? Math.max(...reorderedTasks.map((t) => t.order))
        : -1;

      const updatedRemaining = remainingTasks.map((task, index) => ({
        ...task,
        order: maxOrder + 1 + index,
      }));

      set({ tasks: [...reorderedTasks, ...updatedRemaining] });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to reorder tasks',
      });
    }
  },

  // Move task to new order position
  moveTask: async (taskId: string, newOrder: number) => {
    const tasks = get().tasks;
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return;

    const reorderedTasks = [...tasks];
    const [movedTask] = reorderedTasks.splice(taskIndex, 1);
    reorderedTasks.splice(newOrder, 0, movedTask);

    const taskIds = reorderedTasks.map((t) => t.id);
    await get().reorderTasks(taskIds);
  },

  // Select task
  selectTask: (id: string | null) => {
    set({ selectedTaskId: id });
  },

  // Get tasks by status
  getTasksByStatus: (status: TaskStatus) => {
    return get().tasks.filter((task) => task.status === status);
  },

  // Get overdue tasks
  getOverdueTasks: async (userId?: string) => {
    return taskAdapter.getOverdue(userId);
  },

  // Get due today tasks
  getDueTodayTasks: async (userId?: string) => {
    return taskAdapter.getDueToday(userId);
  },

  // Get subtasks
  getSubtasks: (parentTaskId: string) => {
    return get().tasks.filter((task) => task.parentTaskId === parentTaskId);
  },

  // Reset store
  reset: () => {
    void rescheduleTaskReminders([]);
    set({
      ...initialState,
      recentTaskMeta: loadRecentTaskMeta(),
    });
  },
}));

