import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useApiConfigStore } from './apiConfigStore';

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
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  addNotification: (notification: Omit<AdminNotification, 'id' | 'timestamp' | 'read'>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  getUnreadCount: () => number;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: [],
      isLoading: false,
      error: null,

      fetchNotifications: async () => {
        const { getApiUrl } = useApiConfigStore.getState();

        set({ isLoading: true, error: null });

        try {
          const token = localStorage.getItem('admin_token');
          const response = await fetch(getApiUrl('/api/admin/notifications'), {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            set({ notifications: data.data || data, isLoading: false });
            return;
          }
          set({ error: 'Failed to fetch notifications', isLoading: false });
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
          set({ error: 'Failed to connect to server', isLoading: false });
        }
      },

      addNotification: async (notification) => {
        const { getApiUrl } = useApiConfigStore.getState();

        const newNotification: AdminNotification = {
          ...notification,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          read: false,
        };

        // Add locally first
        set((state) => ({
          notifications: [newNotification, ...state.notifications].slice(0, 50), // Keep max 50
        }));

        // Sync to API
        try {
          const token = localStorage.getItem('admin_token');
          await fetch(getApiUrl('/api/admin/notifications'), {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newNotification),
          });
        } catch (error) {
          console.error('Failed to sync notification to API:', error);
        }
      },

      markAsRead: async (id) => {
        const { getApiUrl } = useApiConfigStore.getState();

        // Update locally first
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));

        // Sync to API
        try {
          const token = localStorage.getItem('admin_token');
          await fetch(getApiUrl(`/api/admin/notifications/${id}/read`), {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          });
        } catch (error) {
          console.error('Failed to mark notification as read via API:', error);
        }
      },

      markAllAsRead: async () => {
        const { getApiUrl } = useApiConfigStore.getState();

        // Update locally first
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));

        // Sync to API
        try {
          const token = localStorage.getItem('admin_token');
          await fetch(getApiUrl('/api/admin/notifications/mark-all-read'), {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          });
        } catch (error) {
          console.error('Failed to mark all notifications as read via API:', error);
        }
      },

      removeNotification: async (id) => {
        const { getApiUrl } = useApiConfigStore.getState();

        // Update locally first
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));

        // Sync to API
        try {
          const token = localStorage.getItem('admin_token');
          await fetch(getApiUrl(`/api/admin/notifications/${id}`), {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          });
        } catch (error) {
          console.error('Failed to delete notification via API:', error);
        }
      },

      clearAll: async () => {
        const { getApiUrl } = useApiConfigStore.getState();

        // Update locally first
        set({ notifications: [] });

        // Sync to API
        try {
          const token = localStorage.getItem('admin_token');
          await fetch(getApiUrl('/api/admin/notifications/clear'), {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          });
        } catch (error) {
          console.error('Failed to clear notifications via API:', error);
        }
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
