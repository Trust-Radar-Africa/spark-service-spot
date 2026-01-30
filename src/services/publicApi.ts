/**
 * Public API Service
 * 
 * Fetches data from the API for public-facing pages (Careers, Blog)
 * Supports both Laravel API and JSON Server backends
 * Falls back to local data when API is unavailable or in demo mode
 */

import { useApiConfigStore } from '@/stores/apiConfigStore';
import { JobPosting } from '@/types/admin';
import { BlogPost, authors } from '@/data/blogData';

// Get API configuration
const getApiConfig = () => {
  const store = useApiConfigStore.getState();
  return { 
    isLiveMode: store.isLiveMode(),
    isJsonServer: store.isJsonServer(),
    getApiUrl: store.getApiUrl,
  };
};

// Build query params for JSON Server vs Laravel
const buildQueryParams = (filters: Record<string, string | number | undefined>, isJsonServer: boolean): URLSearchParams => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === '') return;
    
    if (isJsonServer) {
      // JSON Server uses different param names
      switch (key) {
        case 'search':
          params.append('q', String(value)); // Full-text search
          break;
        case 'page':
          params.append('_page', String(value));
          break;
        case 'per_page':
          params.append('_limit', String(value));
          break;
        default:
          params.append(key, String(value));
      }
    } else {
      // Laravel uses standard param names
      params.append(key, String(value));
    }
  });
  
  return params;
};

// Transform JSON Server response to match Laravel API format
const transformJsonServerResponse = <T>(
  data: T[], 
  page: number = 1, 
  perPage: number = 10,
  totalHeader?: string | null
): { data: T[]; meta: { current_page: number; last_page: number; per_page: number; total: number } } => {
  const total = totalHeader ? parseInt(totalHeader, 10) : data.length;
  return {
    data,
    meta: {
      current_page: page,
      last_page: Math.ceil(total / perPage),
      per_page: perPage,
      total,
    },
  };
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
  is_active?: boolean;
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
  const { isLiveMode, isJsonServer, getApiUrl } = getApiConfig();
  
  if (!isLiveMode) {
    throw new Error('Not in live mode');
  }

  const queryFilters: Record<string, string | number | undefined> = {
    search: filters?.search,
    country: filters?.country,
    location: filters?.location,
    work_type: filters?.work_type,
    experience: isJsonServer ? undefined : filters?.experience, // JSON Server uses experience_required
    experience_required: isJsonServer ? filters?.experience : undefined,
    page: filters?.page,
    per_page: filters?.per_page,
  };

  // For JSON Server, filter only active jobs
  if (isJsonServer) {
    (queryFilters as Record<string, unknown>).is_active = true;
  }

  const params = buildQueryParams(queryFilters, isJsonServer);
  const url = `${getApiUrl('jobs')}?${params.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }

  if (isJsonServer) {
    const data = await response.json();
    const total = response.headers.get('X-Total-Count');
    return transformJsonServerResponse(data, filters?.page || 1, filters?.per_page || 10, total);
  }

  return response.json();
}

export async function fetchPublicJob(id: number): Promise<{ job: PublicJob }> {
  const { isLiveMode, isJsonServer, getApiUrl } = getApiConfig();
  
  if (!isLiveMode) {
    throw new Error('Not in live mode');
  }

  const url = getApiUrl(`jobs/${id}`);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch job');
  }

  if (isJsonServer) {
    const job = await response.json();
    return { job };
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
  const { isLiveMode, isJsonServer, getApiUrl } = getApiConfig();
  
  if (!isLiveMode) {
    throw new Error('Not in live mode');
  }

  const queryFilters: Record<string, string | number | undefined> = {
    search: filters?.search,
    category: filters?.category !== 'All' ? filters?.category : undefined,
    author: filters?.author,
    page: filters?.page,
    per_page: filters?.per_page,
  };

  // For JSON Server, filter only published posts
  if (isJsonServer) {
    (queryFilters as Record<string, unknown>).is_published = true;
  }

  const params = buildQueryParams(queryFilters, isJsonServer);
  const url = `${getApiUrl('blog')}?${params.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch blog posts');
  }

  if (isJsonServer) {
    const data = await response.json();
    const total = response.headers.get('X-Total-Count');
    return transformJsonServerResponse(data, filters?.page || 1, filters?.per_page || 10, total);
  }

  return response.json();
}

export async function fetchPublicBlogPost(slug: string): Promise<{ post: PublicBlogPost; related_posts: PublicBlogPost[] }> {
  const { isLiveMode, isJsonServer, getApiUrl } = getApiConfig();
  
  if (!isLiveMode) {
    throw new Error('Not in live mode');
  }

  // JSON Server requires querying by slug
  const url = isJsonServer 
    ? `${getApiUrl('blog')}?slug=${slug}` 
    : getApiUrl(`blog/${slug}`);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch blog post');
  }

  if (isJsonServer) {
    const data = await response.json();
    const post = Array.isArray(data) ? data[0] : data;
    if (!post) throw new Error('Blog post not found');
    return { post, related_posts: [] };
  }

  // Laravel API response handling
  const data = await response.json();

  // Handle different response structures:
  // 1. { post: {...}, related_posts: [...] } - expected format
  // 2. { data: { post: {...}, related_posts: [...] } } - Laravel resource wrapper
  // 3. { data: {...} } - Laravel resource with post directly in data
  if (data.post) {
    return { post: data.post, related_posts: data.related_posts || [] };
  }
  if (data.data?.post) {
    return { post: data.data.post, related_posts: data.data.related_posts || [] };
  }
  if (data.data) {
    // Post is directly in data (common Laravel resource pattern)
    return { post: data.data, related_posts: data.related_posts || [] };
  }

  throw new Error('Unexpected API response format');
}

export async function fetchFeaturedBlogPosts(limit: number = 3): Promise<{ posts: PublicBlogPost[] }> {
  const { isLiveMode, isJsonServer, getApiUrl } = getApiConfig();
  
  if (!isLiveMode) {
    throw new Error('Not in live mode');
  }

  // JSON Server uses _limit for pagination
  const url = isJsonServer 
    ? `${getApiUrl('blog')}?is_published=true&_limit=${limit}&_sort=published_at&_order=desc`
    : `${getApiUrl('blog/featured')}?limit=${limit}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch featured posts');
  }

  if (isJsonServer) {
    const posts = await response.json();
    return { posts };
  }

  return response.json();
}

export async function fetchBlogCategories(): Promise<{ 
  categories: Array<{ id: number; name: string; slug: string; description?: string; count: number }>;
  total_posts: number;
}> {
  const { isLiveMode, isJsonServer, getApiUrl } = getApiConfig();
  
  if (!isLiveMode) {
    throw new Error('Not in live mode');
  }

  const url = isJsonServer 
    ? getApiUrl('blog-categories')
    : getApiUrl('blog/categories');

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  if (isJsonServer) {
    const categories = await response.json();
    return { 
      categories: categories.map((c: { id: number; name: string; slug: string; description?: string }) => ({ ...c, count: 0 })),
      total_posts: 0 
    };
  }

  return response.json();
}

// Helper to extract string value from category (can be string or object)
function getCategoryName(category: string | { name: string } | null | undefined): string {
  if (!category) return 'Uncategorized';
  if (typeof category === 'string') return category;
  if (typeof category === 'object' && 'name' in category) return category.name;
  return 'Uncategorized';
}

// Helper to extract author name (can be string or object)
function getAuthorName(author: string | { name: string } | null | undefined): string {
  if (!author) return 'Unknown';
  if (typeof author === 'string') return author;
  if (typeof author === 'object' && 'name' in author) return author.name;
  return 'Unknown';
}

// Convert API blog post to frontend format
export function convertApiBlogToFrontend(post: PublicBlogPost): BlogPost {
  if (!post) {
    throw new Error('Cannot convert undefined blog post');
  }

  const authorName = getAuthorName(post.author);
  const authorData = authors[authorName] || {
    name: authorName,
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
    category: getCategoryName(post.category),
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
  const { isLiveMode, isJsonServer, getApiUrl } = getApiConfig();
  
  if (!isLiveMode) {
    throw new Error('Not in live mode');
  }

  const url = getApiUrl('contact-messages');
  
  // For JSON Server, add required fields
  const payload = isJsonServer 
    ? { 
        ...data, 
        is_read: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    : data;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to submit contact form');
  }

  if (isJsonServer) {
    return { message: 'Contact form submitted successfully!' };
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
  const { isLiveMode, isJsonServer, getApiUrl } = getApiConfig();
  
  if (!isLiveMode) {
    throw new Error('Not in live mode');
  }

  // JSON Server doesn't handle file uploads, so we use JSON for it
  if (isJsonServer) {
    const url = getApiUrl('candidates');
    const payload = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      nationality: data.nationality,
      country: data.country,
      location: data.country, // Use country as location for simplicity
      expected_salary: data.expected_salary,
      experience: data.experience,
      job_applied: data.job_title || null,
      job_id: data.job_id || null,
      cv_url: `/storage/cvs/cv-${Date.now()}.docx`,
      cover_letter_url: `/storage/cover-letters/cl-${Date.now()}.docx`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to submit application');
    }

    return { message: 'Application submitted successfully!' };
  }

  // Laravel API uses FormData for file uploads
  const url = getApiUrl('candidates/apply');
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

  const response = await fetch(url, {
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
  const { isLiveMode, isJsonServer, getApiUrl } = getApiConfig();
  
  if (!isLiveMode) {
    throw new Error('Not in live mode');
  }

  const url = getApiUrl('employer-requests');
  
  // For JSON Server, add required fields and map field names
  const payload = isJsonServer 
    ? { 
        ...data, 
        notes: data.other_qualifications || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    : data;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to submit employer request');
  }

  if (isJsonServer) {
    return { message: 'Employer request submitted successfully!' };
  }

  return response.json();
}
