import { useEffect, useState } from 'react';
import { Plus, CheckSquare, ChevronDown, ChevronRight } from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useTaskStore } from '@/stores/taskStore';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { TaskList } from '@/features/tasks/TaskList';
import type { Task } from '@/utils/types';
import { downloadICalendar } from '@/utils/calendarExport';

function Dashboard() {
  const { user } = useAuthStore();
  const { loadTasks, getDueTodayTasks, getTasksByStatus, tasks } = useTaskStore();
  const handleExportCalendar = () => {
    downloadICalendar(tasks);
  };
  const { openQuickCapture } = useUIStore();

  useEffect(() => {
    // Load data on mount
    loadTasks(user?.uid);
  }, [loadTasks, user]);

  const pendingTasks = getTasksByStatus('pending');
  const inProgressTasks = getTasksByStatus('in-progress');
  const completedTasks = getTasksByStatus('completed');
  const [dueToday, setDueToday] = useState<Task[]>([]);

  // Collapse state for sections
  const [isPendingCollapsed, setIsPendingCollapsed] = useState(false);
  const [isInProgressCollapsed, setIsInProgressCollapsed] = useState(false);
  const [isCompletedCollapsed, setIsCompletedCollapsed] = useState(false);

  useEffect(() => {
    getDueTodayTasks(user?.uid).then(setDueToday);
  }, [getDueTodayTasks, user]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Welcome back! Here's your overview.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openQuickCapture} variant="primary">
            <Plus size={18} className="mr-2" />
            New Task
          </Button>
          <Button onClick={handleExportCalendar} variant="secondary" size="sm">
            Export calendar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-100">
              <CheckSquare className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Tasks</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{pendingTasks.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-yellow-100">
              <CheckSquare className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Due Today</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{dueToday.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Views */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPendingCollapsed(!isPendingCollapsed)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                {isPendingCollapsed ? (
                  <ChevronRight size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Pending Tasks</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={openQuickCapture}
            >
              <Plus size={16} />
            </Button>
          </div>
          {!isPendingCollapsed && (
            <div className="space-y-3">
              {pendingTasks.length > 0 ? (
                <TaskList tasks={pendingTasks.slice(0, 5)} />
              ) : (
                <Card padding="lg">
                  <p className="text-gray-500 dark:text-gray-400 text-center">No pending tasks!</p>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      {/* In Progress & Completed Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* In Progress Tasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsInProgressCollapsed(!isInProgressCollapsed)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                {isInProgressCollapsed ? (
                  <ChevronRight size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">In Progress</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={openQuickCapture}
            >
              <Plus size={16} />
            </Button>
          </div>
          {!isInProgressCollapsed && (
            <div className="space-y-3">
              {inProgressTasks.length > 0 ? (
                <TaskList tasks={inProgressTasks.slice(0, 5)} />
              ) : (
                <Card padding="lg">
                  <p className="text-gray-500 dark:text-gray-400 text-center">No in-progress tasks!</p>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Completed Tasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCompletedCollapsed(!isCompletedCollapsed)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                {isCompletedCollapsed ? (
                  <ChevronRight size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Completed</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={openQuickCapture}
            >
              <Plus size={16} />
            </Button>
          </div>
          {!isCompletedCollapsed && (
            <div className="space-y-3">
              {completedTasks.length > 0 ? (
                <TaskList tasks={completedTasks.slice(0, 5)} />
              ) : (
                <Card padding="lg">
                  <p className="text-gray-500 dark:text-gray-400 text-center">No completed tasks yet!</p>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
