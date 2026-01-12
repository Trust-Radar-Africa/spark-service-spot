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

export const useApiConfigStore = create<ApiConfigState>()(
  persist(
    (set, get) => ({
      dataMode: 'demo',
      apiBaseUrl: import.meta.env.VITE_API_URL || '',
      setDataMode: (mode) => set({ dataMode: mode }),
      setApiBaseUrl: (url) => set({ apiBaseUrl: url }),
      isLiveMode: () => get().dataMode === 'live' && get().apiBaseUrl.length > 0,
    }),
    {
      name: 'api-config',
    }
  )
);
