import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskCreateSchema, type TaskCreateInput } from '@/utils/schemas';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { Select } from '@/components/Select';
import { Button } from '@/components/Button';
import { useTagStore } from '@/stores/tagStore';
import { useAuthStore } from '@/stores/authStore';
import { useTaskStore } from '@/stores/taskStore';
import { cn } from '@/utils/cn';
import type { Task, TaskPriority, RecurrenceRule } from '@/utils/types';
import { format } from 'date-fns';
import { Calendar, Mic, MicOff, Sparkles } from 'lucide-react';
import {
  getQuickCaptureSuggestionGroups,
  type QuickSuggestion,
} from '@/utils/suggestions';
import { formatRecurrenceRule } from '@/utils/recurrenceHelpers';
import {
  ensureNotificationPermission,
  isNotificationSupported,
} from '@/utils/notificationService';

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent {
  results: ArrayLike<{
    isFinal: boolean;
    0?: {
      transcript: string;
    };
  }>;
}

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskCreateInput) => Promise<void>;
  onCancel: () => void;
  mode?: 'full' | 'quick';
  onSwitchToAdvanced?: () => void;
  onSwitchToQuick?: () => void;
}

export function TaskForm({
  task,
  onSubmit,
  onCancel,
  mode = 'full',
  onSwitchToAdvanced,
  onSwitchToQuick,
}: TaskFormProps) {
  const isQuickMode = mode === 'quick';
  const { user } = useAuthStore();
  const { tags, loadTags } = useTagStore();
  const { tasks: allTasks, recentTaskMeta } = useTaskStore();
  const notificationsAvailable = isNotificationSupported;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    getValues,
  } = useForm<TaskCreateInput>({
    resolver: zodResolver(taskCreateSchema),
    defaultValues: task
      ? {
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate,
          tagIds: task.tagIds,
          recurrenceRule: task.recurrenceRule,
          reminderDate: task.reminderDate,
        }
      : {
          priority: 'medium',
          status: 'pending',
          tagIds: [],
          recurrenceRule: undefined,
          reminderDate: undefined,
        },
  });

  useEffect(() => {
    loadTags(user?.uid);
  }, [loadTags, user]);

  useEffect(() => {
    register('recurrenceRule');
    register('reminderDate');
    if (isQuickMode) {
      register('priority');
      register('status');
      register('dueDate');
      register('tagIds');
      register('description');
    }
  }, [isQuickMode, register]);

  const selectedTagIds = watch('tagIds') || [];
  const dueDateValue = watch('dueDate');
  const priorityValue = watch('priority');
  const recurrenceRuleValue = (watch('recurrenceRule') as RecurrenceRule | undefined) ?? undefined;
  const recurrenceTypeValue = recurrenceRuleValue?.type ?? 'none';
  const reminderDateValue = watch('reminderDate');
  type ReminderPreset = 'none' | 'at_time' | '5m' | '1h' | '1d' | 'custom';
  const [reminderPreset, setReminderPreset] = useState<ReminderPreset>('none');
  const weekDayLabels = [
    { value: 0, label: 'Sun' },
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
  ];

  const handleRecurrenceTypeChange = (type: RecurrenceRule['type'] | 'none') => {
    if (type === 'none') {
      setValue('recurrenceRule', undefined, {
        shouldDirty: true,
        shouldTouch: true,
      });
      return;
    }

    const baseRule: RecurrenceRule = {
      type,
      interval: recurrenceRuleValue?.interval ?? 1,
    };

    if (type === 'weekly') {
      const defaultDay =
        recurrenceRuleValue?.daysOfWeek && recurrenceRuleValue.daysOfWeek.length > 0
          ? recurrenceRuleValue.daysOfWeek
          : [ (dueDateValue ?? new Date()).getDay() ];
      baseRule.daysOfWeek = defaultDay;
    }

    if (type === 'monthly') {
      baseRule.dayOfMonth =
        recurrenceRuleValue?.dayOfMonth ?? (dueDateValue?.getDate() ?? new Date().getDate());
    }

    if (recurrenceRuleValue?.endDate) {
      baseRule.endDate = recurrenceRuleValue.endDate;
    }

    setValue('recurrenceRule', baseRule, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const updateRecurrenceRule = (updates: Partial<RecurrenceRule>) => {
    if (!recurrenceRuleValue) {
      return;
    }
    const nextRule: RecurrenceRule = {
      ...recurrenceRuleValue,
      ...updates,
    };
    setValue('recurrenceRule', nextRule, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleIntervalChange = (value: string) => {
    if (!recurrenceRuleValue) return;
    const parsed = Number.parseInt(value, 10);
    const interval = Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
    updateRecurrenceRule({ interval });
  };

  const handleDayOfMonthChange = (value: string) => {
    if (!recurrenceRuleValue) return;
    let parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed) || parsed < 1) {
      parsed = 1;
    }
    if (parsed > 31) {
      parsed = 31;
    }
    updateRecurrenceRule({ dayOfMonth: parsed });
  };

  const toggleWeekday = (day: number) => {
    if (!recurrenceRuleValue) return;
    const currentDays = recurrenceRuleValue.daysOfWeek ?? [];
    const exists = currentDays.includes(day);
    let nextDays: number[];
    if (exists) {
      nextDays = currentDays.filter((d) => d !== day);
      if (nextDays.length === 0) {
        nextDays = [day];
      }
    } else {
      nextDays = [...currentDays, day].sort((a, b) => a - b);
    }
    updateRecurrenceRule({ daysOfWeek: nextDays });
  };

  const handleEndDateChange = (value: string) => {
    if (!recurrenceRuleValue) return;
    const endDate = value ? new Date(value) : undefined;
    updateRecurrenceRule({ endDate });
  };

  const computeReminderFromPreset = (due: Date, preset: ReminderPreset) => {
    const dueTime = due.getTime();
    switch (preset) {
      case 'at_time':
        return new Date(dueTime);
      case '5m':
        return new Date(dueTime - 5 * 60 * 1000);
      case '1h':
        return new Date(dueTime - 60 * 60 * 1000);
      case '1d':
        return new Date(dueTime - 24 * 60 * 60 * 1000);
      default:
        return new Date(dueTime);
    }
  };

  const handleReminderPresetChange = (preset: ReminderPreset) => {
    setReminderPreset(preset);
    if (preset !== 'none' && notificationsAvailable) {
      void ensureNotificationPermission();
    }
    if (preset === 'none') {
      setValue('reminderDate', undefined, {
        shouldDirty: true,
        shouldTouch: true,
      });
      return;
    }

    if (preset === 'custom') {
      if (!reminderDateValue && dueDateValue) {
        setValue('reminderDate', dueDateValue, {
          shouldDirty: false,
          shouldTouch: false,
        });
      }
      return;
    }

    if (!dueDateValue) {
      setValue('reminderDate', undefined, {
        shouldDirty: false,
        shouldTouch: false,
      });
      return;
    }

    const reminder = computeReminderFromPreset(dueDateValue, preset);
    setValue('reminderDate', reminder, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  useEffect(() => {
    if (!dueDateValue) {
      if (reminderPreset !== 'none' && reminderPreset !== 'custom') {
        setValue('reminderDate', undefined, {
          shouldDirty: false,
          shouldTouch: false,
        });
      }
      return;
    }

    if (reminderPreset === 'none' || reminderPreset === 'custom') {
      return;
    }

    const reminder = computeReminderFromPreset(dueDateValue, reminderPreset);
    setValue('reminderDate', reminder, {
      shouldDirty: false,
      shouldTouch: false,
    });
  }, [dueDateValue, reminderPreset, setValue]);

  useEffect(() => {
    if (!task?.reminderDate) {
      return;
    }
    setValue('reminderDate', task.reminderDate, {
      shouldDirty: false,
      shouldTouch: false,
    });
    if (task.dueDate) {
      const diff = task.dueDate.getTime() - task.reminderDate.getTime();
      if (diff === 0) {
        setReminderPreset('at_time');
      } else if (diff === 5 * 60 * 1000) {
        setReminderPreset('5m');
      } else if (diff === 60 * 60 * 1000) {
        setReminderPreset('1h');
      } else if (diff === 24 * 60 * 60 * 1000) {
        setReminderPreset('1d');
      } else {
        setReminderPreset('custom');
      }
    } else {
      setReminderPreset('custom');
    }
  }, [setValue, task]);

  const [showDetails, setShowDetails] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const initialRecommendationsApplied = useRef(false);

  const speechRecognitionCtor = useMemo<SpeechRecognitionConstructor | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    const anyWindow = window as unknown as {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    return (
      anyWindow.SpeechRecognition ??
      anyWindow.webkitSpeechRecognition ??
      null
    );
  }, []);

  const isSpeechSupported = Boolean(speechRecognitionCtor);

  useEffect(() => {
    if (!speechRecognitionCtor) {
      return;
    }
    const recognition = new speechRecognitionCtor();
    recognition.lang = typeof navigator !== 'undefined' ? navigator.language || 'en-US' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? '')
        .join(' ')
        .trim();

      if (transcript.length > 0) {
        const existing = getValues('title')?.trim();
        const combined = existing ? `${existing} ${transcript}` : transcript;
        setValue('title', combined.replace(/\s+/g, ' ').trim(), {
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [getValues, setValue, speechRecognitionCtor]);

  const handleFormSubmit = async (data: TaskCreateInput) => {
    await onSubmit(data);
  };

  const [dismissedRecommendationGroups, setDismissedRecommendationGroups] = useState<
    Set<string>
  >(new Set());

  const handleSuggestionClick = (groupId: string, suggestion: QuickSuggestion) => {
    if (suggestion.type === 'dueDate') {
      if (suggestion.value instanceof Date) {
        setValue('dueDate', suggestion.value, {
          shouldDirty: true,
          shouldTouch: true,
        });
      } else {
        setValue('dueDate', undefined, {
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    }

    if (suggestion.type === 'priority') {
      setValue('priority', suggestion.value as TaskPriority, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }

    setDismissedRecommendationGroups((prev) => {
      if (prev.has(groupId)) {
        return prev;
      }
      const next = new Set(prev);
      next.add(groupId);
      return next;
    });
  };

  const suggestionGroups = useMemo(
    () =>
      isQuickMode
        ? getQuickCaptureSuggestionGroups({
            tasks: allTasks,
            recentMeta: recentTaskMeta,
          })
        : [],
    [allTasks, isQuickMode, recentTaskMeta]
  );

  const recurrenceSummary = recurrenceRuleValue
    ? formatRecurrenceRule(recurrenceRuleValue)
    : 'Does not repeat';

  const renderRecurrenceSection = () => (
    <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <Select
          label="Repeat"
          value={recurrenceTypeValue}
          onChange={(event) =>
            handleRecurrenceTypeChange(event.target.value as RecurrenceRule['type'] | 'none')
          }
          options={[
            { value: 'none', label: 'Does not repeat' },
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
          ]}
        />
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
          {recurrenceSummary}
        </span>
      </div>

      {recurrenceTypeValue !== 'none' && recurrenceRuleValue && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Repeat every"
              type="number"
              min={1}
              value={recurrenceRuleValue.interval ?? 1}
              onChange={(event) => handleIntervalChange(event.target.value)}
            />
            <Input
              label="End date (optional)"
              type="date"
              value={
                recurrenceRuleValue.endDate
                  ? format(recurrenceRuleValue.endDate, 'yyyy-MM-dd')
                  : ''
              }
              onChange={(event) => handleEndDateChange(event.target.value)}
              helperText="Leave blank to repeat indefinitely"
            />
          </div>

          {recurrenceTypeValue === 'weekly' && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Repeat on</p>
              <div className="flex flex-wrap gap-2">
                {weekDayLabels.map((day) => {
                  const isSelected = recurrenceRuleValue.daysOfWeek?.includes(day.value) ?? false;
                  return (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleWeekday(day.value)}
                      className={cn(
                        'h-8 w-12 rounded-full text-sm font-semibold transition-all',
                        isSelected
                          ? 'bg-slate-600 text-white shadow-sm dark:bg-slate-500'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                      )}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {recurrenceTypeValue === 'monthly' && (
            <Input
              label="Day of month"
              type="number"
              min={1}
              max={31}
              value={recurrenceRuleValue.dayOfMonth ?? new Date().getDate()}
              onChange={(event) => handleDayOfMonthChange(event.target.value)}
            />
          )}
        </div>
      )}
    </div>
  );

  const renderReminderSection = () => (
    notificationsAvailable ? (
      <div className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm dark:border-amber-600/50 dark:bg-amber-900/20">
      <Select
        label="Reminder"
        value={reminderPreset}
        onChange={(event) => handleReminderPresetChange(event.target.value as ReminderPreset)}
        options={[
          { value: 'none', label: 'No reminder' },
          { value: 'at_time', label: 'At due time' },
          { value: '5m', label: '5 minutes before' },
          { value: '1h', label: '1 hour before' },
          { value: '1d', label: '1 day before' },
          { value: 'custom', label: 'Custom time' },
        ]}
      />
      {reminderPreset !== 'none' && reminderPreset !== 'custom' && !dueDateValue && (
        <p className="text-xs font-medium text-red-500">
          Set a due date to schedule this reminder.
        </p>
      )}
      {reminderPreset === 'custom' && (
        <Input
          label="Reminder time"
          type="datetime-local"
          value={
            reminderDateValue
              ? format(reminderDateValue, "yyyy-MM-dd'T'HH:mm")
              : ''
          }
          onChange={(event) =>
            {
              void ensureNotificationPermission();
              setValue(
                'reminderDate',
                event.target.value ? new Date(event.target.value) : undefined,
                {
                  shouldDirty: true,
                  shouldTouch: true,
                }
              );
            }
          }
        />
      )}
      {reminderDateValue && (
        <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
          Will notify on {format(reminderDateValue, 'PPpp')}
        </p>
      )}
    </div>
    ) : (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-600/30 dark:bg-amber-900/20 dark:text-amber-200">
        Reminders require browser notification support, which is unavailable in this environment.
      </div>
    )
  );

  useEffect(() => {
    if (!isQuickMode || initialRecommendationsApplied.current) {
      return;
    }

    const dueGroup = suggestionGroups.find((group) => group.id === 'due-dates');
    const recommendedDue = dueGroup?.suggestions.find(
      (suggestion) =>
        suggestion.isRecommended && suggestion.value instanceof Date
    );

    if (!dueDateValue && recommendedDue && recommendedDue.value instanceof Date) {
      setValue('dueDate', recommendedDue.value, {
        shouldDirty: false,
        shouldTouch: false,
      });
    }

    const priorityGroup = suggestionGroups.find((group) => group.id === 'priority');
    const recommendedPriority = priorityGroup?.suggestions.find(
      (suggestion) => suggestion.isRecommended && typeof suggestion.value === 'string'
    );

    if (recommendedPriority && typeof recommendedPriority.value === 'string') {
      setValue('priority', recommendedPriority.value as TaskPriority, {
        shouldDirty: false,
        shouldTouch: false,
      });
    }

    initialRecommendationsApplied.current = true;
  }, [dueDateValue, isQuickMode, setValue, suggestionGroups]);

  const isSuggestionActive = (suggestion: QuickSuggestion) => {
    if (suggestion.type === 'priority') {
      return priorityValue === suggestion.value;
    }
    if (suggestion.value === null) {
      return !dueDateValue;
    }
    if (suggestion.value instanceof Date && dueDateValue instanceof Date) {
      return Math.abs(dueDateValue.getTime() - suggestion.value.getTime()) < 60 * 1000;
    }
    return false;
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      setIsListening(false);
      // eslint-disable-next-line no-console
      console.warn('Speech recognition failed to start', error);
    }
  };

  if (isQuickMode) {
    return (
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-4"
      >
        <div className="space-y-2">
          <div className="relative rounded-2xl border border-gray-200 bg-white shadow-sm focus-within:border-slate-300 focus-within:ring-2 focus-within:ring-slate-200 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:border-gray-500 dark:focus-within:ring-gray-600">
            <input
              {...register('title')}
              placeholder="Capture a task in seconds..."
              autoFocus
              className="w-full rounded-2xl border-0 bg-transparent px-4 py-4 pr-14 text-lg font-medium text-gray-900 placeholder-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder-gray-500"
            />
            {isSpeechSupported && (
              <button
                type="button"
                onClick={toggleListening}
                className={cn(
                  'absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border transition-all',
                  isListening
                    ? 'border-red-200 bg-red-100 text-red-700 dark:border-red-700 dark:bg-red-900/40 dark:text-red-300'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-slate-300 hover:text-slate-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-200'
                )}
                aria-label={isListening ? 'Stop voice capture' : 'Start voice capture'}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            )}
          </div>
          {errors.title && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
          )}
        </div>

        {suggestionGroups.map((group) => (
          <div key={group.id} className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              <Sparkles size={14} />
              <span>{group.title}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onClick={() => handleSuggestionClick(group.id, suggestion)}
                  className={cn(
                    'min-w-[140px] rounded-2xl border px-3 py-2 text-left transition-all',
                    suggestion.type === 'priority' &&
                      !isSuggestionActive(suggestion) &&
                      !suggestion.isRecommended &&
                      'border-blue-200 dark:border-blue-700/50',
                    suggestion.type === 'dueDate' &&
                      !isSuggestionActive(suggestion) &&
                      !suggestion.isRecommended &&
                      'border-gray-200 dark:border-gray-700',
                    isSuggestionActive(suggestion)
                      ? 'bg-slate-600 text-white shadow-lg dark:bg-slate-500'
                      : suggestion.isRecommended
                        ? cn(
                            'bg-white text-gray-900 shadow-md dark:bg-gray-900 dark:text-gray-100',
                            suggestion.type === 'priority'
                              ? 'border-blue-300 dark:border-blue-500'
                              : 'border-slate-300 dark:border-gray-600'
                          )
                        : 'bg-white text-gray-700 hover:border-slate-300 hover:bg-slate-50 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-gray-600 dark:hover:bg-gray-800'
                  )}
                >
                  <span className="block text-sm font-semibold">{suggestion.label}</span>
                  {suggestion.description && (
                    <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                      {suggestion.description}
                    </span>
                  )}
                  {suggestion.isRecommended &&
                    !isSuggestionActive(suggestion) &&
                    !dismissedRecommendationGroups.has(group.id) && (
                    <span className="mt-1 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      Recommended
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}

        {(dueDateValue || priorityValue) && (
          <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-300">
            {dueDateValue && dueDateValue instanceof Date && (
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                <Calendar size={14} />
                {format(dueDateValue, "EEE, MMM d · p")}
                <button
                  type="button"
                  onClick={() =>
                    setValue('dueDate', undefined, {
                      shouldDirty: true,
                      shouldTouch: true,
                    })
                  }
                  className="ml-1 text-xs uppercase tracking-wide text-blue-500 hover:underline dark:text-blue-300"
                >
                  Clear
                </button>
              </span>
            )}
            {priorityValue && (
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                Priority: {priorityValue}
              </span>
            )}
          </div>
        )}

        {showDetails && (
          <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <Textarea
              label="Notes"
              {...register('description')}
              error={errors.description?.message}
              placeholder="Add a little context (optional)"
              rows={3}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Due date"
                type="datetime-local"
                {...register('dueDate', {
                  setValueAs: (value) => (value ? new Date(value) : undefined),
                })}
                error={errors.dueDate?.message}
              />
              <Select
                label="Priority"
                {...register('priority')}
                error={errors.priority?.message}
                options={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                ]}
              />
            </div>
            <Select
              label="Status"
              {...register('status')}
              error={errors.status?.message}
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
            />
            {renderRecurrenceSection()}
            {renderReminderSection()}
            {tags.length > 0 && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => {
                    const isSelected = selectedTagIds.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => {
                          const newTagIds = isSelected
                            ? selectedTagIds.filter((id) => id !== tag.id)
                            : [...selectedTagIds, tag.id];
                          setValue('tagIds', newTagIds, { shouldDirty: true });
                        }}
                        className={cn(
                          'rounded-full px-3 py-1 text-sm font-medium transition-all',
                          isSelected
                            ? 'bg-slate-600 text-white hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-400'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                        )}
                      >
                        {tag.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails((prev) => !prev)}
            >
              {showDetails ? 'Hide details' : 'Add details'}
            </Button>
            {onSwitchToAdvanced && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onSwitchToAdvanced}
              >
                Open advanced editor
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" onClick={onCancel} size="sm">
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} size="sm">
              {task ? 'Update Task' : 'Add Task'}
            </Button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {onSwitchToQuick && (
        <div className="flex items-center justify-between">
          <Button type="button" variant="ghost" size="sm" onClick={onSwitchToQuick}>
            Back to quick capture
          </Button>
        </div>
      )}
      <Input
        label="Title"
        {...register('title')}
        error={errors.title?.message}
        placeholder="Enter task title"
        autoFocus
      />

      <Textarea
        label="Description"
        {...register('description')}
        error={errors.description?.message}
        placeholder="Enter task description (optional)"
        rows={4}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Priority"
          {...register('priority')}
          error={errors.priority?.message}
          options={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ]}
        />

        <Select
          label="Status"
          {...register('status')}
          error={errors.status?.message}
          options={[
            { value: 'pending', label: 'Pending' },
            { value: 'in-progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
        />
      </div>

      <Input
        label="Due Date"
        type="datetime-local"
        {...register('dueDate', {
          setValueAs: (value) => (value ? new Date(value) : undefined),
        })}
        error={errors.dueDate?.message}
      />

      {renderRecurrenceSection()}
      {renderReminderSection()}

      {tags.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const isSelected = selectedTagIds.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    const newTagIds = isSelected
                      ? selectedTagIds.filter((id) => id !== tag.id)
                      : [...selectedTagIds, tag.id];
                    setValue('tagIds', newTagIds);
                  }}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium transition-all',
                    isSelected
                      ? 'bg-slate-600 dark:bg-slate-500 text-white hover:bg-slate-700 dark:hover:bg-slate-600'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}

