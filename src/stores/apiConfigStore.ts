import { create } from 'zustand';

export type DataMode = 'demo' | 'live';
export type ApiBackend = 'laravel' | 'json-server';

interface ApiConfigState {
  dataMode: DataMode;
  apiBaseUrl: string;
  apiBackend: ApiBackend;
  isLiveMode: () => boolean;
  isJsonServer: () => boolean;
  getApiUrl: (path: string) => string;
}

/**
 * API Configuration Store
 * 
 * Data source is controlled ONLY via environment variables:
 * 
 * BACKEND SELECTION:
 * - VITE_API_BACKEND: 'laravel' or 'json-server' (defaults to 'laravel')
 * - VITE_JSON_SERVER_URL: JSON Server URL (defaults to 'http://localhost:3001')
 * - VITE_LARAVEL_API_URL: Laravel API URL for production
 * 
 * MODE CONTROL:
 * - VITE_DATA_MODE: Optionally force 'demo' or 'live' mode
 * 
 * Examples:
 *   # Development with JSON Server
 *   VITE_API_BACKEND=json-server
 *   VITE_JSON_SERVER_URL=http://localhost:3001
 * 
 *   # Production with Laravel API
 *   VITE_API_BACKEND=laravel
 *   VITE_LARAVEL_API_URL=https://api.yoursite.com
 * 
 *   # Demo mode (no backend)
 *   VITE_DATA_MODE=demo
 */

// Determine which backend to use
const getApiBackend = (): ApiBackend => {
  const backend = import.meta.env.VITE_API_BACKEND;
  if (backend === 'json-server') return 'json-server';
  return 'laravel';
};

// Get the appropriate API URL based on backend selection
const getApiUrl = (): string => {
  const backend = getApiBackend();
  
  if (backend === 'json-server') {
    return import.meta.env.VITE_JSON_SERVER_URL || 'http://localhost:3001';
  }
  
  return import.meta.env.VITE_LARAVEL_API_URL || import.meta.env.VITE_API_URL || '';
};

// Determine data mode from environment
const getDataMode = (): DataMode => {
  // Check for explicit mode override
  const explicitMode = import.meta.env.VITE_DATA_MODE;
  if (explicitMode === 'demo' || explicitMode === 'live') {
    return explicitMode;
  }
  
  // Auto-detect: live if API URL is configured, demo otherwise
  return getApiUrl() ? 'live' : 'demo';
};

// Pre-compute values at module load time
const initialDataMode = getDataMode();
const initialApiBaseUrl = getApiUrl();
const initialApiBackend = getApiBackend();

/**
 * Build the correct API URL path based on backend type
 * - Laravel: /api/admin/endpoint or /api/endpoint
 * - JSON Server: /api/endpoint (when started with --base /api)
 *   For admin routes, strips /admin/ since JSON Server serves flat resources
 */
const buildApiPath = (path: string, backend: ApiBackend, baseUrl: string): string => {
  // Normalize path (remove leading slash if present)
  let normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  
  if (backend === 'json-server') {
    // JSON Server with --base /api serves /api/resource
    // Strip /admin/ from paths since JSON Server has flat resources
    if (normalizedPath.startsWith('api/admin/')) {
      normalizedPath = 'api/' + normalizedPath.slice(10); // /api/admin/candidates -> /api/candidates
    } else if (normalizedPath.startsWith('admin/')) {
      normalizedPath = normalizedPath.slice(6); // admin/candidates -> candidates
    }
    return `${baseUrl}/${normalizedPath}`;
  }
  
  // Laravel uses /api prefix
  const laravelPath = normalizedPath.startsWith('api/') 
    ? normalizedPath 
    : `api/${normalizedPath}`;
  return `${baseUrl}/${laravelPath}`;
};

export const useApiConfigStore = create<ApiConfigState>()(() => ({
  dataMode: initialDataMode,
  apiBaseUrl: initialApiBaseUrl,
  apiBackend: initialApiBackend,
  isLiveMode: () => initialDataMode === 'live' && initialApiBaseUrl.length > 0,
  isJsonServer: () => initialApiBackend === 'json-server',
  getApiUrl: (path: string) => buildApiPath(path, initialApiBackend, initialApiBaseUrl),
}));
