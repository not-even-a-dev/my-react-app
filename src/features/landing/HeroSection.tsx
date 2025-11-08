import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/Button';
import { CheckCircle, Calendar, WifiOff, ArrowRight, Sparkles } from 'lucide-react';
import { AuthModal } from '@/features/auth/AuthModal';

export function HeroSection() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const stats = [
    { value: '50K+', label: 'Active Users' },
    { value: '2M+', label: 'Tasks Completed' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-pattern dark:grid-pattern-dark opacity-50"></div>
        <div className="absolute inset-0 noise"></div>

        {/* Sophisticated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-40 animate-blob"></div>
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-300/20 dark:bg-slate-700/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-24">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_auto] gap-12 items-center">
            {/* Left: Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 mb-8 glass rounded-full text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                <Sparkles size={16} className="text-blue-600" />
                <span>New: AI-powered task suggestions</span>
              </motion.div>

              {/* Main headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight"
              >
                Stay on top of your{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300 bg-clip-text text-transparent">
                    busy life
                  </span>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full -z-10"
                  />
                </span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                The simple, powerful to-do app that helps busy people get things done.
                No clutter, no confusion—just focus and productivity.
              </motion.p>

              {/* Quick benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-10 text-base text-gray-600 dark:text-gray-400"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <CheckCircle size={18} className="text-green-600 dark:text-green-400" />
                  </div>
                  <span className="font-medium">Quick capture</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Calendar size={18} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-medium">Smart scheduling</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <WifiOff size={18} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="font-medium">Works offline</span>
                </div>
              </motion.div>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <Button
                  size="lg"
                  variant="primary"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-lg px-8 py-4 group shadow-xl hover:shadow-2xl transition-all"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 inline-block group-hover:translate-x-1 transition-transform" size={20} />
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-lg px-8 py-4 glass-strong"
                >
                  Sign In
                </Button>
              </motion.div>
            </div>

            {/* Right: Visual Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Dashboard mockup */}
                <div className="relative glass-strong rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 space-y-3 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                    {/* Mock tasks matching actual TaskCard structure */}
                    {[
                      { title: 'Review project proposal', desc: 'Check the final draft', priority: 'high', completed: false },
                      { title: 'Team standup meeting', desc: '', priority: 'medium', completed: true },
                      { title: 'Update documentation', desc: 'API documentation needs refresh', priority: 'low', completed: false },
                    ].map((task, i) => (
                      <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${task.completed ? 'bg-gray-50 dark:bg-gray-800/50 opacity-60' : 'bg-white dark:bg-gray-700/30'} border-gray-200 dark:border-gray-600/50 hover:shadow-md transition-all`}>
                        {/* Checkbox */}
                        <div className="mt-0.5 flex-shrink-0">
                          {task.completed ? (
                            <CheckCircle className="text-green-500" size={20} />
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
                          {/* Badges */}
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
                              Work
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Floating elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 glass rounded-xl p-3 shadow-lg"
                >
                  <Sparkles className="text-blue-600" size={24} />
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-4 -left-4 glass rounded-xl p-3 shadow-lg"
                >
                  <CheckCircle className="text-green-600" size={24} />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Metrics bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative mt-14 lg:mt-20"
          >
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-white/40 via-white/60 to-white/40 dark:from-white/5 dark:via-white/10 dark:to-white/5 blur-sm"></div>
            <div className="relative max-w-4xl mx-auto glass-strong rounded-[32px] px-6 sm:px-10 py-6 shadow-2xl border border-white/30 dark:border-gray-700/40 backdrop-blur-2xl">
              <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/20 dark:divide-white/10">
                {stats.map((stat) => (
                  <div key={stat.label} className="px-4 py-4 text-center flex flex-col items-center">
                    <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                      {stat.value}
                    </span>
                    <span className="mt-1 text-xs sm:text-sm font-medium uppercase tracking-wide text-slate-600 dark:text-slate-300">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}

