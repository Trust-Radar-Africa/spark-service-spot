import { create } from 'zustand';
import { EmployerRequest, ExperienceLevel } from '@/types/admin';

interface EmployerRequestsState {
  requests: EmployerRequest[];
  isLoading: boolean;
  fetchRequests: () => Promise<void>;
  deleteRequest: (id: number) => void;
}

// Demo data for testing
const mockRequests: EmployerRequest[] = [
  {
    id: 1,
    firm_name: 'Al Tamimi & Company',
    email: 'hr@altamimi.com',
    country: 'United Arab Emirates',
    position_title: 'Senior Auditor',
    preferred_location: 'Dubai, UAE',
    preferred_nationality: 'Arab',
    years_experience: '7-10',
    other_qualifications: 'CPA/CA certified, Big 4 experience preferred, fluent in Arabic',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    firm_name: 'KPMG Lower Gulf',
    email: 'recruitment@kpmg.ae',
    country: 'United Arab Emirates',
    position_title: 'Tax Consultant',
    preferred_location: 'Abu Dhabi, UAE',
    preferred_nationality: 'Any',
    years_experience: '3-7',
    other_qualifications: 'VAT experience required, ACCA or CPA preferred',
    created_at: '2024-01-14T08:15:00Z',
    updated_at: '2024-01-14T08:15:00Z',
  },
  {
    id: 3,
    firm_name: 'PwC Middle East',
    email: 'careers@pwc.com',
    country: 'Saudi Arabia',
    position_title: 'Audit Manager',
    preferred_location: 'Riyadh, KSA',
    preferred_nationality: 'Western',
    years_experience: '10+',
    other_qualifications: 'IFRS expertise, team leadership experience, MBA preferred',
    created_at: '2024-01-13T14:45:00Z',
    updated_at: '2024-01-13T14:45:00Z',
  },
  {
    id: 4,
    firm_name: 'Deloitte Qatar',
    email: 'talent@deloitte.qa',
    country: 'Qatar',
    position_title: 'Financial Analyst',
    preferred_location: 'Doha, Qatar',
    preferred_nationality: 'South Asian',
    years_experience: '0-3',
    other_qualifications: 'Fresh graduates welcome, Excel proficiency required',
    created_at: '2024-01-12T09:20:00Z',
    updated_at: '2024-01-12T09:20:00Z',
  },
  {
    id: 5,
    firm_name: 'EY Bahrain',
    email: 'hiring@ey.bh',
    country: 'Bahrain',
    position_title: 'Internal Auditor',
    preferred_location: 'Manama, Bahrain',
    preferred_nationality: 'GCC National',
    years_experience: '3-7',
    other_qualifications: 'CIA certification preferred, banking sector experience',
    created_at: '2024-01-11T11:00:00Z',
    updated_at: '2024-01-11T11:00:00Z',
  },
];

export const useEmployerRequestsStore = create<EmployerRequestsState>((set) => ({
  requests: mockRequests,
  isLoading: false,

  fetchRequests: async () => {
    set({ isLoading: true });
    try {
      const apiUrl = import.meta.env.VITE_LARAVEL_API_URL;
      if (apiUrl) {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${apiUrl}/api/admin/employer-requests`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          set({ requests: data.data || data, isLoading: false });
          return;
        }
      }
    } catch (error) {
      console.log('Using demo data for employer requests');
    }
    // Fall back to demo data
    set({ requests: mockRequests, isLoading: false });
  },

  deleteRequest: (id: number) => {
    set((state) => ({
      requests: state.requests.filter((r) => r.id !== id),
    }));
  },
}));
