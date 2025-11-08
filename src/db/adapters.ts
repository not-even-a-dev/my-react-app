import { db } from './database';
import type { Task, Tag } from '@/utils/types';
import type { TaskCreateInput, TagCreateInput } from '@/utils/schemas';

/**
 * Database adapter functions for CRUD operations
 */

// Task operations
export const taskAdapter = {
  async getAll(userId?: string): Promise<Task[]> {
    if (userId) {
      return db.tasks.where('userId').equals(userId).toArray();
    }
    return db.tasks.toArray();
  },

  async getById(id: string): Promise<Task | undefined> {
    return db.tasks.get(id);
  },

  async getByStatus(status: Task['status'], userId?: string): Promise<Task[]> {
    if (userId) {
      return db.tasks
        .where('[userId+status]')
        .equals([userId, status])
        .toArray();
    }
    return db.tasks.where('status').equals(status).toArray();
  },

  async getByTagIds(tagIds: string[]): Promise<Task[]> {
    if (tagIds.length === 0) return [];
    return db.tasks.filter((task) =>
      task.tagIds.some((tagId) => tagIds.includes(tagId))
    ).toArray();
  },

  async getSubtasks(parentTaskId: string): Promise<Task[]> {
    return db.tasks.where('parentTaskId').equals(parentTaskId).toArray();
  },

  async getOverdue(userId?: string): Promise<Task[]> {
    const now = new Date();
    if (userId) {
      const tasks = await db.tasks
        .where('[userId+status]')
        .anyOf([
          [userId, 'pending'],
          [userId, 'in-progress'],
        ])
        .toArray();
      return tasks.filter(
        (task) =>
          task.dueDate && task.dueDate < now && task.status !== 'completed' && task.status !== 'cancelled'
      );
    }
    return db.tasks
      .where('dueDate')
      .below(now)
      .and((task) => task.status !== 'completed' && task.status !== 'cancelled')
      .toArray();
  },

  async getDueToday(userId?: string): Promise<Task[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (userId) {
      const tasks = await db.tasks.where('userId').equals(userId).toArray();
      return tasks.filter(
        (task) =>
          task.dueDate &&
          task.dueDate >= today &&
          task.dueDate < tomorrow &&
          task.status !== 'completed' &&
          task.status !== 'cancelled'
      );
    }
    return db.tasks
      .where('dueDate')
      .between(today, tomorrow, true, false)
      .and((task) => task.status !== 'completed' && task.status !== 'cancelled')
      .toArray();
  },

  async create(input: TaskCreateInput, userId?: string): Promise<Task> {
    const now = new Date();
    const task: Task = {
      id: crypto.randomUUID(),
      userId,
      ...input,
      dueDate: input.dueDate ?? undefined,
      parentTaskId: input.parentTaskId ?? undefined,
      projectId: input.projectId ?? undefined,
      nextOccurrence: input.nextOccurrence ?? undefined,
      reminderDate: input.reminderDate ?? undefined,
      createdAt: now,
      updatedAt: now,
      tagIds: input.tagIds || [],
      order: input.order ?? (await this.getMaxOrder(userId)) + 1,
    };

    await db.tasks.add(task);
    return task;
  },

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    const task = await db.tasks.get(id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }

    const updated: Task = {
      ...task,
      ...updates,
      updatedAt: new Date(),
    };

    await db.tasks.put(updated);
    return updated;
  },

  async delete(id: string): Promise<void> {
    // Also delete subtasks
    const subtasks = await this.getSubtasks(id);
    for (const subtask of subtasks) {
      await db.tasks.delete(subtask.id);
    }
    await db.tasks.delete(id);
  },

  async getMaxOrder(userId?: string): Promise<number> {
    const tasks = await this.getAll(userId);
    return tasks.length > 0 ? Math.max(...tasks.map((t) => t.order)) : -1;
  },

  async reorder(taskIds: string[]): Promise<void> {
    const updates = taskIds.map((id, index) =>
      db.tasks.update(id, { order: index })
    );
    await Promise.all(updates);
  },
};

// Tag operations
export const tagAdapter = {
  async getAll(userId?: string): Promise<Tag[]> {
    if (userId) {
      return db.tags.where('userId').equals(userId).toArray();
    }
    return db.tags.toArray();
  },

  async getById(id: string): Promise<Tag | undefined> {
    return db.tags.get(id);
  },

  async getByName(name: string, userId?: string): Promise<Tag | undefined> {
    if (userId) {
      return db.tags
        .where('name')
        .equals(name)
        .filter((tag) => tag.userId === userId)
        .first();
    }
    return db.tags.where('name').equals(name).first();
  },

  async create(input: TagCreateInput, userId?: string): Promise<Tag> {
    const now = new Date();
    const tag: Tag = {
      id: crypto.randomUUID(),
      userId,
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    await db.tags.add(tag);
    return tag;
  },

  async update(id: string, updates: Partial<Tag>): Promise<Tag> {
    const tag = await db.tags.get(id);
    if (!tag) {
      throw new Error(`Tag with id ${id} not found`);
    }

    const updated: Tag = {
      ...tag,
      ...updates,
      updatedAt: new Date(),
    };

    await db.tags.put(updated);
    return updated;
  },

  async delete(id: string): Promise<void> {
    // Remove tag from all tasks
    const tasks = await db.tasks.toArray();
    for (const task of tasks) {
      if (task.tagIds.includes(id)) {
        await db.tasks.update(task.id, {
          tagIds: task.tagIds.filter((tagId) => tagId !== id),
        });
      }
    }
    await db.tags.delete(id);
  },
};

