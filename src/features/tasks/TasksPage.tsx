import { useEffect, useState } from 'react';
import { Plus, Filter, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useTaskStore } from '@/stores/taskStore';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { TaskList } from './TaskList';
import { Select } from '@/components/Select';
import { downloadICalendar } from '@/utils/calendarExport';

function TasksPage() {
  const { user } = useAuthStore();
  const { loadTasks, setFilter, filters, getFilteredTasks } = useTaskStore();
  const { openQuickCapture } = useUIStore();

  // Collapse state for categories
  const [isPendingCollapsed, setIsPendingCollapsed] = useState(false);
  const [isInProgressCollapsed, setIsInProgressCollapsed] = useState(false);
  const [isCompletedCollapsed, setIsCompletedCollapsed] = useState(false);
  const [isCancelledCollapsed, setIsCancelledCollapsed] = useState(true);

  useEffect(() => {
    loadTasks(user?.uid);
  }, [loadTasks, user]);

  const handleStatusFilter = (status: string) => {
    setFilter({ status: status === 'all' ? undefined : (status as any) });
  };

  const handlePriorityFilter = (priority: string) => {
    setFilter({ priority: priority === 'all' ? undefined : (priority as any) });
  };

  const isShowingAllStatus = !filters.status;
  const filteredTasks = getFilteredTasks();
  const handleExportCalendar = () => downloadICalendar(filteredTasks);

  // When showing a specific status, just show the flat list
  if (!isShowingAllStatus) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Tasks</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Manage your tasks and stay organized</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={openQuickCapture} variant="primary">
              <Plus size={18} className="mr-2" />
              New Task
            </Button>
            <Button onClick={handleExportCalendar} variant="secondary" size="sm">
              Export calendar
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-sm">
          <Filter size={18} className="text-gray-500 dark:text-gray-400" />
          <Select
            value={filters.status || 'all'}
            onChange={(e) => handleStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'pending', label: 'Pending' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
            className="min-w-[150px]"
          />
          <Select
            value={filters.priority || 'all'}
            onChange={(e) => handlePriorityFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Priorities' },
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
            className="min-w-[150px]"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilter({})}
          >
            Clear Filters
          </Button>
        </div>

        {/* Task List */}
        <TaskList />
      </div>
    );
  }

  // When showing all statuses, show categorized sections
  const pendingTasks = filteredTasks.filter((t) => t.status === 'pending');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in-progress');
  const completedTasks = filteredTasks.filter((t) => t.status === 'completed');
  const cancelledTasks = filteredTasks.filter((t) => t.status === 'cancelled');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Tasks</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Manage your tasks and stay organized</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={openQuickCapture} variant="primary">
            <Plus size={18} className="mr-2" />
            New Task
          </Button>
          <Button onClick={handleExportCalendar} variant="secondary" size="sm">
            Export calendar
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-sm">
        <Filter size={18} className="text-gray-500 dark:text-gray-400" />
        <Select
          value={filters.status || 'all'}
          onChange={(e) => handleStatusFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'pending', label: 'Pending' },
            { value: 'in-progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
          className="min-w-[150px]"
        />
        <Select
          value={filters.priority || 'all'}
          onChange={(e) => handlePriorityFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All Priorities' },
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ]}
          className="min-w-[150px]"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFilter({})}
        >
          Clear Filters
        </Button>
      </div>

      {/* Categorized Task Lists */}
      <div className="space-y-6">
        {/* Pending Tasks */}
        <div>
          <div className="flex items-center gap-2 mb-4">
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
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Pending ({pendingTasks.length})
            </h2>
          </div>
          {!isPendingCollapsed && (
            <div className="space-y-3">
              {pendingTasks.length > 0 ? (
                <TaskList tasks={pendingTasks} />
              ) : (
                <Card padding="lg">
                  <p className="text-gray-500 dark:text-gray-400 text-center">No pending tasks!</p>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* In Progress Tasks */}
        <div>
          <div className="flex items-center gap-2 mb-4">
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
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              In Progress ({inProgressTasks.length})
            </h2>
          </div>
          {!isInProgressCollapsed && (
            <div className="space-y-3">
              {inProgressTasks.length > 0 ? (
                <TaskList tasks={inProgressTasks} />
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
          <div className="flex items-center gap-2 mb-4">
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
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Completed ({completedTasks.length})
            </h2>
          </div>
          {!isCompletedCollapsed && (
            <div className="space-y-3">
              {completedTasks.length > 0 ? (
                <TaskList tasks={completedTasks} />
              ) : (
                <Card padding="lg">
                  <p className="text-gray-500 dark:text-gray-400 text-center">No completed tasks!</p>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Cancelled Tasks */}
        {cancelledTasks.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setIsCancelledCollapsed(!isCancelledCollapsed)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                {isCancelledCollapsed ? (
                  <ChevronRight size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Cancelled ({cancelledTasks.length})
              </h2>
            </div>
            {!isCancelledCollapsed && (
              <div className="space-y-3">
                <TaskList tasks={cancelledTasks} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TasksPage;
