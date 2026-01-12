import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { JobPosting, JobPostingFormData, ExperienceLevel } from '@/types/admin';
import { useApiConfigStore } from './apiConfigStore';

// Initial mock data - these would come from Laravel API in production
const initialJobs: JobPosting[] = [
  {
    id: 1,
    title: 'Audit Seniors',
    description: 'Join an accountancy firm based in Dublin, Ireland to work exclusively remotely in their assurance team.',
    location: 'Dublin, Ireland (100% Remote)',
    experience_required: '3-7',
    requirements: `• Fully Qualified ACA, CA, CPA or equivalent
• Strong External Audit experience
• Minimum 5 years experience in a well established firm
• Resume with 3 referees (one from previous firm)
• Member in good standing of a recognized professional body`,
    benefits: `• Competitive salary
• 100% Remote work
• International exposure
• Career development opportunities`,
    salary_range: '€55,000 - €75,000',
    is_active: true,
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-10T09:00:00Z',
  },
  {
    id: 2,
    title: 'Audit Seniors',
    description: 'Join an accountancy firm based in Atlanta, Georgia to work exclusively remotely in their assurance team.',
    location: 'Atlanta, Georgia (100% Remote)',
    experience_required: '3-7',
    requirements: `• Fully Qualified ACA, ACCA, CA, CPA or equivalent
• Strong External Audit experience
• Minimum 5 years experience in a well established firm
• Resume with 3 referees (one from previous firm)`,
    benefits: `• Competitive USD salary
• 100% Remote work
• Work with US GAAP clients
• Professional development`,
    salary_range: '$65,000 - $85,000',
    is_active: true,
    created_at: '2024-01-12T14:30:00Z',
    updated_at: '2024-01-12T14:30:00Z',
  },
  {
    id: 3,
    title: 'Senior Accountant',
    description: 'We are looking for an experienced Senior Accountant to join our team. The ideal candidate will have strong analytical skills and experience with financial reporting.',
    location: 'London, UK (Hybrid)',
    experience_required: '7-10',
    requirements: `• CPA or ACCA qualified
• 7+ years experience in accounting
• Proficiency in Excel and accounting software
• Strong communication skills`,
    benefits: `• Competitive salary
• Health insurance
• Pension scheme
• Flexible working`,
    salary_range: '£55,000 - £70,000',
    is_active: true,
    created_at: '2024-01-08T11:00:00Z',
    updated_at: '2024-01-15T16:00:00Z',
  },
  {
    id: 4,
    title: 'Junior Bookkeeper',
    description: 'Entry-level position for a motivated individual looking to start their career in accounting. Full training provided.',
    location: 'Manchester, UK (Remote)',
    experience_required: '0-3',
    requirements: `• Basic accounting knowledge
• Attention to detail
• Willingness to learn
• Good communication skills`,
    benefits: `• Training and development
• Career progression
• Friendly team environment
• Flexible hours`,
    salary_range: '£25,000 - £30,000',
    is_active: true,
    created_at: '2024-01-05T08:00:00Z',
    updated_at: '2024-01-05T08:00:00Z',
  },
  {
    id: 5,
    title: 'Tax Consultant',
    description: 'Experienced Tax Consultant needed for our growing advisory practice. Handle complex tax matters for corporate clients.',
    location: 'Birmingham, UK (Hybrid)',
    experience_required: '3-7',
    requirements: `• CTA qualified
• Experience with corporate tax
• Excellent communication skills
• Client management experience`,
    benefits: `• Bonus scheme
• Professional development budget
• Remote working options
• Health insurance`,
    salary_range: '£45,000 - £55,000',
    is_active: true,
    created_at: '2024-01-03T10:00:00Z',
    updated_at: '2024-01-03T10:00:00Z',
  },
  {
    id: 6,
    title: 'Finance Director',
    description: 'Strategic leadership role overseeing all financial operations. Report directly to the CEO and board of directors.',
    location: 'London, UK (On-site)',
    experience_required: '10+',
    requirements: `• ACA/ACCA/CIMA qualified
• 10+ years experience including leadership roles
• Strategic planning experience
• Board-level presentation skills`,
    benefits: `• Executive compensation package
• Car allowance
• Private healthcare
• Equity participation`,
    salary_range: '£120,000 - £150,000',
    is_active: true,
    created_at: '2024-01-01T09:00:00Z',
    updated_at: '2024-01-01T09:00:00Z',
  },
];

interface JobPostingsState {
  jobs: JobPosting[];
  isLoading: boolean;
  
  // Actions
  fetchJobs: () => Promise<void>;
  addJob: (data: JobPostingFormData) => JobPosting;
  updateJob: (id: number, data: JobPostingFormData) => void;
  deleteJob: (id: number) => void;
  toggleJobStatus: (id: number) => void;
  
  // Getters
  getActiveJobs: () => JobPosting[];
  getJobById: (id: number) => JobPosting | undefined;
}

export const useJobPostingsStore = create<JobPostingsState>()(
  persist(
    (set, get) => ({
      jobs: initialJobs,
      isLoading: false,
      
      fetchJobs: async () => {
        const { isLiveMode, apiBaseUrl } = useApiConfigStore.getState();
        
        set({ isLoading: true });
        
        // If in demo mode, reset to initial data with a small delay for UX
        if (!isLiveMode()) {
          await new Promise(resolve => setTimeout(resolve, 300));
          set({ jobs: [...initialJobs], isLoading: false });
          return;
        }
        
        try {
          const token = localStorage.getItem('admin_token');
          const response = await fetch(`${apiBaseUrl}/api/admin/job-postings`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          });
          if (response.ok) {
            const data = await response.json();
            set({ jobs: data.data || data, isLoading: false });
            return;
          }
        } catch (error) {
          console.log('Using demo data for job postings');
        }
        // Fall back to demo data
        set({ jobs: [...initialJobs], isLoading: false });
      },
      
      addJob: (data: JobPostingFormData) => {
        const newJob: JobPosting = {
          id: Math.max(...get().jobs.map(j => j.id), 0) + 1,
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        set(state => ({ jobs: [newJob, ...state.jobs] }));
        return newJob;
      },
      
      updateJob: (id: number, data: JobPostingFormData) => {
        set(state => ({
          jobs: state.jobs.map(job =>
            job.id === id
              ? { ...job, ...data, updated_at: new Date().toISOString() }
              : job
          ),
        }));
      },
      
      deleteJob: (id: number) => {
        set(state => ({
          jobs: state.jobs.filter(job => job.id !== id),
        }));
      },
      
      toggleJobStatus: (id: number) => {
        set(state => ({
          jobs: state.jobs.map(job =>
            job.id === id
              ? { ...job, is_active: !job.is_active, updated_at: new Date().toISOString() }
              : job
          ),
        }));
      },
      
      getActiveJobs: () => {
        return get().jobs.filter(job => job.is_active);
      },
      
      getJobById: (id: number) => {
        return get().jobs.find(job => job.id === id);
      },
    }),
    {
      name: 'job-postings-storage',
    }
  )
);

// Helper function to get experience label
export const getExperienceLabel = (exp: ExperienceLevel): string => {
  const labels: Record<ExperienceLevel, string> = {
    '0-3': '0-3 years',
    '3-7': '3-7 years',
    '7-10': '7-10 years',
    '10+': '10+ years',
  };
  return labels[exp];
};

// Locations for filtering (derived from jobs)
export const getUniqueLocations = (jobs: JobPosting[]): string[] => {
  const locations = new Set(jobs.map(job => {
    // Extract main location (before parentheses)
    const match = job.location.match(/^([^(]+)/);
    return match ? match[1].trim() : job.location;
  }));
  return Array.from(locations).sort();
};
