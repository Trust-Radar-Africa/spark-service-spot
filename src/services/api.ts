/**
 * Laravel API Service
 * 
 * Configure via environment variables:
 * - VITE_API_BACKEND: 'laravel' or 'json-server'
 * - VITE_LARAVEL_API_URL: Laravel API URL
 * - VITE_JSON_SERVER_URL: JSON Server URL
 * - VITE_DATA_MODE: 'demo' or 'live'
 */

import { useApiConfigStore } from '@/stores/apiConfigStore';

// Get API configuration from store
const getApiConfig = () => {
  const store = useApiConfigStore.getState();
  return {
    isLiveMode: store.isLiveMode(),
    isJsonServer: store.isJsonServer(),
    getApiUrl: store.getApiUrl,
    baseUrl: store.apiBaseUrl,
  };
};

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('admin_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('admin_token', token);
    } else {
      localStorage.removeItem('admin_token');
    }
  }

  getToken() {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const { baseUrl } = getApiConfig();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // For Sanctum cookie-based auth
    });

    if (response.status === 401) {
      this.setToken(null);
      window.location.href = '/admin/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  // Demo user credentials
  private demoUsers: Record<string, { id: number; name: string; email: string; role: 'super_admin' | 'editor' | 'viewer' }> = {
    'admin@demo.com': { id: 1, name: 'Demo Admin', email: 'admin@demo.com', role: 'super_admin' },
    'editor@demo.com': { id: 2, name: 'Test Editor', email: 'editor@demo.com', role: 'editor' },
    'viewer@demo.com': { id: 3, name: 'Test Viewer', email: 'viewer@demo.com', role: 'viewer' },
  };

  // Auth endpoints
  async login(email: string, password: string) {
    const { isLiveMode, baseUrl } = getApiConfig();
    
    // Demo mode check - use demo credentials without API call
    const demoUser = this.demoUsers[email];
    if (!isLiveMode && demoUser && password === 'demo123') {
      const demoToken = `demo-token-${demoUser.role}-` + Date.now();
      this.setToken(demoToken);
      return {
        user: demoUser,
        token: demoToken,
      };
    }

    // If in demo mode but credentials don't match demo users
    if (!isLiveMode) {
      throw new Error('Invalid credentials. Use demo@demo.com / demo123');
    }

    // Real API call (only in live mode)
    try {
      // First, get CSRF cookie for Sanctum
      await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
        credentials: 'include',
      });

      const response = await this.request<{ user: any; token: string }>('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      this.setToken(response.token);
      return response;
    } catch (error) {
      // If API fails and using demo credentials, allow demo login as fallback
      const fallbackUser = this.demoUsers[email];
      if (fallbackUser && password === 'demo123') {
        const demoToken = `demo-token-${fallbackUser.role}-` + Date.now();
        this.setToken(demoToken);
        return {
          user: fallbackUser,
          token: demoToken,
        };
      }
      throw error;
    }
  }

  async logout() {
    const token = this.token;
    this.setToken(null);
    
    // Skip API call for demo tokens
    if (token?.startsWith('demo-token-')) {
      return;
    }
    
    try {
      await this.request('/api/admin/logout', { method: 'POST' });
    } catch {
      // Ignore logout errors
    }
  }

  async getUser() {
    // Demo mode check
    const token = this.token;
    if (token?.startsWith('demo-token-')) {
      // Extract role from token to return correct user
      if (token.includes('-editor-')) {
        return { user: this.demoUsers['editor@demo.com'] };
      }
      if (token.includes('-viewer-')) {
        return { user: this.demoUsers['viewer@demo.com'] };
      }
      return { user: this.demoUsers['admin@demo.com'] };
    }
    
    return this.request<{ user: any }>('/api/admin/user');
  }

  // Candidate Applications endpoints
  async getCandidates(filters?: {
    experience?: string;
    nationality?: string;
    search?: string;
    page?: number;
  }) {
    const params = new URLSearchParams();
    if (filters?.experience) params.append('experience', filters.experience);
    if (filters?.nationality) params.append('nationality', filters.nationality);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());

    return this.request<{
      data: any[];
      meta: { current_page: number; last_page: number; total: number };
    }>(`/api/admin/candidates?${params.toString()}`);
  }

  async downloadCV(candidateId: number) {
    const { baseUrl } = getApiConfig();
    const response = await fetch(`${baseUrl}/api/admin/candidates/${candidateId}/cv`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Download failed');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cv-${candidateId}.docx`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  async downloadCoverLetter(candidateId: number) {
    const { baseUrl } = getApiConfig();
    const response = await fetch(`${baseUrl}/api/admin/candidates/${candidateId}/cover-letter`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Download failed');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${candidateId}.docx`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  async deleteCandidate(candidateId: number) {
    return this.request(`/api/admin/candidates/${candidateId}`, {
      method: 'DELETE',
    });
  }

  // Nationalities for filter dropdown
  async getNationalities() {
    return this.request<{ nationalities: string[] }>('/api/admin/nationalities');
  }

  // Job Postings endpoints
  async getJobPostings(filters?: {
    search?: string;
    status?: 'active' | 'inactive' | 'all';
    page?: number;
  }) {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());

    return this.request<{
      data: any[];
      meta: { current_page: number; last_page: number; total: number };
    }>(`/api/admin/jobs?${params.toString()}`);
  }

  async createJobPosting(data: any) {
    return this.request<{ job: any }>('/api/admin/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateJobPosting(id: number, data: any) {
    return this.request<{ job: any }>(`/api/admin/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteJobPosting(id: number) {
    return this.request(`/api/admin/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleJobStatus(id: number, isActive: boolean) {
    return this.request<{ job: any }>(`/api/admin/jobs/${id}/toggle-status`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: isActive }),
    });
  }

  // Employer Requests endpoints
  async getEmployerRequests(filters?: {
    country?: string;
    experience?: string;
    search?: string;
    page?: number;
  }) {
    const params = new URLSearchParams();
    if (filters?.country) params.append('country', filters.country);
    if (filters?.experience) params.append('experience', filters.experience);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());

    return this.request<{
      data: any[];
      meta: { current_page: number; last_page: number; total: number };
    }>(`/api/admin/employer-requests?${params.toString()}`);
  }

  async deleteEmployerRequest(id: number) {
    return this.request(`/api/admin/employer-requests/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiService();
