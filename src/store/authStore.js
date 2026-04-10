import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEMO_USERS } from '../data/mockData';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (email, password) => {
        const found = DEMO_USERS.find(
          u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (found) {
          const { password: _, ...safeUser } = found;
          set({ user: safeUser, isAuthenticated: true });
          return { success: true, user: safeUser };
        }
        return { success: false, error: 'Invalid email or password.' };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      // For demo: quick login by role
      quickLogin: (role) => {
        const roleMap = {
          superAdmin: 'superadmin@pwioi.edu',
          centerAdmin: 'admin.blr@pwioi.edu',
          faculty: DEMO_USERS.find(u => u.role === 'faculty')?.email,
          student: DEMO_USERS.find(u => u.role === 'student')?.email,
          management: 'management@pwioi.edu',
        };
        const email = roleMap[role];
        const found = DEMO_USERS.find(u => u.email === email);
        if (found) {
          const { password: _, ...safeUser } = found;
          set({ user: safeUser, isAuthenticated: true });
          return safeUser;
        }
        return null;
      },
    }),
    {
      name: 'ioi-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
