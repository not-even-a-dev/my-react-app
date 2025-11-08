import { create } from 'zustand';

interface UIState {
  // Modals
  isTaskModalOpen: boolean;
  isTagModalOpen: boolean;
  isSettingsModalOpen: boolean;
  isQuickCaptureOpen: boolean;

  // Sidebar
  isSidebarOpen: boolean;

  // View preferences
  viewMode: 'list' | 'grid' | 'calendar';
  showCompletedTasks: boolean;
  groupBy: 'none' | 'status' | 'priority' | 'dueDate' | 'tag';

  // Theme (for future expansion)
  theme: 'light' | 'dark';
}

interface UIActions {
  // Modal controls
  openTaskModal: () => void;
  closeTaskModal: () => void;
  openQuickCapture: () => void;
  closeQuickCapture: () => void;
  openTagModal: () => void;
  closeTagModal: () => void;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;
  closeAllModals: () => void;

  // Sidebar controls
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;

  // View preferences
  setViewMode: (mode: UIState['viewMode']) => void;
  toggleShowCompletedTasks: () => void;
  setShowCompletedTasks: (show: boolean) => void;
  setGroupBy: (group: UIState['groupBy']) => void;

  // Theme
  setTheme: (theme: UIState['theme']) => void;
  toggleTheme: () => void;

  // Reset
  reset: () => void;
}

// Get initial theme from localStorage if available
const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
  }
  return 'light';
};

const isLandingRoute = () =>
  typeof window !== 'undefined' &&
  (window.location.pathname === '/' || window.location.pathname === '/index.html');

const applyThemeToDocument = (theme: 'light' | 'dark') => {
  if (typeof window === 'undefined') {
    return;
  }

  const root = document.documentElement;
  const forceLight = isLandingRoute();

  root.classList.remove('dark');

  if (!forceLight && theme === 'dark') {
    root.classList.add('dark');
  }

  root.setAttribute('data-theme', forceLight ? 'light' : theme);
};

const initialState: UIState = {
  isTaskModalOpen: false,
  isTagModalOpen: false,
  isSettingsModalOpen: false,
  isQuickCaptureOpen: false,
  isSidebarOpen: false,
  viewMode: 'list',
  showCompletedTasks: false,
  groupBy: 'none',
  theme: getInitialTheme(),
};

export const useUIStore = create<UIState & UIActions>((set) => ({
  ...initialState,

  // Modal controls
  openTaskModal: () => set({ isTaskModalOpen: true }),
  closeTaskModal: () => set({ isTaskModalOpen: false }),
  openQuickCapture: () => set({ isQuickCaptureOpen: true }),
  closeQuickCapture: () => set({ isQuickCaptureOpen: false }),
  openTagModal: () => set({ isTagModalOpen: true }),
  closeTagModal: () => set({ isTagModalOpen: false }),
  openSettingsModal: () => set({ isSettingsModalOpen: true }),
  closeSettingsModal: () => set({ isSettingsModalOpen: false }),
  closeAllModals: () =>
    set({
      isTaskModalOpen: false,
      isQuickCaptureOpen: false,
      isTagModalOpen: false,
      isSettingsModalOpen: false,
    }),

  // Sidebar controls
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),

  // View preferences
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleShowCompletedTasks: () =>
    set((state) => ({ showCompletedTasks: !state.showCompletedTasks })),
  setShowCompletedTasks: (show) => set({ showCompletedTasks: show }),
  setGroupBy: (group) => set({ groupBy: group }),

  // Theme
  setTheme: (theme) => {
    set({ theme });
    // Store in localStorage for persistence
    localStorage.setItem('theme', theme);
    applyThemeToDocument(theme);
  },
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      
      // Update localStorage first
      localStorage.setItem('theme', newTheme);
      
      // Update DOM class immediately and synchronously
      applyThemeToDocument(newTheme);
      
      return { theme: newTheme };
    });
  },

  // Reset
  reset: () => set(initialState),
}));

// Apply initial theme class to document on load
if (typeof window !== 'undefined') {
  const initialTheme = getInitialTheme();
  applyThemeToDocument(initialTheme);
}

