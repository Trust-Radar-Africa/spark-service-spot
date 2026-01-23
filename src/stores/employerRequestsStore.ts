
import { create } from 'zustand';
import { EmployerRequest } from '@/types/admin';
import { useApiConfigStore } from './apiConfigStore';

interface EmployerRequestsState {
  requests: EmployerRequest[];
  isLoading: boolean;
  fetchRequests: () => Promise<void>;
  deleteRequest: (id: number) => Promise<void>;
}

// Demo data for testing
const mockRequests: EmployerRequest[] = [
  {
    id: 1,
    firm_name: 'Al Tamimi & Company',
    email: 'hr@altamimi.com',
    country: 'United Arab Emirates',
    location: 'Dubai',
    position_title: 'Senior Auditor',
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
    location: 'Abu Dhabi',
    position_title: 'Tax Consultant',
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
    location: 'Riyadh',
    position_title: 'Audit Manager',
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
    location: 'Doha',
    position_title: 'Financial Analyst',
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
    location: 'Manama',
    position_title: 'Internal Auditor',
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
    location: 'Dubai',
    position_title: 'Forensic Accountant',
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
    location: 'Kuwait City',
    position_title: 'Senior Tax Advisor',
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
    location: 'Muscat',
    position_title: 'Audit Associate',
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
    location: 'Jeddah',
    position_title: 'Risk Advisory Manager',
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
    location: 'Amman',
    position_title: 'Bookkeeping Specialist',
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
    location: 'Cairo',
    position_title: 'Financial Controller',
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
    location: 'Dubai',
    position_title: 'VAT Consultant',
    preferred_nationality: 'Any',
    years_experience: '3-7',
    other_qualifications: 'UAE VAT experience mandatory, ADIT qualification preferred',
    created_at: '2024-01-04T08:45:00Z',
    updated_at: '2024-01-04T08:45:00Z',
  },
];

// Normalize employer request data from API (handles object fields)
const normalizeRequest = (request: any): EmployerRequest => ({
  ...request,
  // Handle country as object {id, name, slug} or string
  country: typeof request.country === 'object' && request.country !== null
    ? request.country.name || ''
    : request.country || '',
  // Handle location as object {id, name} or string
  location: typeof request.location === 'object' && request.location !== null
    ? request.location.name || ''
    : request.location || '',
  // Handle preferred_nationality as object {id, name} or string
  preferred_nationality: typeof request.preferred_nationality === 'object' && request.preferred_nationality !== null
    ? request.preferred_nationality.name || ''
    : request.preferred_nationality || '',
});

export const useEmployerRequestsStore = create<EmployerRequestsState>((set, get) => ({
  requests: mockRequests,
  isLoading: false,

  fetchRequests: async () => {
    const { apiBaseUrl, isLiveMode } = useApiConfigStore.getState();

    set({ isLoading: true });

    // If in demo mode, just reset to mock data with a small delay for UX
    if (!isLiveMode()) {
      await new Promise(resolve => setTimeout(resolve, 300));
      set({ requests: [...mockRequests], isLoading: false });
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${apiBaseUrl}/api/admin/employer-requests`, {
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
    } catch (error) {
      console.log('Using demo data for employer requests');
    }
    // Fall back to demo data
    set({ requests: [...mockRequests], isLoading: false });
  },

  deleteRequest: async (id: number) => {
    const { isLiveMode, apiBaseUrl } = useApiConfigStore.getState();

    // Optimistically update UI
    set((state) => ({
      requests: state.requests.filter((r) => r.id !== id),
    }));

    // Call API if in live mode
    if (isLiveMode()) {
      try {
        const token = localStorage.getItem('admin_token');
        await fetch(`${apiBaseUrl}/api/admin/employer-requests/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
      } catch (error) {
        console.error('Failed to delete employer request from API:', error);
      }
    }
  },
}));