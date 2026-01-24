import { create } from 'zustand';
import { CandidateApplication } from '@/types/admin';
import { useApiConfigStore } from './apiConfigStore';

interface CandidatesState {
  candidates: CandidateApplication[];
  isLoading: boolean;
  fetchCandidates: () => Promise<void>;
  deleteCandidate: (id: number) => Promise<void>;
}

// Demo data for testing
const mockCandidates: CandidateApplication[] = [
  {
    id: 1,
    first_name: 'John',
    last_name: 'Smith',
    email: 'john.smith@example.com',
    nationality: 'British',
    country: 'United Kingdom',
    expected_salary: '2501-3000',
    experience: '3-7',
    job_applied: 'Senior Accountant',
    job_id: 1,
    cv_url: '/uploads/cv-1.docx',
    cover_letter_url: '/uploads/cl-1.docx',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.j@example.com',
    nationality: 'American',
    country: 'United States',
    expected_salary: '3501-4000',
    experience: '7-10',
    job_applied: 'Tax Manager',
    job_id: 2,
    cv_url: '/uploads/cv-2.docx',
    cover_letter_url: '/uploads/cl-2.docx',
    created_at: '2024-01-14T14:20:00Z',
    updated_at: '2024-01-14T14:20:00Z',
  },
  {
    id: 3,
    first_name: 'Michael',
    last_name: 'Chen',
    email: 'mchen@example.com',
    nationality: 'Canadian',
    country: 'Canada',
    expected_salary: '1001-1500',
    experience: '0-3',
    job_applied: 'Junior Accountant',
    job_id: 3,
    cv_url: '/uploads/cv-3.docx',
    cover_letter_url: '/uploads/cl-3.docx',
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z',
  },
  {
    id: 4,
    first_name: 'Emma',
    last_name: 'Wilson',
    email: 'emma.w@example.com',
    nationality: 'Australian',
    country: 'Australia',
    expected_salary: 'above-4001',
    experience: '10+',
    job_applied: 'Financial Controller',
    job_id: 4,
    cv_url: '/uploads/cv-4.docx',
    cover_letter_url: '/uploads/cl-4.docx',
    created_at: '2024-01-12T16:45:00Z',
    updated_at: '2024-01-12T16:45:00Z',
  },
  {
    id: 5,
    first_name: 'David',
    last_name: 'Brown',
    email: 'david.b@example.com',
    nationality: 'British',
    country: 'United Kingdom',
    expected_salary: '2001-2500',
    experience: '3-7',
    job_applied: 'Senior Accountant',
    job_id: 1,
    cv_url: '/uploads/cv-5.docx',
    cover_letter_url: '/uploads/cl-5.docx',
    created_at: '2024-01-11T11:00:00Z',
    updated_at: '2024-01-11T11:00:00Z',
  },
  {
    id: 6,
    first_name: 'Lisa',
    last_name: 'Taylor',
    email: 'lisa.t@example.com',
    nationality: 'American',
    country: 'United States',
    expected_salary: '500-1000',
    experience: '0-3',
    job_applied: 'Junior Accountant',
    job_id: 3,
    cv_url: '/uploads/cv-6.docx',
    cover_letter_url: '/uploads/cl-6.docx',
    created_at: '2024-01-10T09:30:00Z',
    updated_at: '2024-01-10T09:30:00Z',
  },
  {
    id: 7,
    first_name: 'James',
    last_name: 'Anderson',
    email: 'james.a@example.com',
    nationality: 'Canadian',
    country: 'Canada',
    expected_salary: '3001-3500',
    experience: '7-10',
    job_applied: 'Tax Manager',
    job_id: 2,
    cv_url: '/uploads/cv-7.docx',
    cover_letter_url: '/uploads/cl-7.docx',
    created_at: '2024-01-09T14:15:00Z',
    updated_at: '2024-01-09T14:15:00Z',
  },
  {
    id: 8,
    first_name: 'Fatima',
    last_name: 'Al-Hassan',
    email: 'fatima.h@example.com',
    nationality: 'Emirati',
    country: 'United Arab Emirates',
    expected_salary: '1501-2000',
    experience: '3-7',
    job_applied: 'Audit Associate',
    job_id: 5,
    cv_url: '/uploads/cv-8.docx',
    cover_letter_url: '/uploads/cl-8.docx',
    created_at: '2024-01-08T10:00:00Z',
    updated_at: '2024-01-08T10:00:00Z',
  },
];

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
  candidates: mockCandidates,
  isLoading: false,

  fetchCandidates: async () => {
    const { isLiveMode, getApiUrl } = useApiConfigStore.getState();

    set({ isLoading: true });

    // If in demo mode, reset to mock data with a small delay for UX
    if (!isLiveMode()) {
      await new Promise(resolve => setTimeout(resolve, 300));
      set({ candidates: [...mockCandidates], isLoading: false });
      return;
    }

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
    } catch (error) {
      console.log('Using demo data for candidates');
    }
    // Fall back to demo data
    set({ candidates: [...mockCandidates], isLoading: false });
  },

  deleteCandidate: async (id: number) => {
    const { isLiveMode, getApiUrl } = useApiConfigStore.getState();

    // Optimistically update UI
    set((state) => ({
      candidates: state.candidates.filter((c) => c.id !== id),
    }));

    // Call API if in live mode
    if (isLiveMode()) {
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
    }
  },
}));