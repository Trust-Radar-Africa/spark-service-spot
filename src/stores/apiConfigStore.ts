import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DataMode = 'demo' | 'live';

interface ApiConfigState {
  dataMode: DataMode;
  apiBaseUrl: string;
  setDataMode: (mode: DataMode) => void;
  setApiBaseUrl: (url: string) => void;
  isLiveMode: () => boolean;
}

// Get API URL from environment variable
const getDefaultApiUrl = (): string => {
  return import.meta.env.VITE_LARAVEL_API_URL || import.meta.env.VITE_API_URL || '';
};

export const useApiConfigStore = create<ApiConfigState>()(
  persist(
    (set, get) => ({
      dataMode: import.meta.env.VITE_LARAVEL_API_URL ? 'live' : 'demo',
      apiBaseUrl: getDefaultApiUrl(),
      setDataMode: (mode) => set({ dataMode: mode }),
      setApiBaseUrl: (url) => set({ apiBaseUrl: url }),
      isLiveMode: () => get().dataMode === 'live' && get().apiBaseUrl.length > 0,
    }),
    {
      name: 'api-config',
    }
  )
);
