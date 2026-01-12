import { create } from 'zustand';
import { CandidateApplication } from '@/types/admin';
import { useApiConfigStore } from './apiConfigStore';

interface CandidatesState {
  candidates: CandidateApplication[];
  isLoading: boolean;
  fetchCandidates: () => Promise<void>;
  deleteCandidate: (id: number) => void;
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
    location: 'London',
    experience: '3-7',
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
    location: 'New York',
    experience: '7-10',
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
    location: 'Toronto',
    experience: '0-3',
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
    location: 'Sydney',
    experience: '10+',
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
    location: 'Manchester',
    experience: '3-7',
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
    location: 'Los Angeles',
    experience: '0-3',
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
    location: 'Vancouver',
    experience: '7-10',
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
    location: 'Dubai',
    experience: '3-7',
    cv_url: '/uploads/cv-8.docx',
    cover_letter_url: '/uploads/cl-8.docx',
    created_at: '2024-01-08T10:00:00Z',
    updated_at: '2024-01-08T10:00:00Z',
  },
];

export const useCandidatesStore = create<CandidatesState>((set) => ({
  candidates: mockCandidates,
  isLoading: false,

  fetchCandidates: async () => {
    const { isLiveMode, apiBaseUrl } = useApiConfigStore.getState();
    
    set({ isLoading: true });
    
    // If in demo mode, reset to mock data with a small delay for UX
    if (!isLiveMode()) {
      await new Promise(resolve => setTimeout(resolve, 300));
      set({ candidates: [...mockCandidates], isLoading: false });
      return;
    }
    
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${apiBaseUrl}/api/admin/candidates`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        set({ candidates: data.data || data, isLoading: false });
        return;
      }
    } catch (error) {
      console.log('Using demo data for candidates');
    }
    // Fall back to demo data
    set({ candidates: [...mockCandidates], isLoading: false });
  },

  deleteCandidate: (id: number) => {
    set((state) => ({
      candidates: state.candidates.filter((c) => c.id !== id),
    }));
  },
}));