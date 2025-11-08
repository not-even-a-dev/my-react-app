/**
 * Type definitions for the Student To-Do App
 */

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export type TaskPriority = 'low' | 'medium' | 'high';

export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface Tag {
  id: string;
  userId?: string; // User who owns the tag
  name: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecurrenceRule {
  type: RecurrenceType;
  interval: number; // e.g., every 2 days, every 3 weeks
  endDate?: Date;
  count?: number; // number of occurrences
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number; // 1-31
}

export interface Task {
  id: string;
  userId?: string; // User who owns the task
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  parentTaskId?: string; // For subtasks
  tagIds: string[];
  projectId?: string;
  order: number; // For drag-and-drop reordering
  recurrenceRule?: RecurrenceRule;
  nextOccurrence?: Date; // For recurring tasks
  reminderDate?: Date; // For notifications
}

export interface Event {
  id: string;
  type: 'task_created' | 'task_completed' | 'badge_earned';
  entityId: string; // Task ID
  entityType: 'task';
  timestamp: Date;
  metadata?: Record<string, unknown>; // Additional event data
}

export interface Notification {
  id: string;
  type: 'task_due' | 'task_reminder';
  title: string;
  message: string;
  entityId?: string;
  entityType?: 'task';
  scheduledFor: Date;
  sent: boolean;
  sentAt?: Date;
}

export interface UserStats {
  tasksCompleted: number;
  points: number;
  badges: string[];
}

