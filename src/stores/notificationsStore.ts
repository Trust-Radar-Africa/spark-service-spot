import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AdminNotification {
  id: string;
  type: 'candidate' | 'employer' | 'job' | 'blog';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

interface NotificationsState {
  notifications: AdminNotification[];
  addNotification: (notification: Omit<AdminNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  getUnreadCount: () => number;
}

// Generate initial demo notifications
const generateDemoNotifications = (): AdminNotification[] => {
  const now = new Date();
  return [
    {
      id: '1',
      type: 'candidate',
      title: 'New Candidate Application',
      message: 'John Smith has applied for Audit Senior position',
      timestamp: new Date(now.getTime() - 15 * 60000).toISOString(), // 15 mins ago
      read: false,
      link: '/admin/candidates',
    },
    {
      id: '2',
      type: 'employer',
      title: 'New Employer Request',
      message: 'Al Tamimi & Company submitted a recruitment request',
      timestamp: new Date(now.getTime() - 45 * 60000).toISOString(), // 45 mins ago
      read: false,
      link: '/admin/employers',
    },
    {
      id: '3',
      type: 'candidate',
      title: 'New Candidate Application',
      message: 'Sarah Johnson has applied for Tax Consultant position',
      timestamp: new Date(now.getTime() - 2 * 3600000).toISOString(), // 2 hours ago
      read: true,
      link: '/admin/candidates',
    },
    {
      id: '4',
      type: 'employer',
      title: 'New Employer Request',
      message: 'KPMG Lower Gulf submitted a recruitment request',
      timestamp: new Date(now.getTime() - 5 * 3600000).toISOString(), // 5 hours ago
      read: true,
      link: '/admin/employers',
    },
  ];
};

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: generateDemoNotifications(),

      addNotification: (notification) => {
        const newNotification: AdminNotification = {
          ...notification,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          read: false,
        };
        set((state) => ({
          notifications: [newNotification, ...state.notifications].slice(0, 50), // Keep max 50
        }));
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      clearAll: () => {
        set({ notifications: [] });
      },

      getUnreadCount: () => {
        return get().notifications.filter((n) => !n.read).length;
      },
    }),
    {
      name: 'admin-notifications-storage',
    }
  )
);
