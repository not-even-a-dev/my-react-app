import { format, startOfDay } from 'date-fns';
import type { Task, TaskPriority } from '@/utils/types';
import type { RecentTaskMeta } from '@/stores/taskStore';
import {
  suggestDueDateCandidates,
  suggestPriorityCandidates,
} from '@/utils/schedulingHelpers';

export type QuickSuggestionType = 'dueDate' | 'priority';

export interface QuickSuggestion {
  id: string;
  label: string;
  description?: string;
  type: QuickSuggestionType;
  value: Date | TaskPriority | null;
  isRecommended?: boolean;
}

export interface QuickSuggestionGroup {
  id: string;
  title: string;
  suggestions: QuickSuggestion[];
}

export interface QuickSuggestionContext {
  now?: Date;
  tasks?: Task[];
  recentMeta?: RecentTaskMeta[];
}

const buildDueLabel = (date: Date, now: Date) => {
  const today = startOfDay(now);
  const tomorrow = startOfDay(new Date(today.getTime() + 86_400_000));

  if (date >= today && date < new Date(today.getTime() + 86_400_000)) {
    return 'Later today';
  }
  if (date >= tomorrow && date < new Date(tomorrow.getTime() + 86_400_000)) {
    return 'Tomorrow';
  }
  return `Next ${format(date, 'EEEE')}`;
};

export const getQuickCaptureSuggestionGroups = (
  context: QuickSuggestionContext = {}
): QuickSuggestionGroup[] => {
  const now = context.now ? new Date(context.now) : new Date();
  const tasks = context.tasks ?? [];
  const recentMeta = context.recentMeta ?? [];

  const dueCandidates = suggestDueDateCandidates({
    now,
    tasks,
    recentMeta,
  });

  const dueDateSuggestions: QuickSuggestion[] = dueCandidates.map((candidate) => ({
    id: `due-${candidate.id}`,
    label: buildDueLabel(candidate.date, now),
    description: candidate.description,
    type: 'dueDate',
    value: candidate.date,
    isRecommended: candidate.isRecommended,
  }));

  dueDateSuggestions.push({
    id: 'due-none',
    label: 'No due date',
    type: 'dueDate',
    value: null,
  });

  const priorityCandidates = suggestPriorityCandidates({
    now,
    tasks,
    recentMeta,
  });

  const priorityLabelMap: Record<TaskPriority, string> = {
    high: 'High priority',
    medium: 'Standard priority',
    low: 'Low priority',
  };

  const prioritySuggestions: QuickSuggestion[] = priorityCandidates.map(
    (candidate) => ({
      id: `priority-${candidate.id}`,
      label: priorityLabelMap[candidate.priority],
      description: candidate.description,
      type: 'priority',
      value: candidate.priority,
      isRecommended: candidate.isRecommended,
    })
  );

  return [
    {
      id: 'due-dates',
      title: 'Suggested due times',
      suggestions: dueDateSuggestions,
    },
    {
      id: 'priority',
      title: 'Priority shortcuts',
      suggestions: prioritySuggestions,
    },
  ];
};


