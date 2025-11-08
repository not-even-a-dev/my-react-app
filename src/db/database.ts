import Dexie, { Table } from 'dexie';
import type { Task, Tag, Event } from '@/utils/types';

/**
 * Dexie database instance for IndexedDB storage
 */
export class AppDatabase extends Dexie {
  tasks!: Table<Task, string>;
  tags!: Table<Tag, string>;
  events!: Table<Event, string>;

  constructor() {
    super('TodoApp');

    // Define database schema with indexes for common queries
    // Note: To add userId, we need to migrate to a new version
    this.version(1).stores({
      tasks: 'id, status, dueDate, parentTaskId, createdAt, order, [status+dueDate]',
      tags: 'id, name',
      events: 'id, type, entityId, timestamp, [entityType+timestamp]',
    });

    // Version 2: Add userId index for multi-user support
    this.version(2).stores({
      tasks: 'id, status, dueDate, parentTaskId, createdAt, order, userId, [status+dueDate], [userId+status]',
      tags: 'id, name, userId',
      events: 'id, type, entityId, timestamp, [entityType+timestamp]',
    });
  }
}

// Create and export database instance
export const db = new AppDatabase();

/**
 * Initialize database
 */
export async function initDatabase(): Promise<void> {
  try {
    await db.open();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

