import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useSettingsStore, AdminRole, ROLE_PERMISSIONS } from '@/stores/settingsStore';

type Permission = 
  | 'candidates:view' | 'candidates:create' | 'candidates:update' | 'candidates:delete'
  | 'jobs:view' | 'jobs:create' | 'jobs:update' | 'jobs:delete' | 'jobs:archive'
  | 'employer_requests:view' | 'employer_requests:delete'
  | 'blog:view' | 'blog:create' | 'blog:update' | 'blog:delete'
  | 'settings:view' | 'settings:update'
  | 'users:view' | 'users:create' | 'users:update' | 'users:delete';

const PERMISSION_MAP: Record<AdminRole, Permission[]> = {
  super_admin: [
    'candidates:view', 'candidates:create', 'candidates:update', 'candidates:delete',
    'jobs:view', 'jobs:create', 'jobs:update', 'jobs:delete', 'jobs:archive',
    'employer_requests:view', 'employer_requests:delete',
    'blog:view', 'blog:create', 'blog:update', 'blog:delete',
    'settings:view', 'settings:update',
    'users:view', 'users:create', 'users:update', 'users:delete',
  ],
  editor: [
    'candidates:view',
    'jobs:view', 'jobs:create', 'jobs:update', 'jobs:archive', // Can archive but not delete
    'employer_requests:view',
    'blog:view', 'blog:create', 'blog:update', 'blog:delete',
    'settings:view',
  ],
  viewer: [
    'candidates:view',
    'jobs:view',
    'employer_requests:view',
    'blog:view',
    'settings:view',
  ],
};

export function useAdminPermissions() {
  const { user, isAuthenticated } = useAdminAuth();
  const { adminUsers } = useSettingsStore();
  
  // Get the user's role from the settings store (demo mode)
  // In production, this would come from the auth context
  const currentAdminUser = adminUsers.find((u) => u.email === user?.email);
  const userRole: AdminRole = currentAdminUser?.role || 'viewer';
  
  const hasPermission = (permission: Permission): boolean => {
    if (!isAuthenticated) return false;
    return PERMISSION_MAP[userRole]?.includes(permission) ?? false;
  };
  
  const canView = (module: 'candidates' | 'jobs' | 'employer_requests' | 'blog' | 'settings' | 'users'): boolean => {
    return hasPermission(`${module}:view` as Permission);
  };
  
  const canCreate = (module: 'candidates' | 'jobs' | 'blog' | 'users'): boolean => {
    return hasPermission(`${module}:create` as Permission);
  };
  
  const canUpdate = (module: 'candidates' | 'jobs' | 'blog' | 'settings' | 'users'): boolean => {
    return hasPermission(`${module}:update` as Permission);
  };
  
  const canDelete = (module: 'candidates' | 'jobs' | 'employer_requests' | 'blog' | 'users'): boolean => {
    return hasPermission(`${module}:delete` as Permission);
  };
  
  const canArchive = (module: 'jobs'): boolean => {
    return hasPermission(`${module}:archive` as Permission);
  };
  
  const isAdmin = userRole === 'super_admin';
  const isEditor = userRole === 'editor';
  const isViewer = userRole === 'viewer';
  
  return {
    userRole,
    hasPermission,
    canView,
    canCreate,
    canUpdate,
    canDelete,
    canArchive,
    isAdmin,
    isEditor,
    isViewer,
    roleInfo: ROLE_PERMISSIONS[userRole],
  };
}
