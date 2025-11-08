import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '@/features/landing/LandingPage';
import Dashboard from '@/features/dashboard/Dashboard';
import TasksPage from '@/features/tasks/TasksPage';
import StatsPage from '@/features/dashboard/StatsPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/tasks"
        element={
          <ProtectedRoute>
            <TasksPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/stats"
        element={
          <ProtectedRoute>
            <StatsPage />
          </ProtectedRoute>
        }
      />
      {/* Redirect old routes to /app prefix */}
      <Route path="/dashboard" element={<Navigate to="/app" replace />} />
      <Route path="/tasks" element={<Navigate to="/app/tasks" replace />} />
      <Route path="/stats" element={<Navigate to="/app/stats" replace />} />
    </Routes>
  );
}

