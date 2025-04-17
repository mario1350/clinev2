import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/vendor';

interface UserStore {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAdmin: () => boolean;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      isAdmin: () => get().currentUser?.role === 'admin',
    }),
    {
      name: 'user-storage',
    }
  )
);