// Candidate Application Types
export interface CandidateApplication {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  nationality: string;
  experience: ExperienceLevel;
  cv_url: string;
  cover_letter_url: string;
  created_at: string;
  updated_at: string;
}

export type ExperienceLevel = '0-3' | '3-7' | '7-10' | '10+';

export interface CandidateFilters {
  experience?: ExperienceLevel;
  nationality?: string;
  search?: string;
}

// Job Posting Types
export interface JobPosting {
  id: number;
  title: string;
  description: string;
  location: string;
  experience_required: ExperienceLevel;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Employer Request Types
export interface EmployerRequest {
  id: number;
  firm_name: string;
  email: string;
  country: string;
  position_title?: string;
  preferred_location: string;
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
}

export interface AuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
