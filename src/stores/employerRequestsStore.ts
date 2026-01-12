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
  {
    id: 6,
    firm_name: 'Grant Thornton UAE',
    email: 'careers@gtuae.com',
    country: 'United Arab Emirates',
    position_title: 'Forensic Accountant',
    preferred_location: 'Dubai, UAE',
    preferred_nationality: 'Any',
    years_experience: '7-10',
    other_qualifications: 'CFE certification required, litigation support experience',
    created_at: '2024-01-10T16:30:00Z',
    updated_at: '2024-01-10T16:30:00Z',
  },
  {
    id: 7,
    firm_name: 'BDO Kuwait',
    email: 'recruitment@bdo.kw',
    country: 'Kuwait',
    position_title: 'Senior Tax Advisor',
    preferred_location: 'Kuwait City, Kuwait',
    preferred_nationality: 'Arab',
    years_experience: '10+',
    other_qualifications: 'GCC tax law expertise, transfer pricing experience',
    created_at: '2024-01-09T09:45:00Z',
    updated_at: '2024-01-09T09:45:00Z',
  },
  {
    id: 8,
    firm_name: 'Crowe Oman',
    email: 'hr@crowe.om',
    country: 'Oman',
    position_title: 'Audit Associate',
    preferred_location: 'Muscat, Oman',
    preferred_nationality: 'South Asian',
    years_experience: '0-3',
    other_qualifications: 'ACCA/CPA in progress, fluent English required',
    created_at: '2024-01-08T13:20:00Z',
    updated_at: '2024-01-08T13:20:00Z',
  },
  {
    id: 9,
    firm_name: 'Mazars Saudi',
    email: 'talent@mazars.sa',
    country: 'Saudi Arabia',
    position_title: 'Risk Advisory Manager',
    preferred_location: 'Jeddah, KSA',
    preferred_nationality: 'Western',
    years_experience: '7-10',
    other_qualifications: 'CISA certification, IT audit background preferred',
    created_at: '2024-01-07T10:00:00Z',
    updated_at: '2024-01-07T10:00:00Z',
  },
  {
    id: 10,
    firm_name: 'RSM Jordan',
    email: 'careers@rsm.jo',
    country: 'Jordan',
    position_title: 'Bookkeeping Specialist',
    preferred_location: 'Amman, Jordan',
    preferred_nationality: 'Any',
    years_experience: '3-7',
    other_qualifications: 'QuickBooks and Xero expertise, multi-currency experience',
    created_at: '2024-01-06T14:15:00Z',
    updated_at: '2024-01-06T14:15:00Z',
  },
  {
    id: 11,
    firm_name: 'Baker Tilly Egypt',
    email: 'hr@bakertilly.eg',
    country: 'Egypt',
    position_title: 'Financial Controller',
    preferred_location: 'Cairo, Egypt',
    preferred_nationality: 'Arab',
    years_experience: '10+',
    other_qualifications: 'Manufacturing sector experience, ERP implementation skills',
    created_at: '2024-01-05T11:30:00Z',
    updated_at: '2024-01-05T11:30:00Z',
  },
  {
    id: 12,
    firm_name: 'HLB HAMT Dubai',
    email: 'jobs@hlbhamt.com',
    country: 'United Arab Emirates',
    position_title: 'VAT Consultant',
    preferred_location: 'Dubai, UAE',
    preferred_nationality: 'Any',
    years_experience: '3-7',
    other_qualifications: 'UAE VAT experience mandatory, ADIT qualification preferred',
    created_at: '2024-01-04T08:45:00Z',
    updated_at: '2024-01-04T08:45:00Z',
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
