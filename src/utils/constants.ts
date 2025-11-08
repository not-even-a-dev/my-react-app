/**
 * Application constants
 */

export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const;

export const TASK_STATUSES = ['pending', 'in-progress', 'completed', 'cancelled'] as const;

export const RECURRENCE_TYPES = ['daily', 'weekly', 'monthly', 'yearly', 'custom'] as const;

export const DEFAULT_COLORS = [
  '#A8D8EA', // pastel-blue
  '#FFB6C1', // pastel-pink
  '#E6E6FA', // pastel-purple
  '#B4E5D3', // pastel-green
  '#FFF9C4', // pastel-yellow
  '#FFD4A3', // pastel-orange
] as const;

export const PASTEL_COLORS = {
  blue: '#A8D8EA',
  pink: '#FFB6C1',
  purple: '#E6E6FA',
  green: '#B4E5D3',
  yellow: '#FFF9C4',
  orange: '#FFD4A3',
} as const;

