import type { Task } from '@/utils/types';
import { recurrenceRuleToRRule } from '@/utils/recurrenceHelpers';

const formatDateForICS = (date: Date) =>
  date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');

const escapeICSText = (text: string) =>
  text
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');

const buildEvent = (task: Task, dtStamp: string): string | null => {
  if (!task.dueDate) {
    return null;
  }

  const start = formatDateForICS(task.dueDate);
  const end = formatDateForICS(new Date(task.dueDate.getTime() + 30 * 60 * 1000));

  const lines = [
    'BEGIN:VEVENT',
    `UID:${task.id}@todo-app`,
    `DTSTAMP:${dtStamp}`,
    `SUMMARY:${escapeICSText(task.title)}`,
    `DESCRIPTION:${escapeICSText(task.description ?? '')}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `STATUS:${task.status === 'completed' ? 'COMPLETED' : 'CONFIRMED'}`,
    `PRIORITY:${task.priority === 'high' ? 1 : task.priority === 'medium' ? 5 : 9}`,
  ];

  if (task.recurrenceRule) {
    const rule = recurrenceRuleToRRule(task.recurrenceRule, task.dueDate);
    lines.push(`RRULE:${rule}`);
  }

  if (task.reminderDate) {
    const triggerDiff = task.dueDate.getTime() - task.reminderDate.getTime();
    if (triggerDiff >= 0) {
      const minutes = Math.round(triggerDiff / 60000);
      lines.push(
        'BEGIN:VALARM',
        `TRIGGER:-PT${minutes}M`,
        'ACTION:DISPLAY',
        `DESCRIPTION:Reminder for ${escapeICSText(task.title)}`,
        'END:VALARM'
      );
    }
  }

  lines.push('END:VEVENT');
  return lines.join('\r\n');
};

export const generateICalendar = (tasks: Task[]): string => {
  const dtStamp = formatDateForICS(new Date());
  const events = tasks
    .map((task) => buildEvent(task, dtStamp))
    .filter((event): event is string => Boolean(event));

  const calendarLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Student ToDo App//EN',
    'CALSCALE:GREGORIAN',
    ...events,
    'END:VCALENDAR',
  ];

  return calendarLines.join('\r\n');
};

export const downloadICalendar = (tasks: Task[], filename = 'todo-tasks.ics') => {
  const calendar = generateICalendar(tasks);
  const blob = new Blob([calendar], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};


