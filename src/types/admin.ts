// Expected salary ranges for filter dropdown options
export const CANDIDATE_SALARY_FILTER_OPTIONS: Record<string, string> = {
  '500-1000': 'USD 500 - 1,000 PM',
  '1001-1500': 'USD 1,001 - 1,500 PM',
  '1501-2000': 'USD 1,501 - 2,000 PM',
  '2001-2500': 'USD 2,001 - 2,500 PM',
  '2501-3000': 'USD 2,501 - 3,000 PM',
  '3001-3500': 'USD 3,001 - 3,500 PM',
  '3501-4000': 'USD 3,501 - 4,000 PM',
  'above-4001': 'Above USD 4,001 PM',
};

// All salary labels including legacy backend formats (for display)
export const CANDIDATE_SALARY_LABELS: Record<string, string> = {
  ...CANDIDATE_SALARY_FILTER_OPTIONS,
  // Legacy backend formats (for display compatibility)
  '2001-3000': 'USD 2,001 - 3,000 PM',
  '3001-4000': 'USD 3,001 - 4,000 PM',
  '4001+': 'Above USD 4,001 PM',
};

// Map backend salary values to frontend filter values
// Backend may use different formats (e.g., "4001+" vs "above-4001")
const SALARY_NORMALIZATION_MAP: Record<string, string> = {
  '4001+': 'above-4001',
  'above-4001': 'above-4001',
  '2001-3000': '2501-3000', // Map wider range to the higher bracket
  '3001-4000': '3501-4000', // Map wider range to the higher bracket
};

// Normalize backend salary value to match frontend filter options
export function normalizeSalaryValue(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return SALARY_NORMALIZATION_MAP[value] || value;
}

// Candidate Application Types
export interface CandidateApplication {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  nationality: string;
  country: string;
  location?: string; // Optional - legacy field
  expected_salary?: string; // New field matching form
  experience: ExperienceLevel;
  job_applied?: string; // Job title/role they applied for
  job_id?: number; // Reference to job posting
  cv_url?: string;
  cover_letter_url?: string;
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
  expected_salary?: string;
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
  preferred_location: string;
  position_title?: string;
  preferred_nationality: string;
  budgeted_salary: string;
  years_experience: ExperienceLevel;
  other_qualifications?: string;
  created_at: string;
  updated_at: string;
}

// Salary range labels for display
export const SALARY_RANGE_LABELS: Record<string, string> = {
  '500-1000': 'USD 500 - 1,000 PM',
  '1001-1500': 'USD 1,001 - 1,500 PM',
  '1501-2000': 'USD 1,501 - 2,000 PM',
  '2001-2500': 'USD 2,001 - 2,500 PM',
  '2501-3000': 'USD 2,501 - 3,000 PM',
  '3001-3500': 'USD 3,001 - 3,500 PM',
  '3501-4000': 'USD 3,501 - 4,000 PM',
  'above-4001': 'USD 4,001+ PM',
};

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
