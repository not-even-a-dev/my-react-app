import {
  startOfDay,
  endOfDay,
  isToday,
  isTomorrow,
  isPast,
  isFuture,
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from 'date-fns';

/**
 * Date utility functions for the app
 */

/**
 * Format date for display
 */
export function formatDate(date: Date, formatStr: string = 'MMM d, yyyy'): string {
  return format(date, formatStr);
}

/**
 * Format time for display
 */
export function formatTime(date: Date): string {
  return format(date, 'h:mm a');
}

/**
 * Format date and time for display
 */
export function formatDateTime(date: Date): string {
  return format(date, 'MMM d, yyyy h:mm a');
}

/**
 * Get relative date string (Today, Tomorrow, Yesterday, or formatted date)
 */
export function getRelativeDate(date: Date): string {
  if (isToday(date)) {
    return 'Today';
  }
  if (isTomorrow(date)) {
    return 'Tomorrow';
  }

  const daysDiff = differenceInDays(date, new Date());
  if (daysDiff === -1) {
    return 'Yesterday';
  }
  if (daysDiff > 0 && daysDiff <= 7) {
    return format(date, 'EEEE'); // Day name
  }

  return formatDate(date);
}

/**
 * Get relative time string (in X minutes, X hours, etc.)
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const minutesDiff = differenceInMinutes(date, now);
  const hoursDiff = differenceInHours(date, now);
  const daysDiff = differenceInDays(date, now);

  if (Math.abs(minutesDiff) < 60) {
    return `${Math.abs(minutesDiff)} ${Math.abs(minutesDiff) === 1 ? 'minute' : 'minutes'} ${minutesDiff < 0 ? 'ago' : ''}`;
  }
  if (Math.abs(hoursDiff) < 24) {
    return `${Math.abs(hoursDiff)} ${Math.abs(hoursDiff) === 1 ? 'hour' : 'hours'} ${hoursDiff < 0 ? 'ago' : ''}`;
  }
  if (Math.abs(daysDiff) < 7) {
    return `${Math.abs(daysDiff)} ${Math.abs(daysDiff) === 1 ? 'day' : 'days'} ${daysDiff < 0 ? 'ago' : ''}`;
  }

  return formatDate(date);
}

/**
 * Check if date is overdue
 */
export function isOverdue(date: Date): boolean {
  return isPast(date) && !isToday(date);
}

/**
 * Get start and end of day for a given date
 */
export function getDayBounds(date: Date): { start: Date; end: Date } {
  return {
    start: startOfDay(date),
    end: endOfDay(date),
  };
}

/**
 * Get start and end of week for a given date
 */
export function getWeekBounds(date: Date): { start: Date; end: Date } {
  return {
    start: startOfWeek(date, { weekStartsOn: 0 }), // Sunday
    end: endOfWeek(date, { weekStartsOn: 0 }),
  };
}

/**
 * Get start and end of month for a given date
 */
export function getMonthBounds(date: Date): { start: Date; end: Date } {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
}

/**
 * Get dates for the next N days
 */
export function getNextDays(count: number, startDate: Date = new Date()): Date[] {
  return Array.from({ length: count }, (_, i) => addDays(startDate, i));
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return format(date1, 'yyyy-MM-dd') === format(date2, 'yyyy-MM-dd');
}

/**
 * Get days until date (negative if past)
 */
export function getDaysUntil(date: Date): number {
  return differenceInDays(date, new Date());
}

