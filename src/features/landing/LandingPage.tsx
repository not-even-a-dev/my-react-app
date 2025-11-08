import { motion } from 'framer-motion';
import { LandingNav } from './LandingNav';
import { HeroSection } from './HeroSection';
import { Button } from '@/components/Button';
import { Zap, Calendar, Cloud, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { AuthModal } from '@/features/auth/AuthModal';
import { useUIStore } from '@/stores/uiStore';

export function LandingPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized || !user) {
      return;
    }

    // Close any open auth modals and route the user into the app
    setIsAuthModalOpen(false);
    navigate('/app', { replace: true });
  }, [user, isInitialized, navigate]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const root = document.documentElement;
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');

    return () => {
      const cleanupTheme = useUIStore.getState().theme;
      const cleanupRoot = document.documentElement;
      cleanupRoot.classList.remove('dark');
      if (cleanupTheme === 'dark') {
        cleanupRoot.classList.add('dark');
      }
      cleanupRoot.setAttribute('data-theme', cleanupTheme);
    };
  }, []);

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <LandingNav />

          <main>
            <HeroSection />

          {/* Feature 1: Quick Capture - Split Screen Left */}
          <section className="py-20 lg:py-32 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold">
                    <Zap size={16} />
                    <span>Feature</span>
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                    Capture tasks{' '}
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      in seconds
                    </span>
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                    No forms to fill, no fields to complete. Just type and go. Our quick capture feature lets you add tasks faster than ever before.
                  </p>
                  <ul className="space-y-3">
                    {['Voice input support', 'Keyboard shortcuts', 'Smart suggestions'].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                        <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  <div className="relative glass-strong rounded-3xl p-6 shadow-2xl">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 space-y-3 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                      {/* Quick capture interface mockup */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Zap className="text-blue-600" size={18} />
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Quick Add</span>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                          <div className="h-4 w-4 rounded-full border-2 border-gray-300 dark:border-gray-500 flex-shrink-0"></div>
                          <input 
                            type="text" 
                            placeholder="Type your task..."
                            className="flex-1 bg-transparent text-sm text-gray-600 dark:text-gray-300 placeholder-gray-400 outline-none"
                            value="Buy groceries for dinner"
                            readOnly
                          />
                        </div>
                      </div>
                      
                      {/* Recently added tasks */}
                      <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                        {[
                          { title: 'Call mom', priority: 'high' },
                          { title: 'Finish presentation', priority: 'medium' },
                          { title: 'Read book chapter', priority: 'low' },
                        ].map((task, i) => (
                          <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-white dark:bg-gray-700/30 border border-gray-100 dark:border-gray-600/50">
                            <div className="h-4 w-4 rounded-full border-2 border-gray-300 dark:border-gray-500 flex-shrink-0"></div>
                            <span className="text-sm text-gray-800 dark:text-gray-200 flex-1">{task.title}</span>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                              'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-6 -right-6 glass rounded-2xl p-4 shadow-xl"
                  >
                    <Zap className="text-yellow-500" size={32} />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Feature 2: Smart Scheduling - Split Screen Right */}
          <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-950 dark:to-blue-950/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative order-2 lg:order-1"
                >
                  <div className="relative glass-strong rounded-3xl p-6 shadow-2xl">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                          <Calendar className="text-green-600" size={20} />
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Today's Schedule</span>
                        </div>
                        <div className="h-6 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-green-700 dark:text-green-400">3 tasks</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {[
                          { time: '9:00 AM', title: 'Team standup meeting', desc: 'Weekly sync', priority: 'medium', completed: false },
                          { time: '2:00 PM', title: 'Project review', desc: 'Q4 planning', priority: 'high', completed: false },
                          { time: '4:30 PM', title: 'Code review', desc: 'PR #123', priority: 'low', completed: true },
                        ].map((task, idx) => (
                          <div key={idx} className={`flex items-start gap-3 p-3 rounded-lg border ${task.completed ? 'bg-gray-50 dark:bg-gray-800/50 opacity-60' : 'bg-white dark:bg-gray-700/30'} border-gray-200 dark:border-gray-600/50`}>
                            <div className="flex-shrink-0 w-14 text-left">
                              <div className="text-xs font-semibold text-gray-900 dark:text-gray-100">{task.time}</div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className={`text-sm font-semibold text-gray-800 dark:text-gray-100 ${task.completed ? 'line-through' : ''}`}>
                                  {task.title}
                                </h4>
                                {task.completed ? (
                                  <CheckCircle2 className="text-green-500 flex-shrink-0" size={16} />
                                ) : (
                                  <div className="h-4 w-4 rounded-full border-2 border-gray-300 dark:border-gray-500 flex-shrink-0"></div>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{task.desc}</p>
                              <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                                task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              }`}>
                                {task.priority}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6 order-1 lg:order-2"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-semibold">
                    <Calendar size={16} />
                    <span>Smart Scheduling</span>
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                    Never miss a{' '}
                    <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      deadline again
                    </span>
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                    Set due dates, create recurring tasks, and let our smart system help you prioritize what matters most. Your schedule, simplified.
                  </p>
                  <ul className="space-y-3">
                    {['Recurring task templates', 'Smart notifications', 'Calendar integration'].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                        <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Feature 3: Works Offline - Split Screen Left */}
          <section className="py-20 lg:py-32 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-semibold">
                    <Cloud size={16} />
                    <span>Always Available</span>
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                    Works{' '}
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      everywhere
                    </span>
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                    Your data lives on your device first. Access your tasks anywhere, anytime—even without internet. Full sync when you're back online.
                  </p>
                  <ul className="space-y-3">
                    {['Offline-first architecture', 'Automatic sync', 'Cross-device support'].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                        <CheckCircle2 size={20} className="text-purple-600 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  <div className="relative glass-strong rounded-3xl p-6 shadow-2xl">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                      {/* Sync status indicator */}
                      <div className="flex items-center justify-center gap-4 mb-5 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col items-center gap-1">
                          <div className="relative">
                            <Cloud className="text-purple-600" size={32} />
                            <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">Cloud</span>
                        </div>
                        <ArrowRight className="text-gray-400" size={20} />
                        <div className="flex flex-col items-center gap-1">
                          <div className="h-8 w-8 rounded-full bg-purple-200 dark:bg-purple-900 border-2 border-purple-300 dark:border-purple-700"></div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">Device</span>
                        </div>
                      </div>
                      
                      {/* Offline tasks */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Syncing...</span>
                        </div>
                        {[
                          { title: 'Buy groceries', completed: false },
                          { title: 'Review documents', completed: true },
                          { title: 'Send email', completed: false },
                        ].map((task, i) => (
                          <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600/50">
                            {task.completed ? (
                              <CheckCircle2 className="text-green-500 flex-shrink-0" size={18} />
                            ) : (
                              <div className="h-4 w-4 rounded-full border-2 border-gray-300 dark:border-gray-500 flex-shrink-0"></div>
                            )}
                            <span className={`text-sm text-gray-800 dark:text-gray-200 flex-1 ${task.completed ? 'line-through' : ''}`}>
                              {task.title}
                            </span>
                            <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                              Work
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Visual Showcase Section */}
          <section className="relative py-32 lg:py-40 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950">
            <div className="absolute inset-0 grid-pattern-dark opacity-20"></div>
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl"></div>
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl"></div>
            </div>
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="space-y-8"
                >
                  <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                    Everything you need,{' '}
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      all in one place
                    </span>
                  </h2>
                  <p className="text-xl text-slate-300 leading-relaxed">
                    Experience a seamless workflow with our beautiful, intuitive interface. 
                    Manage your tasks, track your progress, and stay organized—all from one powerful dashboard.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="glass rounded-xl px-6 py-4">
                      <div className="text-2xl font-bold text-white mb-1">100%</div>
                      <div className="text-sm text-slate-300">Privacy Focused</div>
                    </div>
                    <div className="glass rounded-xl px-6 py-4">
                      <div className="text-2xl font-bold text-white mb-1">Free</div>
                      <div className="text-sm text-slate-300">Forever Plan</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="relative"
                >
                  <div className="relative glass-strong rounded-3xl p-6 shadow-2xl backdrop-blur-xl border border-white/10">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                      {/* Dashboard header */}
                      <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">My Tasks</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">5 active tasks</p>
                        </div>
                        <div className="flex gap-2">
                          <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <CheckCircle2 className="text-blue-600 dark:text-blue-400" size={16} />
                          </div>
                          <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <Calendar className="text-purple-600 dark:text-purple-400" size={16} />
                          </div>
                        </div>
                      </div>
                      
                      {/* Task cards matching actual UI */}
                      <div className="space-y-3">
                        {[
                          { title: 'Design new landing page', desc: 'Create mockups and wireframes', priority: 'high', completed: false, tag: 'Design' },
                          { title: 'Code review for API changes', desc: '', priority: 'medium', completed: false, tag: 'Development' },
                          { title: 'Prepare Q4 presentation', desc: 'Include metrics and KPIs', priority: 'high', completed: true, tag: 'Work' },
                          { title: 'Update team documentation', desc: '', priority: 'low', completed: false, tag: 'Work' },
                        ].map((task, idx) => (
                          <div key={idx} className={`flex items-start gap-3 p-3 rounded-xl border ${task.completed ? 'bg-gray-50 dark:bg-gray-800/50 opacity-60' : 'bg-white dark:bg-gray-700/30'} border-gray-200 dark:border-gray-600/50 hover:shadow-md transition-all`}>
                            {/* Checkbox */}
                            <div className="mt-0.5 flex-shrink-0">
                              {task.completed ? (
                                <CheckCircle2 className="text-green-500" size={20} />
                              ) : (
                                <div className="h-5 w-5 rounded-full border-2 border-gray-300 dark:border-gray-500"></div>
                              )}
                            </div>
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <h4 className={`text-sm font-semibold text-gray-800 dark:text-gray-100 ${task.completed ? 'line-through' : ''}`}>
                                {task.title}
                              </h4>
                              {task.desc && (
                                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                                  {task.desc}
                                </p>
                              )}
                              {/* Metadata */}
                              <div className="mt-2 flex items-center gap-2 flex-wrap">
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                  task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                }`}>
                                  {task.priority}
                                </span>
                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                  <Calendar size={12} />
                                  <span>Today</span>
                                </div>
                                <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                                  {task.tag}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Floating badges */}
                  <motion.div
                    animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-6 -left-6 glass rounded-2xl px-4 py-3 shadow-xl"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="text-yellow-400" size={20} />
                      <span className="text-sm font-semibold text-white">New Feature</span>
                    </div>
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, 12, 0], rotate: [0, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-6 -right-6 glass rounded-2xl px-4 py-3 shadow-xl"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-400" size={20} />
                      <span className="text-sm font-semibold text-white">2M+ Tasks</span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 dark:from-blue-800 dark:via-purple-800 dark:to-blue-900">
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full filter blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl"></div>
            </div>
            <div className="absolute inset-0 grid-pattern-dark opacity-10"></div>
            
            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Ready to get more done?
                </h2>
                <p className="text-xl sm:text-2xl text-blue-100 max-w-2xl mx-auto">
                  Join thousands of people who use ToDo to stay organized and productive every day.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="text-lg px-10 py-5 bg-white text-blue-700 hover:bg-gray-50 shadow-2xl hover:shadow-3xl transition-all group"
                  >
                    Start Free Today
                    <ArrowRight className="ml-2 inline-block group-hover:translate-x-1 transition-transform" size={22} />
                  </Button>
                  <Button
                    size="lg"
                    variant="ghost"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="text-lg px-10 py-5 glass-strong text-white border-white/20 hover:bg-white/10"
                  >
                    View Demo
                  </Button>
                </div>
                <div className="pt-8 flex items-center justify-center gap-8 text-blue-100 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>Free forever plan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>Setup in 60 seconds</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 dark:bg-black border-t border-gray-800 dark:border-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="text-blue-500" size={24} />
                  <span className="text-xl font-bold text-white">ToDo</span>
                </div>
                <p className="text-sm text-gray-400">
                  The simple, powerful to-do app for busy people.
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Product</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} ToDo. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}

