import { useState, useEffect, SVGProps } from 'react';
import { Sparkles, CheckCircle2, X } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/utils/cn';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'signup';

const GoogleLogo = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fill="#4285F4"
      d="M23.49 12.27c0-.84-.08-1.65-.23-2.43H12v4.6h6.43c-.28 1.5-1.12 2.77-2.39 3.63v3.02h3.87c2.26-2.08 3.58-5.15 3.58-8.82Z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.96-1.08 7.95-2.94l-3.87-3.02c-1.08.72-2.47 1.14-4.08 1.14-3.14 0-5.8-2.12-6.75-4.98H1.21v3.13C3.19 21.63 7.27 24 12 24Z"
    />
    <path
      fill="#FBBC05"
      d="M5.25 14.2c-.24-.72-.38-1.5-.38-2.2s.14-1.48.38-2.2V6.67H1.21A11.96 11.96 0 0 0 0 11.96c0 1.98.44 3.71 1.21 5.29l4.04-3.05Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75a6.9 6.9 0 0 1 4.58 1.87l3.43-3.43C17.95 1.32 15.24 0 12 0 7.27 0 3.19 2.37 1.21 5.67l4.04 3.13C6.2 6.87 8.86 4.75 12 4.75Z"
    />
  </svg>
);

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const { signInWithGoogle, isLoading, error } = useAuthStore();
  const { user } = useAuthStore();

  // Close modal when user successfully authenticates
  useEffect(() => {
    if (user) {
      onClose();
    }
  }, [user, onClose]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onClose();
    } catch (error) {
      // Error is handled by the store and will be displayed
    }
  };

  const handleSuccess = () => {
    onClose();
  };

  const title = mode === 'login' ? 'Welcome back' : 'Create your account';
  const subtitle =
    mode === 'login'
      ? 'Pick up right where you left off—your tasks, habits, and routines are ready.'
      : 'Join thousands of focused students unlocking personalized planning every day.';

  const benefits = [
    {
      title: 'AI-powered planning',
      description: 'Get smart suggestions for when to tackle each task based on priority and energy.',
    },
    {
      title: 'Habit tracking that sticks',
      description: 'Build streaks and celebrate progress with insights crafted for busy schedules.',
    },
    {
      title: 'Focus-ready reminders',
      description: 'Never miss what matters with humane nudges that keep you ahead of deadlines.',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      showCloseButton={false}
      cardPadding="none"
      cardClassName="overflow-hidden border border-gray-200/70 bg-white/95 shadow-2xl dark:border-gray-700/60 dark:bg-gray-900/95"
    >
      <div className="relative flex flex-col md:grid md:grid-cols-[1.1fr_1fr]">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-7 py-10 text-white sm:px-9 md:px-12 md:py-12">
          <div className="absolute inset-0 opacity-60">
            <div className="absolute -top-20 left-10 h-48 w-48 rounded-full bg-white/25 blur-3xl" />
            <div className="absolute top-1/2 -right-20 h-64 w-64 rounded-full bg-purple-400/40 blur-3xl" />
            <div className="absolute bottom-0 right-10 h-44 w-44 rounded-full bg-blue-400/40 blur-3xl" />
          </div>
          <div className="relative z-10 flex h-full flex-col justify-between gap-10">
            <div className="space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em]">
                <Sparkles size={16} />
                <span>To-Do App</span>
              </span>

              <div className="space-y-4">
                <h2 className="text-3xl font-semibold leading-snug sm:text-4xl">
                  Plan your day with premium clarity
                </h2>
                <p className="text-base leading-relaxed text-white/80 sm:text-lg">
                  Organize tasks, build habits, and stay focused with a workspace designed for balance.
                </p>
              </div>

              <div className="space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="flex items-start gap-4">
                    <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/30">
                      <CheckCircle2 size={22} className="text-white" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-white">{benefit.title}</p>
                      <p className="text-sm leading-relaxed text-white/75">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1 text-sm text-white/70">
              <p className="font-medium">Trusted by 50,000+ busy students and professionals.</p>
              <p>Start today and unlock 60 minutes of premium focus time—on us.</p>
            </div>
          </div>
        </div>

        <div className="relative bg-white px-6 py-8 dark:bg-gray-900 sm:px-8 md:px-10 md:py-12">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200/70 text-gray-500 transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:text-gray-700 dark:border-gray-700/60 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-200"
            aria-label="Close modal"
            type="button"
          >
            <X size={18} />
          </button>

          <div className="flex h-full flex-col pt-4">
            <div>
              <div className="inline-flex items-center rounded-full bg-gray-100 p-1 text-sm font-medium shadow-inner dark:bg-gray-800/80">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={cn(
                    'rounded-full px-4 py-1.5 transition-all',
                    mode === 'login'
                      ? 'bg-white text-gray-900 shadow-md dark:bg-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                  )}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={cn(
                    'rounded-full px-4 py-1.5 transition-all',
                    mode === 'signup'
                      ? 'bg-white text-gray-900 shadow-md dark:bg-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                  )}
                >
                  Create account
                </button>
              </div>

              <h3 className="mt-6 text-3xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
            </div>

            <div className="mt-8 space-y-5">
              <Button
                variant="primary"
                size="sm"
                className="group relative flex w-full translate-y-0 items-center justify-center gap-3 overflow-hidden rounded-xl bg-[#1a73e8] px-5 py-2.5 text-sm text-white shadow-[0_16px_35px_-20px_rgba(26,115,232,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1669c1] hover:shadow-[0_22px_45px_-20px_rgba(26,115,232,0.78)] focus-visible:ring-4 focus-visible:ring-blue-200/70"
                onClick={handleGoogleSignIn}
                isLoading={isLoading}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_6px_14px_-6px_rgba(26,115,232,0.48)] transition group-hover:scale-105">
                  <GoogleLogo className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold tracking-tight text-white sm:text-base">
                  Continue with Google
                </span>
              </Button>

              {error && error.includes('Google') && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </div>
              )}

              <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500">
                <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                <span>Or continue with email</span>
                <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
              </div>

              <div className="space-y-4">
                {mode === 'login' ? (
                  <LoginForm onSuccess={handleSuccess} />
                ) : (
                  <SignupForm onSuccess={handleSuccess} />
                )}
              </div>
            </div>

            <p className="mt-8 text-xs leading-relaxed text-gray-400 dark:text-gray-500">
              By continuing you agree to our{' '}
              <span className="font-medium text-gray-600 underline decoration-dotted hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Terms of Service
              </span>{' '}
              and{' '}
              <span className="font-medium text-gray-600 underline decoration-dotted hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Privacy Policy
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

