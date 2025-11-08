import { z } from 'zod';

/**
 * Zod validation schemas for forms and data validation
 */

export const recurrenceRuleSchema = z.object({
  type: z.enum(['daily', 'weekly', 'monthly', 'yearly', 'custom']),
  interval: z.number().int().positive(),
  endDate: z.date().optional(),
  count: z.number().int().positive().optional(),
  daysOfWeek: z.array(z.number().int().min(0).max(6)).optional(),
  dayOfMonth: z.number().int().min(1).max(31).optional(),
});

export const taskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  status: z.enum(['pending', 'in-progress', 'completed', 'cancelled']).default('pending'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.date().optional().nullable(),
  completedAt: z.date().optional().nullable(),
  parentTaskId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).default([]),
  projectId: z.string().optional().nullable(),
  order: z.number().int().default(0),
  recurrenceRule: recurrenceRuleSchema.optional(),
  nextOccurrence: z.date().optional().nullable(),
  reminderDate: z.date().optional().nullable(),
});

export const taskCreateSchema = taskSchema.omit({
  id: true,
  completedAt: true,
});

export const taskUpdateSchema = taskSchema.partial();

export const tagSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required').max(50),
  color: z.string().optional(),
});

export const tagCreateSchema = tagSchema.omit({
  id: true,
});

export type TaskInput = z.infer<typeof taskSchema>;
export type TaskCreateInput = z.infer<typeof taskCreateSchema>;
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;

export type TagInput = z.infer<typeof tagSchema>;
export type TagCreateInput = z.infer<typeof tagCreateSchema>;

export type RecurrenceRuleInput = z.infer<typeof recurrenceRuleSchema>;

