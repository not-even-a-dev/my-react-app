import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAuthStore } from '@/stores/authStore';
import { Mail } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { signIn, isLoading, error: authError } = useAuthStore();
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setLocalError(null);
    try {
      await signIn(data.email, data.password);
      onSuccess?.();
    } catch (error) {
      setLocalError('Failed to sign in. Please check your credentials.');
    }
  };

  const displayError = localError || authError;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="email"
        type="email"
        label="Email"
        placeholder="Enter your email"
        error={errors.email?.message}
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          },
        })}
      />

      <Input
        id="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        error={errors.password?.message}
        {...register('password', {
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters',
          },
        })}
      />

      {displayError && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{displayError}</p>
        </div>
      )}

      <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
        Sign In
      </Button>
    </form>
  );
}

