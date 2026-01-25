import { create } from 'zustand';
import { useApiConfigStore } from './apiConfigStore';

interface DashboardStats {
  total_candidates: number;
  candidates_this_week: number;
  candidates_in_range: number;
  total_jobs: number;
  active_jobs: number;
  jobs_in_range: number;
  total_employer_requests: number;
  employer_requests_this_week: number;
  employer_requests_in_range: number;
  total_blog_posts: number;
  published_blog_posts: number;
  blog_posts_in_range: number;
}

interface CandidatesByExperience {
  '0-3': number;
  '3-7': number;
  '7-10': number;
  '10+': number;
}

interface DateCount {
  date: string;
  count: number;
}

interface JobsByStatus {
  active: number;
  inactive: number;
}

interface DashboardCharts {
  candidates_by_experience: CandidatesByExperience;
  candidates_by_date: DateCount[];
  jobs_by_status: JobsByStatus;
  blog_by_category: Record<string, number>;
}

interface DashboardData {
  stats: DashboardStats;
  charts: DashboardCharts;
}

interface DashboardState {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: string | null;
  fetchDashboard: (dateRange?: { from: string; to: string }) => Promise<void>;
}

const defaultData: DashboardData = {
  stats: {
    total_candidates: 0,
    candidates_this_week: 0,
    candidates_in_range: 0,
    total_jobs: 0,
    active_jobs: 0,
    jobs_in_range: 0,
    total_employer_requests: 0,
    employer_requests_this_week: 0,
    employer_requests_in_range: 0,
    total_blog_posts: 0,
    published_blog_posts: 0,
    blog_posts_in_range: 0,
  },
  charts: {
    candidates_by_experience: { '0-3': 0, '3-7': 0, '7-10': 0, '10+': 0 },
    candidates_by_date: [],
    jobs_by_status: { active: 0, inactive: 0 },
    blog_by_category: {},
  },
};

export const useDashboardStore = create<DashboardState>((set) => ({
  data: null,
  isLoading: false,
  error: null,
  lastFetched: null,

  fetchDashboard: async (dateRange) => {
    const { getApiUrl } = useApiConfigStore.getState();

    set({ isLoading: true, error: null });

    try {
      const token = localStorage.getItem('admin_token');
      let url = getApiUrl('/api/admin/dashboard');
      
      // Add date range params if provided
      if (dateRange) {
        const params = new URLSearchParams();
        params.append('from', dateRange.from);
        params.append('to', dateRange.to);
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        // Handle both { dashboard: {...} } and direct data formats
        const dashboardData = result.dashboard || result.data || result;
        
        set({
          data: {
            stats: dashboardData.stats || defaultData.stats,
            charts: dashboardData.charts || defaultData.charts,
          },
          isLoading: false,
          lastFetched: new Date().toISOString(),
        });
        return;
      }
      set({ error: 'Failed to fetch dashboard data', isLoading: false });
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
      set({ error: 'Failed to connect to server', isLoading: false });
    }
  },
}));
