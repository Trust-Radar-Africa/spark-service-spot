// Candidate Application Types
export interface CandidateApplication {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  nationality: string;
  country: string;
  location: string;
  experience: ExperienceLevel;
  job_applied?: string; // Job title/role they applied for
  job_id?: number; // Reference to job posting
  cv_url: string;
  cover_letter_url: string;
  created_at: string;
  updated_at: string;
}

export type ExperienceLevel = '0-3' | '3-7' | '7-10' | '10+';

export interface CandidateFilters {
  experience?: ExperienceLevel;
  nationality?: string;
  country?: string;
  location?: string;
  job_applied?: string;
  search?: string;
}

// Work Type Options
export type WorkType = 'remote' | 'hybrid' | 'on-site' | 'flexible';

// Job Posting Types
export interface JobPosting {
  id: number;
  title: string;
  description: string;
  country: string;
  location: string;
  work_type: WorkType;
  experience_required: ExperienceLevel;
  requirements?: string;
  benefits?: string;
  salary_range?: string;
  currency_override?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobPostingFormData {
  title: string;
  description: string;
  country: string;
  location: string;
  work_type: WorkType;
  experience_required: ExperienceLevel;
  requirements?: string;
  benefits?: string;
  salary_range?: string;
  currency_override?: string;
  is_active: boolean;
}
// Employer Request Types
export interface EmployerRequest {
  id: number;
  firm_name: string;
  email: string;
  country: string;
  location: string;
  position_title?: string;
  preferred_nationality: string;
  years_experience: ExperienceLevel;
  other_qualifications?: string;
  created_at: string;
  updated_at: string;
}

// Auth Types
export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role?: 'super_admin' | 'editor' | 'viewer';
}

export interface AuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Audit Log Types
export interface AuditLog {
  id: string;
  timestamp: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_role: string;
  action: 'create' | 'update' | 'delete' | 'archive' | 'deactivate' | 'activate' | 'publish' | 'unpublish';
  module: 'candidates' | 'jobs' | 'employer_requests' | 'blog';
  resource_id: number | string;
  resource_name: string;
  changes?: {
    field: string;
    old_value: any;
    new_value: any;
  }[];
  metadata?: Record<string, any>;
}
