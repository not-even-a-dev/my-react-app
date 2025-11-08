import { useState } from 'react';
import { CheckSquare } from 'lucide-react';
import { Button } from '@/components/Button';
import { AuthModal } from '@/features/auth/AuthModal';

export function LandingNav() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <CheckSquare className="text-slate-600 dark:text-slate-400" size={28} />
              <span className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-500 bg-clip-text text-transparent dark:from-slate-300 dark:to-slate-500">
                ToDo
              </span>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => setIsAuthModalOpen(true)}
              >
                Log In
              </Button>
              <Button variant="primary" onClick={() => setIsAuthModalOpen(true)}>
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}

