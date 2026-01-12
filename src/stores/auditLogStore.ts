import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  action: 'create' | 'update' | 'delete' | 'archive' | 'deactivate' | 'activate' | 'publish' | 'unpublish';
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
  addLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  getLogsByModule: (module: AuditLogEntry['module']) => AuditLogEntry[];
  getLogsByUser: (userId: string) => AuditLogEntry[];
  getRecentLogs: (limit?: number) => AuditLogEntry[];
  clearLogs: () => void;
}

export const useAuditLogStore = create<AuditLogState>()(
  persist(
    (set, get) => ({
      logs: [],
      
      addLog: (entry) => {
        const newEntry: AuditLogEntry = {
          ...entry,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          logs: [newEntry, ...state.logs].slice(0, 1000), // Keep last 1000 logs
        }));
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
