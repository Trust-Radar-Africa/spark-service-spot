import { create } from 'zustand';

export type DataMode = 'demo' | 'live';

interface ApiConfigState {
  dataMode: DataMode;
  apiBaseUrl: string;
  isLiveMode: () => boolean;
}

/**
 * API Configuration Store
 * 
 * Data source is controlled ONLY via environment variables:
 * - VITE_LARAVEL_API_URL: Set this to your Laravel API URL to enable live mode
 * - VITE_DATA_MODE: Optionally force 'demo' or 'live' mode (overrides auto-detection)
 * 
 * Examples:
 *   # Live mode (auto-detected when API URL is set)
 *   VITE_LARAVEL_API_URL=https://api.yoursite.com
 * 
 *   # Force demo mode even with API URL set
 *   VITE_LARAVEL_API_URL=https://api.yoursite.com
 *   VITE_DATA_MODE=demo
 * 
 *   # Demo mode (default when no API URL)
 *   # Just don't set VITE_LARAVEL_API_URL
 */

// Get API URL from environment variable
const getApiUrl = (): string => {
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

export const useApiConfigStore = create<ApiConfigState>()(() => ({
  dataMode: initialDataMode,
  apiBaseUrl: initialApiBaseUrl,
  isLiveMode: () => initialDataMode === 'live' && initialApiBaseUrl.length > 0,
}));
