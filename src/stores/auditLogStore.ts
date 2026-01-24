import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useApiConfigStore } from './apiConfigStore';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  action: 'create' | 'update' | 'delete' | 'archive' | 'deactivate' | 'activate' | 'publish' | 'unpublish' | 'download';
  module: 'candidates' | 'jobs' | 'employer_requests' | 'blog';
  resourceId: number | string;
  resourceName: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  metadata?: Record<string, any>;
}

interface AuditLogState {
  logs: AuditLogEntry[];
  isLoading: boolean;
  fetchLogs: () => Promise<void>;
  addLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => Promise<void>;
  getLogsByModule: (module: AuditLogEntry['module']) => AuditLogEntry[];
  getLogsByUser: (userId: string) => AuditLogEntry[];
  getRecentLogs: (limit?: number) => AuditLogEntry[];
  clearLogs: () => void;
}

export const useAuditLogStore = create<AuditLogState>()(
  persist(
    (set, get) => ({
      logs: [],
      
      isLoading: false,

      fetchLogs: async () => {
        const { isLiveMode, getApiUrl } = useApiConfigStore.getState();

        if (!isLiveMode()) return;

        set({ isLoading: true });

        try {
          const token = localStorage.getItem('admin_token');
          const response = await fetch(getApiUrl('/api/admin/audit-logs'), {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            set({ logs: data.data || data, isLoading: false });
            return;
          }
        } catch (error) {
          console.error('Failed to fetch audit logs from API:', error);
        }
        set({ isLoading: false });
      },

      addLog: async (entry) => {
        const { isLiveMode, getApiUrl } = useApiConfigStore.getState();

        const newEntry: AuditLogEntry = {
          ...entry,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        };

        // Add locally first
        set((state) => ({
          logs: [newEntry, ...state.logs].slice(0, 1000), // Keep last 1000 logs
        }));

        // Sync to API if in live mode
        if (isLiveMode()) {
          try {
            const token = localStorage.getItem('admin_token');
            await fetch(getApiUrl('/api/admin/audit-logs'), {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newEntry),
            });
          } catch (error) {
            console.error('Failed to sync audit log to API:', error);
          }
        }
      },

      getLogsByModule: (module) => {
        return get().logs.filter((log) => log.module === module);
      },

      getLogsByUser: (userId) => {
        return get().logs.filter((log) => log.userId === userId);
      },

      getRecentLogs: (limit = 50) => {
        return get().logs.slice(0, limit);
      },

      clearLogs: () => set({ logs: [] }),
    }),
    {
      name: 'audit-logs',
    }
  )
);

// Helper hook for logging actions
export function useAuditLogger() {
  const addLog = useAuditLogStore((state) => state.addLog);

  const logAction = (
    action: AuditLogEntry['action'],
    module: AuditLogEntry['module'],
    resourceId: number | string,
    resourceName: string,
    user: { id: string; name: string; email: string; role: string },
    changes?: AuditLogEntry['changes'],
    metadata?: Record<string, any>
  ) => {
    addLog({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      action,
      module,
      resourceId,
      resourceName,
      changes,
      metadata,
    });
  };

  return { logAction };
}
