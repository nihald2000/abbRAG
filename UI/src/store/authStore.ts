import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  username: string;
  email: string;
  is_active: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: (token: string, user: User) => 
        set({ isAuthenticated: true, token, user }),
      logout: () => 
        set({ isAuthenticated: false, token: null, user: null }),
      updateUser: (user: User) => 
        set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token 
      }),
    }
  )
);
