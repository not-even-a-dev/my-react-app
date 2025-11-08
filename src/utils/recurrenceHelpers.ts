import * as RRuleLib from 'rrule';
import type { RecurrenceRule } from '@/utils/types';

const { RRule, rrulestr } = RRuleLib;
const RRULE_WEEKDAY_BY_INDEX = [
  RRule.SU,
  RRule.MO,
  RRule.TU,
  RRule.WE,
  RRule.TH,
  RRule.FR,
  RRule.SA,
];

/**
 * Recurrence utility functions using rrule
 */

/**
 * Convert app RecurrenceRule to rrule string
 */
export function recurrenceRuleToRRule(
  rule: RecurrenceRule,
  startDate: Date
): string {
  const options: Partial<RRuleLib.Options> = {
    dtstart: startDate,
    freq: getRRuleFrequency(rule.type),
    interval: rule.interval,
  };

  if (rule.endDate) {
    options.until = rule.endDate;
  }

  if (rule.count) {
    options.count = rule.count;
  }

  if (rule.type === 'weekly' && rule.daysOfWeek && rule.daysOfWeek.length > 0) {
    options.byweekday = rule.daysOfWeek
      .map((day) => RRULE_WEEKDAY_BY_INDEX[day])
      .filter((weekday): weekday is RRuleLib.Weekday => Boolean(weekday));
  }

  if (rule.type === 'monthly' && rule.dayOfMonth) {
    options.bymonthday = rule.dayOfMonth;
  }

  const rrule = new RRule(options as RRuleLib.Options);
  return rrule.toString();
}

/**
 * Convert rrule string back to RecurrenceRule
 */
export function rruleToRecurrenceRule(rruleString: string): RecurrenceRule | null {
  try {
    const rrule = rrulestr(rruleString);
    const options = rrule.options;

    const type = getRecurrenceTypeFromFrequency(options.freq);

    return {
      type,
      interval: options.interval || 1,
      endDate: options.until ?? undefined,
      count: options.count ?? undefined,
      daysOfWeek: options.byweekday
        ? (Array.isArray(options.byweekday)
            ? options.byweekday
            : [options.byweekday]
          ).map((day) => {
            const weekday =
              typeof day === 'number'
                ? day
                : (day as RRuleLib.Weekday).weekday;
            return (weekday + 1) % 7;
          })
        : undefined,
      dayOfMonth: Array.isArray(options.bymonthday)
        ? options.bymonthday[0] ?? undefined
        : options.bymonthday ?? undefined,
    };
  } catch (error) {
    console.error('Error parsing rrule:', error);
    return null;
  }
}

/**
 * Get next occurrence date for a recurrence rule
 */
export function getNextOccurrence(
  rule: RecurrenceRule,
  startDate: Date,
  currentDate?: Date
): Date | null {
  try {
    const rruleString = recurrenceRuleToRRule(rule, startDate);
    const rrule = rrulestr(rruleString);
    const after = currentDate || new Date();
    const next = rrule.after(after);

    return next || null;
  } catch (error) {
    console.error('Error getting next occurrence:', error);
    return null;
  }
}

/**
 * Get all occurrences for a date range
 */
export function getOccurrencesInRange(
  rule: RecurrenceRule,
  startDate: Date,
  rangeStart: Date,
  rangeEnd: Date
): Date[] {
  try {
    const rruleString = recurrenceRuleToRRule(rule, startDate);
    const rrule = rrulestr(rruleString);
    return rrule.between(rangeStart, rangeEnd, true);
  } catch (error) {
    console.error('Error getting occurrences in range:', error);
    return [];
  }
}

/**
 * Convert recurrence type to rrule frequency
 */
function getRRuleFrequency(type: RecurrenceRule['type']): RRuleLib.Frequency {
  switch (type) {
    case 'daily':
      return RRule.DAILY;
    case 'weekly':
      return RRule.WEEKLY;
    case 'monthly':
      return RRule.MONTHLY;
    case 'yearly':
      return RRule.YEARLY;
    case 'custom':
      return RRule.DAILY; // Default for custom
    default:
      return RRule.DAILY;
  }
}

/**
 * Convert rrule frequency to recurrence type
 */
function getRecurrenceTypeFromFrequency(freq?: RRuleLib.Frequency): RecurrenceRule['type'] {
  switch (freq) {
    case RRule.DAILY:
      return 'daily';
    case RRule.WEEKLY:
      return 'weekly';
    case RRule.MONTHLY:
      return 'monthly';
    case RRule.YEARLY:
      return 'yearly';
    default:
      return 'custom';
  }
}

/**
 * Format recurrence rule for display
 */
export function formatRecurrenceRule(rule: RecurrenceRule): string {
  const intervalText =
    rule.interval > 1 ? `every ${rule.interval} ` : '';

  switch (rule.type) {
    case 'daily':
      return `${intervalText}day${rule.interval > 1 ? 's' : ''}`;
    case 'weekly':
      if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const days = rule.daysOfWeek.map((day) => dayNames[day]).join(', ');
        return `${intervalText}week on ${days}`;
      }
      return `${intervalText}week`;
    case 'monthly':
      if (rule.dayOfMonth) {
        return `${intervalText}month on day ${rule.dayOfMonth}`;
      }
      return `${intervalText}month`;
    case 'yearly':
      return `${intervalText}year`;
    case 'custom':
      return 'Custom recurrence';
    default:
      return 'Recurring';
  }
}

