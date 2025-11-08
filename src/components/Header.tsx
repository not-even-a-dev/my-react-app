import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckSquare, BarChart3, Menu, Sun, Moon, LogOut } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { Button } from './Button';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const theme = useUIStore((state) => state.theme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);
  const { signOut } = useAuthStore();

  const navItems = [
    { path: '/app', label: 'Dashboard', icon: BarChart3 },
    { path: '/app/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/app/stats', label: 'Stats', icon: BarChart3 },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link
              to="/app"
              className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-pastel-blue to-pastel-purple bg-clip-text text-transparent"
            >
              <CheckSquare className="text-pastel-blue" size={28} />
              <span>To-Do App</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all
                    ${
                      isActive
                        ? 'bg-slate-600 text-white shadow-md hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-600'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 ml-1"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              type="button"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all text-gray-600 hover:bg-red-50 dark:text-gray-300 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 ml-1"
              aria-label="Sign out"
              type="button"
            >
              <LogOut size={20} />
            </button>
          </nav>

          {/* Mobile Navigation (simplified) */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              aria-label="Sign out"
              type="button"
            >
              <LogOut size={20} className="text-red-600 dark:text-red-400" />
            </button>
            <Button variant="ghost" size="sm" onClick={toggleSidebar}>
              <Menu size={20} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

