import { Link, useLocation } from 'react-router-dom';
import { CheckSquare, BarChart3, Home, X } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { motion, AnimatePresence } from 'framer-motion';

export function Sidebar() {
  const location = useLocation();
  const { isSidebarOpen, closeSidebar } = useUIStore();

  const navItems = [
    { path: '/app', label: 'Dashboard', icon: Home },
    { path: '/app/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/app/stats', label: 'Stats', icon: BarChart3 },
  ];

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={closeSidebar}
            />
            {/* Sidebar */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3, type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl z-50 lg:relative lg:shadow-none lg:w-64 lg:translate-x-0"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <Link
                    to="/app"
                    className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-pastel-blue to-pastel-purple bg-clip-text text-transparent"
                    onClick={closeSidebar}
                  >
                    <CheckSquare className="text-pastel-blue" size={28} />
                    <span>To-Do App</span>
                  </Link>
                  <button
                    onClick={closeSidebar}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:hidden"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={closeSidebar}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                          ${
                            isActive
                              ? 'bg-slate-600 dark:bg-slate-500 text-white shadow-md hover:bg-slate-700 dark:hover:bg-slate-600'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }
                        `}
                      >
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (always visible) */}
      <aside className="hidden lg:block lg:w-64 lg:fixed lg:left-0 lg:top-16 lg:h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
        <div className="flex flex-col h-full">
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                    ${
                      isActive
                        ? 'bg-slate-600 dark:bg-slate-500 text-white shadow-md hover:bg-slate-700 dark:hover:bg-slate-600'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}

