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
  error: string | null;
  fetchLogs: () => Promise<void>;
  addLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => Promise<void>;
  getLogsByModule: (module: AuditLogEntry['module']) => AuditLogEntry[];
  getLogsByUser: (userId: string) => AuditLogEntry[];
  getRecentLogs: (limit?: number) => AuditLogEntry[];
  clearLogs: () => void;
}

// Normalize audit log entry from API (handles snake_case fields)
const normalizeLogEntry = (entry: any): AuditLogEntry => ({
  id: entry.id || '',
  timestamp: entry.timestamp || entry.created_at || new Date().toISOString(),
  userId: entry.userId || entry.user_id || '',
  userName: entry.userName || entry.user_name || 'Unknown',
  userEmail: entry.userEmail || entry.user_email || '',
  userRole: entry.userRole || entry.user_role || 'N/A',
  action: entry.action || 'update',
  module: entry.module || 'candidates',
  resourceId: entry.resourceId || entry.resource_id || '',
  resourceName: entry.resourceName || entry.resource_name || '',
  changes: entry.changes,
  metadata: entry.metadata,
});

export const useAuditLogStore = create<AuditLogState>()(
  persist(
    (set, get) => ({
      logs: [],
      isLoading: false,
      error: null,

      fetchLogs: async () => {
        const { getApiUrl } = useApiConfigStore.getState();

        set({ isLoading: true, error: null });

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
            const rawLogs = data.data || data;
            const normalizedLogs = Array.isArray(rawLogs)
              ? rawLogs.map(normalizeLogEntry)
              : [];
            set({ logs: normalizedLogs, isLoading: false });
            return;
          }
          set({ error: 'Failed to fetch audit logs', isLoading: false });
        } catch (error) {
          console.error('Failed to fetch audit logs from API:', error);
          set({ error: 'Failed to connect to server', isLoading: false });
        }
      },

      addLog: async (entry) => {
        const { getApiUrl } = useApiConfigStore.getState();

        const newEntry: AuditLogEntry = {
          ...entry,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        };

        // Add locally first
        set((state) => ({
          logs: [newEntry, ...state.logs].slice(0, 1000), // Keep last 1000 logs
        }));

        // Sync to API
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
