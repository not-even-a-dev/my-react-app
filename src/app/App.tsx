import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Router } from './router';
import { Layout } from '@/components/Layout';
import { TaskModal } from '@/features/tasks/TaskModal';
import { QuickCaptureModal } from '@/features/tasks/QuickCaptureModal';
import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts';
import { useAuthStore } from '@/stores/authStore';

function App() {
  const { checkAuthState } = useAuthStore();

  // Initialize auth state on mount
  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  useGlobalShortcuts();

  return (
    <BrowserRouter>
      <Layout>
        <Router />
        <QuickCaptureModal />
        <TaskModal />
      </Layout>
    </BrowserRouter>
  );
}

export default App;
