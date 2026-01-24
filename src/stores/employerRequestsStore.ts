import { create } from 'zustand';
import { EmployerRequest } from '@/types/admin';
import { useApiConfigStore } from './apiConfigStore';

interface EmployerRequestsState {
  requests: EmployerRequest[];
  isLoading: boolean;
  error: string | null;
  fetchRequests: () => Promise<void>;
  deleteRequest: (id: number) => Promise<void>;
}

// Normalize employer request data from API (handles object fields)
const normalizeRequest = (request: any): EmployerRequest => ({
  ...request,
  // Handle country as object {id, name, slug} or string
  country: typeof request.country === 'object' && request.country !== null
    ? request.country.name || ''
    : request.country || '',
  // Handle preferred_location as object {id, name} or string (was 'location' in old API)
  preferred_location: typeof request.preferred_location === 'object' && request.preferred_location !== null
    ? request.preferred_location.name || ''
    : request.preferred_location || request.location || '',
  // Handle preferred_nationality as object {id, name} or string
  preferred_nationality: typeof request.preferred_nationality === 'object' && request.preferred_nationality !== null
    ? request.preferred_nationality.name || ''
    : request.preferred_nationality || '',
  // Ensure budgeted_salary exists
  budgeted_salary: request.budgeted_salary || '',
});

export const useEmployerRequestsStore = create<EmployerRequestsState>((set) => ({
  requests: [],
  isLoading: false,
  error: null,

  fetchRequests: async () => {
    const { getApiUrl } = useApiConfigStore.getState();

    set({ isLoading: true, error: null });

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(getApiUrl('/api/admin/employer-requests'), {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        const rawRequests = data.data || data;
        // Normalize requests to handle object fields
        const normalizedRequests = Array.isArray(rawRequests)
          ? rawRequests.map(normalizeRequest)
          : [];
        set({ requests: normalizedRequests, isLoading: false });
        return;
      }
      set({ error: 'Failed to fetch employer requests', isLoading: false });
    } catch (error) {
      console.error('Failed to fetch employer requests:', error);
      set({ error: 'Failed to connect to server', isLoading: false });
    }
  },

  deleteRequest: async (id: number) => {
    const { getApiUrl } = useApiConfigStore.getState();

    // Optimistically update UI
    set((state) => ({
      requests: state.requests.filter((r) => r.id !== id),
    }));

    try {
      const token = localStorage.getItem('admin_token');
      await fetch(getApiUrl(`/api/admin/employer-requests/${id}`), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
    } catch (error) {
      console.error('Failed to delete employer request from API:', error);
    }
  },
}));
