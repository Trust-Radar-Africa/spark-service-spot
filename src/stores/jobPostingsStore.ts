import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { JobPosting, JobPostingFormData, ExperienceLevel, WorkType } from '@/types/admin';
import { useApiConfigStore } from './apiConfigStore';

interface JobPostingsState {
  jobs: JobPosting[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchJobs: () => Promise<void>;
  addJob: (data: JobPostingFormData) => Promise<JobPosting | null>;
  updateJob: (id: number, data: JobPostingFormData) => Promise<void>;
  deleteJob: (id: number) => Promise<void>;
  toggleJobStatus: (id: number) => Promise<void>;
  archiveJob: (id: number) => Promise<void>;

  // Getters
  getActiveJobs: () => JobPosting[];
  getJobById: (id: number) => JobPosting | undefined;
}

// Normalize job data from API (handles object fields like country, location)
const normalizeJob = (job: any): JobPosting => ({
  ...job,
  // Handle country as object {id, name, slug} or string
  country: typeof job.country === 'object' && job.country !== null
    ? job.country.name || ''
    : job.country || '',
  // Handle location as object {id, name} or string
  location: typeof job.location === 'object' && job.location !== null
    ? job.location.name || ''
    : job.location || '',
});

export const useJobPostingsStore = create<JobPostingsState>()(
  persist(
    (set, get) => ({
      jobs: [],
      isLoading: false,
      error: null,
      
      fetchJobs: async () => {
        const { getApiUrl } = useApiConfigStore.getState();
        
        set({ isLoading: true, error: null });
        
        try {
          const token = localStorage.getItem('admin_token');
          const response = await fetch(getApiUrl('/api/admin/jobs'), {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          });
          if (response.ok) {
            const data = await response.json();
            const rawJobs = data.data || data;
            // Normalize jobs to handle object fields
            const normalizedJobs = Array.isArray(rawJobs)
              ? rawJobs.map(normalizeJob)
              : [];
            set({ jobs: normalizedJobs, isLoading: false });
            return;
          }
          set({ error: 'Failed to fetch jobs', isLoading: false });
        } catch (error) {
          console.error('Failed to fetch jobs:', error);
          set({ error: 'Failed to connect to server', isLoading: false });
        }
      },
      
      addJob: async (data: JobPostingFormData) => {
        const { getApiUrl } = useApiConfigStore.getState();

        try {
          const token = localStorage.getItem('admin_token');
          const response = await fetch(getApiUrl('/api/admin/jobs'), {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
          if (response.ok) {
            const result = await response.json();
            const rawJob = result.data || result.job || result;
            const newJob = normalizeJob(rawJob);
            set(state => ({ jobs: [newJob, ...state.jobs] }));
            return newJob;
          }
        } catch (error) {
          console.error('Failed to create job via API:', error);
        }
        return null;
      },
      
      updateJob: async (id: number, data: JobPostingFormData) => {
        const { getApiUrl } = useApiConfigStore.getState();

        // Optimistically update UI
        set(state => ({
          jobs: state.jobs.map(job =>
            job.id === id
              ? { ...job, ...data, updated_at: new Date().toISOString() }
              : job
          ),
        }));

        try {
          const token = localStorage.getItem('admin_token');
          await fetch(getApiUrl(`/api/admin/jobs/${id}`), {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
        } catch (error) {
          console.error('Failed to update job via API:', error);
        }
      },

      deleteJob: async (id: number) => {
        const { getApiUrl } = useApiConfigStore.getState();

        // Optimistically update UI
        set(state => ({
          jobs: state.jobs.filter(job => job.id !== id),
        }));

        try {
          const token = localStorage.getItem('admin_token');
          await fetch(getApiUrl(`/api/admin/jobs/${id}`), {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          });
        } catch (error) {
          console.error('Failed to delete job via API:', error);
        }
      },

      toggleJobStatus: async (id: number) => {
        const { getApiUrl } = useApiConfigStore.getState();
        const job = get().jobs.find(j => j.id === id);
        const newStatus = job ? !job.is_active : false;

        // Optimistically update UI
        set(state => ({
          jobs: state.jobs.map(job =>
            job.id === id
              ? { ...job, is_active: newStatus, updated_at: new Date().toISOString() }
              : job
          ),
        }));

        try {
          const token = localStorage.getItem('admin_token');
          await fetch(getApiUrl(`/api/admin/jobs/${id}/toggle-status`), {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ is_active: newStatus }),
          });
        } catch (error) {
          console.error('Failed to toggle job status via API:', error);
        }
      },
      
      archiveJob: async (id: number) => {
        const { getApiUrl } = useApiConfigStore.getState();

        // Optimistically update UI
        set(state => ({
          jobs: state.jobs.map(job =>
            job.id === id
              ? { ...job, is_active: false, updated_at: new Date().toISOString() }
              : job
          ),
        }));

        try {
          const token = localStorage.getItem('admin_token');
          await fetch(getApiUrl(`/api/admin/jobs/${id}/toggle-status`), {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ is_active: false }),
          });
        } catch (error) {
          console.error('Failed to archive job via API:', error);
        }
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

// Work type labels
export const WORK_TYPE_LABELS: Record<WorkType, string> = {
  'remote': 'Remote',
  'hybrid': 'Hybrid',
  'on-site': 'On-site',
  'flexible': 'Flexible',
};

// Work type options for dropdown
export const WORK_TYPE_OPTIONS = Object.entries(WORK_TYPE_LABELS).map(([value, label]) => ({
  value: value as WorkType,
  label,
}));

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
  const locations = new Set(jobs.map(job => job.location));
  return Array.from(locations).sort();
};

// Countries for filtering
export const getUniqueCountries = (jobs: JobPosting[]): string[] => {
  const countries = new Set(jobs.map(job => job.country));
  return Array.from(countries).sort();
};
