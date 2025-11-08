import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isAppRoute = location.pathname.startsWith('/app');

  // Don't show Header/Sidebar on landing page
  if (!isAppRoute) {
    return <>{children}</>;
  }

  // Show Header/Sidebar for app routes
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 min-h-[calc(100vh-4rem)] mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

