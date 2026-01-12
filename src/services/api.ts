/**
 * Laravel API Service
 * 
 * Configure VITE_LARAVEL_API_URL in your .env file
 * Example: VITE_LARAVEL_API_URL=https://your-laravel-api.com
 */

const API_BASE_URL = import.meta.env.VITE_LARAVEL_API_URL || 'http://localhost:8000';

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
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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

  // Auth endpoints
  async login(email: string, password: string) {
    // First, get CSRF cookie for Sanctum
    await fetch(`${API_BASE_URL}/sanctum/csrf-cookie`, {
      credentials: 'include',
    });

    const response = await this.request<{ user: any; token: string }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.setToken(response.token);
    return response;
  }

  async logout() {
    await this.request('/api/admin/logout', { method: 'POST' });
    this.setToken(null);
  }

  async getUser() {
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
    const response = await fetch(`${API_BASE_URL}/api/admin/candidates/${candidateId}/cv`, {
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
    const response = await fetch(`${API_BASE_URL}/api/admin/candidates/${candidateId}/cover-letter`, {
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
}

export const api = new ApiService();
