import { create } from 'zustand';

let notifId = 1;

export const useNotifStore = create((set, get) => ({
  toasts: [],
  notifications: [],

  addToast: (toast) => {
    const id = notifId++;
    set(state => ({ toasts: [...state.toasts, { id, ...toast }] }));
    setTimeout(() => {
      set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }));
    }, toast.duration || 4000);
  },

  removeToast: (id) => {
    set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }));
  },

  addNotification: (notif) => {
    set(state => ({
      notifications: [{ id: notifId++, isRead: false, createdAt: new Date().toISOString(), ...notif }, ...state.notifications],
    }));
  },

  markAllRead: () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, isRead: true })),
    }));
  },

  unreadCount: () => get().notifications.filter(n => !n.isRead).length,
}));
