import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading, isInitialized, checkAuthState } = useAuthStore();
  const location = useLocation();

  // Initialize auth state check on mount
  useEffect(() => {
    if (!isInitialized) {
      checkAuthState();
    }
  }, [isInitialized, checkAuthState]);

  // Show loading spinner while checking auth state
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-slate-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to landing page if not authenticated
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Render protected content
  return <>{children}</>;
}

