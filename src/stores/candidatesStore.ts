import { create } from 'zustand';
import { CandidateApplication } from '@/types/admin';
import { useApiConfigStore } from './apiConfigStore';

interface CandidatesState {
  candidates: CandidateApplication[];
  isLoading: boolean;
  error: string | null;
  fetchCandidates: () => Promise<void>;
  deleteCandidate: (id: number) => Promise<void>;
}

// Normalize candidate data from API (handles object fields)
const normalizeCandidate = (candidate: any): CandidateApplication => ({
  ...candidate,
  // Handle nationality as object {id, name} or string
  nationality: typeof candidate.nationality === 'object' && candidate.nationality !== null
    ? candidate.nationality.name || ''
    : candidate.nationality || '',
  // Handle country as object {id, name, slug} or string
  country: typeof candidate.country === 'object' && candidate.country !== null
    ? candidate.country.name || ''
    : candidate.country || '',
  // Handle location as object {id, name} or string
  location: typeof candidate.location === 'object' && candidate.location !== null
    ? candidate.location.name || ''
    : candidate.location || '',
  // Handle job_applied as object {id, title} or string
  job_applied: typeof candidate.job_applied === 'object' && candidate.job_applied !== null
    ? candidate.job_applied.title || candidate.job_applied.name || ''
    : candidate.job_applied || '',
});

export const useCandidatesStore = create<CandidatesState>((set) => ({
  candidates: [],
  isLoading: false,
  error: null,

  fetchCandidates: async () => {
    const { getApiUrl } = useApiConfigStore.getState();

    set({ isLoading: true, error: null });

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(getApiUrl('/api/admin/candidates'), {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        const rawCandidates = data.data || data;
        // Normalize candidates to handle object fields
        const normalizedCandidates = Array.isArray(rawCandidates)
          ? rawCandidates.map(normalizeCandidate)
          : [];
        set({ candidates: normalizedCandidates, isLoading: false });
        return;
      }
      set({ error: 'Failed to fetch candidates', isLoading: false });
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
      set({ error: 'Failed to connect to server', isLoading: false });
    }
  },

  deleteCandidate: async (id: number) => {
    const { getApiUrl } = useApiConfigStore.getState();

    // Optimistically update UI
    set((state) => ({
      candidates: state.candidates.filter((c) => c.id !== id),
    }));

    try {
      const token = localStorage.getItem('admin_token');
      await fetch(getApiUrl(`/api/admin/candidates/${id}`), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
    } catch (error) {
      console.error('Failed to delete candidate from API:', error);
    }
  },
}));
