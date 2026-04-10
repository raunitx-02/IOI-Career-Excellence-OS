import { create } from 'zustand';
import { DEMO_USERS } from '../data/mockData';

export const useUserStore = create((set) => ({
  users: [...DEMO_USERS],
  
  addUser: (user) => set((state) => ({ 
    users: [...state.users, { ...user, id: `USR-${Date.now()}` }] 
  })),
  
  updateUser: (id, data) => set((state) => ({
    users: state.users.map(u => u.id === id ? { ...u, ...data } : u)
  })),
  
  removeUser: (id) => set((state) => ({
    users: state.users.filter(u => u.id !== id)
  }))
}));
