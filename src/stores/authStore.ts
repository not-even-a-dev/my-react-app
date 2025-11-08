import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/config/firebase';

interface AuthState {
  user: FirebaseUser | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

interface AuthActions {
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  checkRedirectResult: () => Promise<boolean>;
  signOut: () => Promise<void>;
  checkAuthState: () => void;
  clearError: () => void;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isInitialized: false,
};

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  ...initialState,

  // Sign up with email and password
  signUp: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      set({ user: userCredential.user, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to sign up';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      set({ user: userCredential.user, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to sign in';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const provider = new GoogleAuthProvider();
      
      // Add custom parameters to ensure proper redirect handling
      provider.setCustomParameters({
        prompt: 'select_account',
      });
      
      // First try popup, but if it fails with certain errors, use redirect
      try {
        const userCredential = await signInWithPopup(auth, provider);
        set({ user: userCredential.user, isLoading: false });
      } catch (popupError: any) {
        // If popup fails due to these specific errors, fall back to redirect
        if (
          popupError?.code === 'auth/popup-blocked' ||
          popupError?.code === 'auth/popup-closed-by-user' ||
          popupError?.code === 'auth/invalid-action' ||
          popupError?.message?.includes('invalid')
        ) {
          // Use redirect instead, which is more reliable for OAuth
          await signInWithRedirect(auth, provider);
          // Note: signInWithRedirect doesn't return immediately - the page will redirect
          // The result will be handled by checkRedirectResult
          return;
        }
        throw popupError;
      }
    } catch (error: any) {
      // Provide more detailed error information
      let errorMessage = 'Failed to sign in with Google';
      
      if (error?.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized for Google sign-in. Please add your domain to Firebase Console > Authentication > Settings > Authorized domains.';
      } else if (error?.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in popup was closed. Please try again.';
      } else if (error?.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked. Using redirect method...';
      } else if (error?.code === 'auth/invalid-action') {
        errorMessage = 'Invalid action. Please ensure your Firebase Auth Domain is correctly configured in Firebase Console and matches your app URL.';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      console.error('Google sign-in error:', error);
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Check for redirect result after page load
  checkRedirectResult: async () => {
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        set({ user: result.user, isLoading: false });
        return true;
      }
      return false;
    } catch (error: any) {
      let errorMessage = 'Failed to complete Google sign-in';
      if (error?.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized. Please add it to Firebase Console > Authentication > Settings > Authorized domains.';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  // Sign out
  signOut: async () => {
    set({ isLoading: true });
    try {
      await firebaseSignOut(auth);
      set({ user: null, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to sign out';
      set({ error: errorMessage, isLoading: false });
    }
  },

  // Check authentication state
  checkAuthState: () => {
    set({ isLoading: true });
    // First check for redirect result
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          set({ user: result.user });
        }
      })
      .catch((error) => {
        console.error('Error checking redirect result:', error);
      })
      .finally(() => {
        // Then set up the auth state listener
        onAuthStateChanged(auth, (user) => {
          set({ user, isLoading: false, isInitialized: true });
        });
      });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

