import {
  addDays,
  format,
  isAfter,
  isBefore,
  isSameDay,
  set as setDateParts,
  startOfDay,
} from 'date-fns';
import type { Task, TaskPriority } from '@/utils/types';
import type { RecentTaskMeta } from '@/stores/taskStore';

const DEFAULT_DUE_HOUR = 17;

const isActiveTask = (task: Task) =>
  task.status !== 'completed' && task.status !== 'cancelled';

const getMode = <T extends string | number>(values: T[]): T | null => {
  const counts = new Map<T, number>();
  let maxCount = 0;
  let mode: T | null = null;

  values.forEach((value) => {
    const nextCount = (counts.get(value) ?? 0) + 1;
    counts.set(value, nextCount);
    if (nextCount > maxCount) {
      maxCount = nextCount;
      mode = value;
    }
  });

  return mode;
};

const getPreferredDueHour = (recentMeta: RecentTaskMeta[]): number | null => {
  const hours = recentMeta
    .map((meta) => meta.dueHour)
    .filter((hour): hour is number => typeof hour === 'number');
  return hours.length > 0 ? getMode(hours) : null;
};

const countActiveTasksForDay = (tasks: Task[], day: Date): number =>
  tasks.filter(
    (task) =>
      task.dueDate &&
      isSameDay(task.dueDate, day) &&
      task.status !== 'completed' &&
      task.status !== 'cancelled'
  ).length;

const buildDueDateLabel = (target: Date, base: Date) => {
  if (isSameDay(target, base)) {
    return 'Later today';
  }

  const tomorrow = addDays(startOfDay(base), 1);
  if (isSameDay(target, tomorrow)) {
    return 'Tomorrow';
  }

  return `Next ${format(target, 'EEEE')}`;
};

const setHour = (date: Date, hour: number, minutes = 0) =>
  setDateParts(date, { hours: hour, minutes, seconds: 0, milliseconds: 0 });

export interface DueDateCandidate {
  id: string;
  date: Date;
  description: string;
  isRecommended: boolean;
}

export interface PriorityCandidate {
  id: string;
  priority: TaskPriority;
  description: string;
  isRecommended: boolean;
}

export interface SuggestionContext {
  tasks?: Task[];
  recentMeta?: RecentTaskMeta[];
  now?: Date;
}

export const suggestDueDateCandidates = ({
  tasks = [],
  recentMeta = [],
  now: nowInput,
}: SuggestionContext): DueDateCandidate[] => {
  const now = nowInput ? new Date(nowInput) : new Date();
  const todayStart = startOfDay(now);
  const activeTasks = tasks.filter(isActiveTask);
  const preferredHour = getPreferredDueHour(recentMeta) ?? DEFAULT_DUE_HOUR;
  const todayAtPreferred = setHour(todayStart, preferredHour);

  const averageDailyLoad =
    activeTasks.length > 0 ? Math.round(activeTasks.length / 7) : 0;
  const loadThreshold = Math.max(2, averageDailyLoad);
  const tasksDueToday = countActiveTasksForDay(activeTasks, now);

  const candidates: DueDateCandidate[] = [];

  if (isAfter(todayAtPreferred, now) && tasksDueToday <= loadThreshold) {
    candidates.push({
      id: 'today',
      date: todayAtPreferred,
      description: `Today · ${format(todayAtPreferred, 'h:mm a')}`,
      isRecommended: true,
    });
  }

  const tomorrow = addDays(todayStart, 1);
  const tomorrowAtPreferred = setHour(tomorrow, preferredHour);
  candidates.push({
    id: 'tomorrow',
    date: tomorrowAtPreferred,
    description: `Tomorrow · ${format(tomorrowAtPreferred, 'h:mm a')}`,
    isRecommended: candidates.length === 0,
  });

  let lightestDay = tomorrowAtPreferred;
  let lightestLoad = countActiveTasksForDay(activeTasks, tomorrow);
  for (let offset = 2; offset <= 7; offset += 1) {
    const candidateDay = addDays(todayStart, offset);
    const load = countActiveTasksForDay(activeTasks, candidateDay);
    if (load < lightestLoad) {
      lightestLoad = load;
      lightestDay = setHour(candidateDay, preferredHour);
    }
    if (lightestLoad === 0) {
      break;
    }
  }

  const isDuplicateOfTomorrow =
    Math.abs(lightestDay.getTime() - tomorrowAtPreferred.getTime()) < 60 * 1000;

  if (!isDuplicateOfTomorrow) {
    candidates.push({
      id: 'next-light-day',
      date: lightestDay,
      description: `${buildDueDateLabel(lightestDay, now)} · ${format(
        lightestDay,
        'h:mm a'
      )}`,
      isRecommended: candidates.every((candidate) => !candidate.isRecommended),
    });
  }

  return candidates;
};

export const suggestPriorityCandidates = ({
  tasks = [],
  recentMeta = [],
  now: nowInput,
}: SuggestionContext): PriorityCandidate[] => {
  const now = nowInput ? new Date(nowInput) : new Date();
  const activeTasks = tasks.filter(isActiveTask);
  const overdueCount = activeTasks.filter(
    (task) => task.dueDate && isBefore(task.dueDate, now)
  ).length;
  const inProgressCount = activeTasks.filter(
    (task) => task.status === 'in-progress'
  ).length;

  const priorityMode = getMode(
    recentMeta.map((meta) => meta.priority)
  ) as TaskPriority | null;

  let recommended: TaskPriority = priorityMode ?? 'medium';
  let description = priorityMode
    ? 'Matches your recent tasks'
    : 'Balanced default priority';

  if (overdueCount > 0) {
    recommended = 'high';
    description =
      overdueCount === 1
        ? 'You have 1 overdue task'
        : `You have ${overdueCount} overdue tasks`;
  } else if (inProgressCount >= 3 && recommended !== 'high') {
    recommended = 'medium';
    description = 'You already have several tasks in progress';
  } else if (!priorityMode) {
    recommended = 'medium';
    description = 'Start in the active queue';
  }

  const genericDescriptions: Record<TaskPriority, string> = {
    high: 'Great for urgent or overdue work',
    medium: 'Keeps the task in your active queue',
    low: 'Ideal for flexible or nice-to-have items',
  };

  const orderedPriorities: TaskPriority[] = ['high', 'medium', 'low'];

  const candidates: PriorityCandidate[] = [];
  orderedPriorities.forEach((priority) => {
    const isRecommended = priority === recommended;
    candidates.push({
      id: priority,
      priority,
      description: isRecommended ? description : genericDescriptions[priority],
      isRecommended,
    });
  });

  return candidates;
};


