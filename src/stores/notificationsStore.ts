





























































































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
  fetchNotifications: () => Promise<void>;
  addNotification: (notification: Omit<AdminNotification, 'id' | 'timestamp' | 'read'>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
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
      isLoading: false,

      fetchNotifications: async () => {
        const { isLiveMode, apiBaseUrl } = useApiConfigStore.getState();

        set({ isLoading: true });

        // If in demo mode, reset to demo data
        if (!isLiveMode()) {
          await new Promise(resolve => setTimeout(resolve, 300));
          set({ notifications: generateDemoNotifications(), isLoading: false });
          return;
        }

        try {
          const token = localStorage.getItem('admin_token');
          const response = await fetch(`${apiBaseUrl}/api/admin/notifications`, {
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
        } catch (error) {
          console.log('Using demo data for notifications');
        }
        // Fall back to demo data
        set({ notifications: generateDemoNotifications(), isLoading: false });
      },

      addNotification: async (notification) => {
        const { isLiveMode, apiBaseUrl } = useApiConfigStore.getState();

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

        // Sync to API if in live mode
        if (isLiveMode()) {
          try {
            const token = localStorage.getItem('admin_token');
            await fetch(`${apiBaseUrl}/api/admin/notifications`, {
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
        }
      },

      markAsRead: async (id) => {
        const { isLiveMode, apiBaseUrl } = useApiConfigStore.getState();

        // Update locally first
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));

        // Sync to API if in live mode
        if (isLiveMode()) {
          try {
            const token = localStorage.getItem('admin_token');
            await fetch(`${apiBaseUrl}/api/admin/notifications/${id}/read`, {
              method: 'PATCH',
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
              },
            });
          } catch (error) {
            console.error('Failed to mark notification as read via API:', error);
          }
        }
      },

      markAllAsRead: async () => {
        const { isLiveMode, apiBaseUrl } = useApiConfigStore.getState();

        // Update locally first
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));

        // Sync to API if in live mode
        if (isLiveMode()) {
          try {
            const token = localStorage.getItem('admin_token');
            await fetch(`${apiBaseUrl}/api/admin/notifications/mark-all-read`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
              },
            });
          } catch (error) {
            console.error('Failed to mark all notifications as read via API:', error);
          }
        }
      },

      removeNotification: async (id) => {
        const { isLiveMode, apiBaseUrl } = useApiConfigStore.getState();

        // Update locally first
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));

        // Sync to API if in live mode
        if (isLiveMode()) {
          try {
            const token = localStorage.getItem('admin_token');
            await fetch(`${apiBaseUrl}/api/admin/notifications/${id}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
              },
            });
          } catch (error) {
            console.error('Failed to delete notification via API:', error);
          }
        }
      },

      clearAll: async () => {
        const { isLiveMode, apiBaseUrl } = useApiConfigStore.getState();

        // Update locally first
        set({ notifications: [] });

        // Sync to API if in live mode
        if (isLiveMode()) {
          try {
            const token = localStorage.getItem('admin_token');
            await fetch(`${apiBaseUrl}/api/admin/notifications/clear`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
              },
            });
          } catch (error) {
            console.error('Failed to clear notifications via API:', error);
          }
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
