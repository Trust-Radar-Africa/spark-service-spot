/**
 * Public API Service
 * 
 * Fetches data from the Laravel API for public-facing pages (Careers, Blog)
 * Falls back to local data when API is unavailable or in demo mode
 */

import { useApiConfigStore } from '@/stores/apiConfigStore';
import { JobPosting } from '@/types/admin';
import { BlogPost, authors } from '@/data/blogData';

// Get API configuration
const getApiConfig = () => {
  const { apiBaseUrl, isLiveMode } = useApiConfigStore.getState();
  return { apiBaseUrl, isLiveMode: isLiveMode() };
};

// ============================================
// PUBLIC JOBS API
// ============================================

export interface PublicJob {
  id: number;
  title: string;
  description: string;
  country: string;
  location: string;
  work_type: 'remote' | 'hybrid' | 'on-site' | 'flexible';
  experience_required: '0-3' | '3-7' | '7-10' | '10+';
  requirements?: string;
  benefits?: string;
  salary_range?: string;
  currency?: string;
  created_at: string;
}

export interface PublicJobsResponse {
  data: PublicJob[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters?: {
    countries: string[];
    locations: string[];
    work_types: string[];
  };
}

export interface JobFilters {
  search?: string;
  country?: string;
  location?: string;
  work_type?: string;
  experience?: string;
  page?: number;
  per_page?: number;
}

export async function fetchPublicJobs(filters?: JobFilters): Promise<PublicJobsResponse> {
  const { apiBaseUrl, isLiveMode } = getApiConfig();
  
  if (!isLiveMode) {
    throw new Error('Not in live mode');
  }

  const params = new URLSearchParams();
  if (filters?.search) params.append('search', filters.search);
  if (filters?.country) params.append('country', filters.country);
  if (filters?.location) params.append('location', filters.location);
  if (filters?.work_type) params.append('work_type', filters.work_type);
  if (filters?.experience) params.append('experience', filters.experience);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.per_page) params.append('per_page', filters.per_page.toString());

  const response = await fetch(`${apiBaseUrl}/api/jobs?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }

  return response.json();
}

export async function fetchPublicJob(id: number): Promise<{ job: PublicJob }> {
  const { apiBaseUrl, isLiveMode } = getApiConfig();
  
  if (!isLiveMode) {
    throw new Error('Not in live mode');
  }

  const response = await fetch(`${apiBaseUrl}/api/jobs/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch job');
  }

  return response.json();
}

// Convert API job to store format
export function convertApiJobToStore(job: PublicJob): JobPosting {
  return {
    id: job.id,
    title: job.title,
    description: job.description,
    country: job.country,
    location: job.location,
    work_type: job.work_type,
    experience_required: job.experience_required,
    requirements: job.requirements || '',
    benefits: job.benefits || '',
    salary_range: job.salary_range || '',
    currency_override: job.currency,
    is_active: true,
    created_at: job.created_at,
    updated_at: job.created_at,
  };
}

// ============================================
// PUBLIC BLOG API
// ============================================

export interface PublicBlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  image_url: string;
  published_at: string;
  reading_time?: number;
  table_of_contents?: Array<{ id: string; title: string; level: number }>;
}

export interface PublicBlogResponse {
  data: PublicBlogPost[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters?: {
    categories: Array<{ name: string; slug: string; count: number }>;
    authors: Array<{ name: string; count: number }>;
  };
}

export interface BlogFilters {
  search?: string;
  category?: string;
  author?: string;
  page?: number;
  per_page?: number;
}

export async function fetchPublicBlogPosts(filters?: BlogFilters): Promise<PublicBlogResponse> {
  const { apiBaseUrl, isLiveMode } = getApiConfig();
  
  if (!isLiveMode) {
    throw new Error('Not in live mode');
  }

  const params = new URLSearchParams();
  if (filters?.search) params.append('search', filters.search);
  if (filters?.category && filters.category !== 'All') params.append('category', filters.category);
  if (filters?.author) params.append('author', filters.author);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.per_page) params.append('per_page', filters.per_page.toString());

  const response = await fetch(`${apiBaseUrl}/api/blog?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch blog posts');
  }

  return response.json();
}

export async function fetchPublicBlogPost(slug: string): Promise<{ post: PublicBlogPost; related_posts: PublicBlogPost[] }> {
  const { apiBaseUrl, isLiveMode } = getApiConfig();
  
  if (!isLiveMode) {
    throw new Error('Not in live mode');
  }

  const response = await fetch(`${apiBaseUrl}/api/blog/${slug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch blog post');
  }

  return response.json();
}

export async function fetchFeaturedBlogPosts(limit: number = 3): Promise<{ posts: PublicBlogPost[] }> {
  const { apiBaseUrl, isLiveMode } = getApiConfig();
  
  if (!isLiveMode) {
    throw new Error('Not in live mode');
  }

  const response = await fetch(`${apiBaseUrl}/api/blog/featured?limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch featured posts');
  }

  return response.json();
}

export async function fetchBlogCategories(): Promise<{ 
  categories: Array<{ id: number; name: string; slug: string; description?: string; count: number }>;
  total_posts: number;
}> {
  const { apiBaseUrl, isLiveMode } = getApiConfig();
  
  if (!isLiveMode) {
    throw new Error('Not in live mode');
  }

  const response = await fetch(`${apiBaseUrl}/api/blog/categories`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  return response.json();
}

// Convert API blog post to frontend format
export function convertApiBlogToFrontend(post: PublicBlogPost): BlogPost {
  const authorData = authors[post.author] || {
    name: post.author,
    role: 'Contributor',
    bio: '',
    avatar: '/placeholder.svg',
  };

  const readTime = post.reading_time 
    ? `${post.reading_time} min read`
    : `${Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200))} min read`;

  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return {
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    image: post.image_url || '/placeholder.svg',
    author: authorData,
    date,
    readTime,
    category: post.category,
    slug: post.slug,
  };
}

// ============================================
// PUBLIC CONTACT API
// ============================================

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
}

export async function submitContactForm(data: ContactFormData): Promise<{ message: string }> {
  const { apiBaseUrl, isLiveMode } = getApiConfig();
  
  if (!isLiveMode) {
    throw new Error('Not in live mode');
  }

  const response = await fetch(`${apiBaseUrl}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to submit contact form');
  }

  return response.json();
}

// ============================================
// PUBLIC CANDIDATE APPLICATION API
// ============================================

export interface CandidateApplicationData {
  first_name: string;
  last_name: string;
  email: string;
  nationality: string;
  country: string;
  expected_salary: string;
  experience: string;
  cv: File;
  cover_letter: File;
  job_title?: string;
  job_id?: number;
}

export async function submitCandidateApplication(data: CandidateApplicationData): Promise<{ message: string }> {
  const { apiBaseUrl, isLiveMode } = getApiConfig();
  
  if (!isLiveMode) {
    throw new Error('Not in live mode');
  }

  const formData = new FormData();
  formData.append('first_name', data.first_name);
  formData.append('last_name', data.last_name);
  formData.append('email', data.email);
  formData.append('nationality', data.nationality);
  formData.append('country', data.country);
  formData.append('expected_salary', data.expected_salary);
  formData.append('experience', data.experience);
  formData.append('cv', data.cv);
  formData.append('cover_letter', data.cover_letter);
  if (data.job_title) {
    formData.append('job_title', data.job_title);
  }
  if (data.job_id) {
    formData.append('job_id', data.job_id.toString());
  }

  const response = await fetch(`${apiBaseUrl}/api/candidates/apply`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to submit application');
  }

  return response.json();
}

// ============================================
// PUBLIC EMPLOYER REQUEST API
// ============================================

export interface EmployerRequestData {
  firm_name: string;
  email: string;
  country: string;
  position_title?: string;
  preferred_location: string;
  preferred_nationality: string;
  budgeted_salary: string;
  years_experience: string;
  other_qualifications?: string;
}

export async function submitEmployerRequest(data: EmployerRequestData): Promise<{ message: string }> {
  const { apiBaseUrl, isLiveMode } = getApiConfig();
  
  if (!isLiveMode) {
    throw new Error('Not in live mode');
  }

  const response = await fetch(`${apiBaseUrl}/api/employer-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to submit employer request');
  }

  return response.json();
}
