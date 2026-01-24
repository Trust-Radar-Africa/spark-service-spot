# Laravel API Specification

This document outlines the API endpoints required for the admin panel to function properly.

## Configuration

### Environment Variables

The frontend uses environment variables to configure the data source and API connection:

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_LARAVEL_API_URL` | Yes (for live mode) | Your Laravel API base URL |
| `VITE_DATA_MODE` | No | Force `demo` or `live` mode (overrides auto-detection) |

### Data Source Modes

The application supports two data modes:

1. **Demo Mode** (default): Uses local mock data from Zustand stores. No backend required.
2. **Live Mode**: Connects to your Laravel backend API for real data.

### Mode Detection Logic

```
1. If VITE_DATA_MODE is set to 'demo' or 'live' → use that mode
2. Else if VITE_LARAVEL_API_URL is set → use 'live' mode
3. Else → use 'demo' mode
```

### Example Configurations

```bash
# Demo mode (default - no env vars needed)
# Application uses local mock data

# Live mode (auto-detected)
VITE_LARAVEL_API_URL=https://api.yoursite.com

# Force demo mode even with API URL configured (useful for testing)
VITE_LARAVEL_API_URL=https://api.yoursite.com
VITE_DATA_MODE=demo

# Force live mode explicitly
VITE_LARAVEL_API_URL=https://api.yoursite.com
VITE_DATA_MODE=live
```

### Laravel .env Configuration

```bash
# Required for Sanctum SPA authentication
SANCTUM_STATEFUL_DOMAINS=localhost:5173,your-frontend.com
SESSION_DOMAIN=.yourdomain.com

# CORS origins
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend.com
```


## Authentication (Laravel Sanctum)

### CORS Configuration
In your Laravel `config/cors.php`:
```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_origins' => ['http://localhost:5173', 'https://your-frontend.com'],
    'supports_credentials' => true,
];
```

### Endpoints

#### GET /sanctum/csrf-cookie
Returns CSRF token cookie for Sanctum authentication.

#### POST /api/admin/login
**Request:**
```json
{
  "email": "admin@example.com",
  "password": "password"
}
```
**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "super_admin"
  },
  "token": "Bearer token string"
}
```

#### POST /api/admin/logout
Invalidates the current token. Requires authentication.

#### GET /api/admin/user
Returns the authenticated user. Requires authentication.
**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "super_admin"
  }
}
```

---

## Role-Based Access Control

The admin panel implements granular role-based permissions. All endpoints should validate user roles before performing operations.

### Role Definitions

| Role | Label | Description |
|------|-------|-------------|
| super_admin | Admin | Full access to all features and settings |
| editor | Editor | Can manage blog posts and job postings, view other modules |
| viewer | Viewer | Read-only access to all data, no downloads |

### Granular Permissions Matrix

| Permission | Super Admin | Editor | Viewer |
|------------|-------------|--------|--------|
| candidates:view | ✓ | ✓ | ✓ |
| candidates:create | ✓ | ✗ | ✗ |
| candidates:update | ✓ | ✗ | ✗ |
| candidates:delete | ✓ | ✗ | ✗ |
| candidates:download | ✓ | ✓ | ✗ |
| jobs:view | ✓ | ✓ | ✓ |
| jobs:create | ✓ | ✓ | ✗ |
| jobs:update | ✓ | ✓ | ✗ |
| jobs:delete | ✓ | ✗ | ✗ |
| jobs:archive | ✓ | ✓ | ✗ |
| jobs:toggle_status | ✓ | ✓ | ✗ |
| employer_requests:view | ✓ | ✓ | ✓ |
| employer_requests:delete | ✓ | ✗ | ✗ |
| blog:view | ✓ | ✓ | ✓ |
| blog:create | ✓ | ✓ | ✗ |
| blog:update | ✓ | ✓ | ✗ |
| blog:delete | ✓ | ✓ | ✗ |
| settings:view | ✓ | ✓ | ✓ |
| settings:update | ✓ | ✗ | ✗ |
| users:view | ✓ | ✗ | ✗ |
| users:create | ✓ | ✗ | ✗ |
| users:update | ✓ | ✗ | ✗ |
| users:delete | ✓ | ✗ | ✗ |
| audit_logs:view | ✓ | ✗ | ✗ |
| dashboard:charts | ✓ | ✓ | ✗ |

### Demo Users (Mock Mode)

For development/demo, the following test accounts are pre-configured:

| Email | Password | Role |
|-------|----------|------|
| admin@demo.com | demo123 | Super Admin |
| editor@demo.com | demo123 | Editor |
| viewer@demo.com | demo123 | Viewer |

---

## Dashboard

### GET /api/admin/dashboard
Get dashboard statistics and overview data. Requires authentication.

**Query Parameters:**
- `date_from` (optional): Start date for filtering (YYYY-MM-DD)
- `date_to` (optional): End date for filtering (YYYY-MM-DD)
- `preset` (optional): Date preset (7d, 30d, 90d, ytd)

**Response:**
```json
{
  "stats": {
    "total_candidates": 156,
    "candidates_this_week": 12,
    "candidates_in_range": 45,
    "total_jobs": 25,
    "active_jobs": 18,
    "jobs_in_range": 8,
    "total_employer_requests": 42,
    "employer_requests_this_week": 5,
    "employer_requests_in_range": 12,
    "total_blog_posts": 15,
    "published_blog_posts": 12,
    "blog_posts_in_range": 4
  },
  "recent_candidates": [
    {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "nationality": "British",
      "country": "United Kingdom",
      "location": "London",
      "experience": "3-7",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "recent_employer_requests": [
    {
      "id": 1,
      "firm_name": "ABC Accounting",
      "email": "hr@abc.com",
      "country": "United Arab Emirates",
      "location": "Dubai",
      "position_title": "Senior Accountant",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "charts": {
    "candidates_by_experience": {
      "0-3": 45,
      "3-7": 62,
      "7-10": 32,
      "10+": 17
    },
    "candidates_by_date": [
      { "date": "2024-01-01", "count": 5 },
      { "date": "2024-01-02", "count": 8 },
      { "date": "2024-01-03", "count": 3 }
    ],
    "jobs_by_status": {
      "active": 18,
      "inactive": 7
    },
    "blog_by_category": {
      "Industry Insights": 5,
      "Best Practices": 4,
      "Technical": 3,
      "Tax Advisory": 3
    }
  }
}
```

**Note:** Chart data should only be included if the user has `dashboard:charts` permission (super_admin, editor).

---

## Candidate Applications

### GET /api/admin/candidates
List all candidate applications with filtering and pagination.

**Query Parameters:**
- `experience` (optional): Filter by experience level (0-3, 3-7, 7-10, 10+)
- `nationality` (optional): Filter by nationality
- `country` (optional): Filter by country
- `location` (optional): Filter by location
- `job_applied` (optional): Filter by job applied for
- `search` (optional): Search by name or email
- `page` (optional): Page number for pagination
- `per_page` (optional): Items per page (default from settings)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "nationality": "British",
      "country": "United Kingdom",
      "location": "London",
      "experience": "3-7",
      "job_applied": "Senior Accountant",
      "job_id": 5,
      "cv_url": "/storage/cvs/cv-1.docx",
      "cover_letter_url": "/storage/cover-letters/cl-1.docx",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 48
  }
}
```

### GET /api/admin/candidates/{id}/cv
Download candidate's CV file. Returns the Word document as a binary stream.

**Authorization:** Requires `candidates:download` permission. Viewers (role=viewer) should receive 403 Forbidden.

### GET /api/admin/candidates/{id}/cover-letter
Download candidate's cover letter. Returns the Word document as a binary stream.

**Authorization:** Requires `candidates:download` permission. Viewers should receive 403 Forbidden.

### POST /api/admin/candidates/bulk-download
Download multiple CVs or cover letters as a ZIP file.

**Authorization:** Requires `candidates:download` permission. Viewers should receive 403 Forbidden.

**Request:**
```json
{
  "candidate_ids": [1, 2, 3, 4],
  "type": "cv" | "cover_letter" | "both"
}
```

**Response:** Binary ZIP file stream

### DELETE /api/admin/candidates/{id}
Delete a candidate application. Requires `candidates:delete` permission (super_admin only).

### DELETE /api/admin/candidates/bulk
Bulk delete candidate applications. Requires `candidates:delete` permission (super_admin only).

**Request:**
```json
{
  "ids": [1, 2, 3]
}
```

### POST /api/admin/candidates/bulk-export
Export selected candidates to CSV.

**Request:**
```json
{
  "ids": [1, 2, 3, 4, 5]
}
```

**Response:** CSV file stream

### GET /api/admin/nationalities
Get list of unique nationalities for filter dropdown.
**Response:**
```json
{
  "nationalities": ["British", "American", "Canadian", "Australian"]
}
```

---

## Job Postings

### GET /api/admin/jobs
List all job postings with filtering and pagination.

**Query Parameters:**
- `search` (optional): Search by title, location, or description
- `status` (optional): Filter by status (active, inactive)
- `country` (optional): Filter by country
- `work_type` (optional): Filter by work type (remote, hybrid, on-site, flexible)
- `experience` (optional): Filter by experience level
- `page` (optional): Page number for pagination
- `per_page` (optional): Items per page

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Senior Accountant",
      "description": "We are looking for an experienced Senior Accountant...",
      "country": "United Kingdom",
      "location": "London",
      "work_type": "hybrid",
      "experience_required": "7-10",
      "requirements": "CPA or ACCA qualified...",
      "benefits": "Competitive salary...",
      "salary_range": "55000-70000",
      "currency_override": "GBP",
      "is_active": true,
      "created_at": "2024-01-10T09:00:00Z",
      "updated_at": "2024-01-10T09:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 10,
    "total": 25
  }
}
```

### POST /api/admin/jobs
Create a new job posting. Requires `jobs:create` permission (super_admin, editor).

**Request:**
```json
{
  "title": "Senior Accountant",
  "description": "Full job description...",
  "country": "United Kingdom",
  "location": "London",
  "work_type": "hybrid",
  "experience_required": "7-10",
  "requirements": "CPA or ACCA qualified...",
  "benefits": "Competitive salary...",
  "salary_range": "55000-70000",
  "currency_override": "GBP",
  "is_active": true
}
```

**Response:**
```json
{
  "job": {
    "id": 1,
    "title": "Senior Accountant",
    ...
  }
}
```

### PUT /api/admin/jobs/{id}
Update an existing job posting. Requires `jobs:update` permission (super_admin, editor).

**Request:** Same as POST

### DELETE /api/admin/jobs/{id}
Delete a job posting. Requires `jobs:delete` permission (super_admin only).

### PATCH /api/admin/jobs/{id}/toggle-status
Toggle the active status of a job posting. Requires `jobs:toggle_status` permission (super_admin, editor).

**Note:** Viewers cannot toggle job status.

**Request:**
```json
{
  "is_active": true
}
```

### DELETE /api/admin/jobs/bulk
Bulk delete job postings. Requires `jobs:delete` permission (super_admin only).

**Request:**
```json
{
  "ids": [1, 2, 3]
}
```

### POST /api/admin/jobs/bulk-export
Export selected jobs to CSV.

**Request:**
```json
{
  "ids": [1, 2, 3]
}
```

---

## Public Jobs API (Careers Page)

Public endpoints for the careers page to display active job postings.

### GET /api/jobs
List all active job postings for the public careers page. No authentication required.

**Query Parameters:**
- `search` (optional): Search by title or description
- `country` (optional): Filter by country
- `location` (optional): Filter by location/city
- `work_type` (optional): Filter by work type (remote, hybrid, on-site, flexible)
- `experience` (optional): Filter by experience level (0-3, 3-7, 7-10, 10+)
- `page` (optional): Page number for pagination
- `per_page` (optional): Items per page (default: 12)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Senior Accountant",
      "description": "We are looking for an experienced Senior Accountant...",
      "country": "United Kingdom",
      "location": "London",
      "work_type": "hybrid",
      "experience_required": "7-10",
      "requirements": "CPA or ACCA qualified...",
      "benefits": "Competitive salary...",
      "salary_range": "55000-70000",
      "currency": "GBP",
      "created_at": "2024-01-10T09:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 12,
    "total": 25
  },
  "filters": {
    "countries": ["United Kingdom", "United Arab Emirates", "Australia"],
    "locations": ["London", "Dubai", "Sydney"],
    "work_types": ["remote", "hybrid", "on-site"]
  }
}
```

**Note:** Only returns jobs where `is_active = true`. The `filters` object provides available filter options based on current active jobs.

### GET /api/jobs/{id}
Get a single active job posting by ID. No authentication required.

**Response:**
```json
{
  "job": {
    "id": 1,
    "title": "Senior Accountant",
    "description": "Full job description with all details...",
    "country": "United Kingdom",
    "location": "London",
    "work_type": "hybrid",
    "experience_required": "7-10",
    "requirements": "CPA or ACCA qualified...",
    "benefits": "Competitive salary, health insurance...",
    "salary_range": "55000-70000",
    "currency": "GBP",
    "created_at": "2024-01-10T09:00:00Z"
  }
}
```

**Error (Job not found or inactive):**
```json
{
  "message": "Job not found"
}
```
Status: 404

### GET /api/jobs/filters
Get available filter options for the careers page. No authentication required.

**Response:**
```json
{
  "countries": [
    { "value": "United Kingdom", "label": "United Kingdom", "count": 8 },
    { "value": "United Arab Emirates", "label": "United Arab Emirates", "count": 5 },
    { "value": "Australia", "label": "Australia", "count": 3 }
  ],
  "locations": [
    { "value": "London", "label": "London", "count": 5 },
    { "value": "Dubai", "label": "Dubai", "count": 4 },
    { "value": "Sydney", "label": "Sydney", "count": 3 }
  ],
  "work_types": [
    { "value": "remote", "label": "Remote", "count": 6 },
    { "value": "hybrid", "label": "Hybrid", "count": 10 },
    { "value": "on-site", "label": "On-site", "count": 5 },
    { "value": "flexible", "label": "Flexible", "count": 4 }
  ],
  "experience_levels": [
    { "value": "0-3", "label": "0-3 years", "count": 4 },
    { "value": "3-7", "label": "3-7 years", "count": 8 },
    { "value": "7-10", "label": "7-10 years", "count": 6 },
    { "value": "10+", "label": "10+ years", "count": 3 }
  ],
  "total_jobs": 25
}
```

### Laravel Controller Example

```php
// app/Http/Controllers/Api/PublicJobController.php
class PublicJobController extends Controller
{
    public function index(Request $request)
    {
        $query = JobPosting::where('is_active', true);
        
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%");
            });
        }
        
        if ($request->country) {
            $query->where('country', $request->country);
        }
        
        if ($request->location) {
            $query->where('location', $request->location);
        }
        
        if ($request->work_type) {
            $query->where('work_type', $request->work_type);
        }
        
        if ($request->experience) {
            $query->where('experience_required', $request->experience);
        }
        
        $jobs = $query->orderBy('created_at', 'desc')
                      ->paginate($request->per_page ?? 12);
        
        // Get filter options from active jobs
        $activeJobs = JobPosting::where('is_active', true);
        $filters = [
            'countries' => $activeJobs->distinct()->pluck('country'),
            'locations' => $activeJobs->distinct()->pluck('location'),
            'work_types' => $activeJobs->distinct()->pluck('work_type'),
        ];
        
        return response()->json([
            'data' => $jobs->items(),
            'meta' => [
                'current_page' => $jobs->currentPage(),
                'last_page' => $jobs->lastPage(),
                'per_page' => $jobs->perPage(),
                'total' => $jobs->total(),
            ],
            'filters' => $filters,
        ]);
    }
    
    public function show($id)
    {
        $job = JobPosting::where('is_active', true)->find($id);
        
        if (!$job) {
            return response()->json(['message' => 'Job not found'], 404);
        }
        
        return response()->json(['job' => $job]);
    }
}
```

### Laravel Routes Example

```php
// routes/api.php

// Public routes (no auth required)
Route::get('/jobs', [PublicJobController::class, 'index']);
Route::get('/jobs/filters', [PublicJobController::class, 'filters']);
Route::get('/jobs/{id}', [PublicJobController::class, 'show']);
```

---

## Employer Requests

### POST /api/employer-requests
Public endpoint for employers to submit recruitment requests.

**Request:**
```json
{
  "firm_name": "ABC Accounting Firm",
  "email": "hr@company.com",
  "country": "United Arab Emirates",
  "preferred_location": "Dubai",
  "preferred_nationality": "Arab",
  "budgeted_salary": "4001+",
  "years_experience": "7-10",
  "notes": "CPA/CA certified, Big 4 experience preferred"
}
```

**Field Mapping:**
| Frontend Field | API Field | Required |
|----------------|-----------|----------|
| Firm Name | firm_name | Yes |
| Email | email | Yes |
| Country | country | Yes |
| Preferred Location | preferred_location | Yes |
| Preferred Nationality | preferred_nationality | Yes |
| Budgeted Salary | budgeted_salary | Yes |
| Years Experience | years_experience | Yes |
| Notes | notes | No |

**Salary Range Values:**
- `below-1000` = Below $1,000/month
- `1000-2000` = $1,000 - $2,000/month
- `2001-3000` = $2,001 - $3,000/month
- `3001-4000` = $3,001 - $4,000/month
- `4001+` = Above $4,001/month

**Response (Success):**
```json
{
  "message": "Request submitted successfully"
}
```

### GET /api/admin/employer-requests
List all employer requests with filtering and pagination. Requires authentication.

**Query Parameters:**
- `country` (optional): Filter by country
- `preferred_location` (optional): Filter by preferred location
- `experience` (optional): Filter by experience level (0-3, 3-7, 7-10, 10+)
- `search` (optional): Search by firm name or email
- `page` (optional): Page number for pagination
- `per_page` (optional): Items per page

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "firm_name": "ABC Accounting Firm",
      "email": "hr@company.com",
      "country": "United Arab Emirates",
      "preferred_location": "Dubai",
      "preferred_nationality": "Arab",
      "budgeted_salary": "4001+",
      "years_experience": "7-10",
      "notes": "CPA/CA certified, Big 4 experience preferred",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 10,
    "total": 25
  }
}
```

### DELETE /api/admin/employer-requests/{id}
Delete an employer request. Requires `employer_requests:delete` permission (super_admin only).

**Authorization:** Editors and Viewers cannot delete employer requests.

### DELETE /api/admin/employer-requests/bulk
Bulk delete employer requests. Requires `employer_requests:delete` permission (super_admin only).

**Authorization:** Editors and Viewers cannot perform bulk delete.

**Request:**
```json
{
  "ids": [1, 2, 3]
}
```

### POST /api/admin/employer-requests/bulk-export
Export selected employer requests to CSV.

**Request:**
```json
{
  "ids": [1, 2, 3]
}
```

---

## Database Migrations

### Employer Requests Migration

```php
Schema::create('employer_requests', function (Blueprint $table) {
    $table->id();
    $table->string('firm_name');
    $table->string('email');
    $table->string('country');
    $table->string('preferred_location');
    $table->string('preferred_nationality');
    $table->enum('budgeted_salary', ['below-1000', '1000-2000', '2001-3000', '3001-4000', '4001+']);
    $table->enum('years_experience', ['0-3', '3-7', '7-10', '10+']);
    $table->text('notes')->nullable();
    $table->timestamps();
});
```

### Job Postings Migration

```php
Schema::create('job_postings', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->text('description');
    $table->string('country');
    $table->string('location');
    $table->enum('work_type', ['remote', 'hybrid', 'on-site', 'flexible'])->default('on-site');
    $table->enum('experience_required', ['0-3', '3-7', '7-10', '10+']);
    $table->text('requirements')->nullable();
    $table->text('benefits')->nullable();
    $table->string('salary_range')->nullable();
    $table->string('currency_override', 3)->nullable();
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});
```

### Candidate Applications Migration

```php
Schema::create('candidate_applications', function (Blueprint $table) {
    $table->id();
    $table->string('first_name');
    $table->string('last_name');
    $table->string('email');
    $table->string('nationality');
    $table->string('country');
    $table->string('location');
    $table->enum('expected_salary', ['below-1000', '1000-2000', '2001-3000', '3001-4000', '4001+']);
    $table->enum('experience', ['0-3', '3-7', '7-10', '10+']);
    $table->string('job_applied')->nullable();
    $table->foreignId('job_id')->nullable()->constrained('job_postings')->nullOnDelete();
    $table->string('cv_path');
    $table->string('cover_letter_path');
    $table->timestamps();
});
```

---

## Candidate Submission (Public)

### POST /api/candidates/apply
Public endpoint for candidates to submit their application.

**Request (multipart/form-data):**
- `first_name`: string, required, max 50 chars
- `last_name`: string, required, max 50 chars
- `email`: string, required, valid email
- `nationality`: string, required, max 50 chars
- `country`: string, required, max 100 chars
- `location`: string, required, max 100 chars
- `expected_salary`: string, required (below-1000, 1000-2000, 2001-3000, 3001-4000, 4001+)
- `experience`: string, required (0-3, 3-7, 7-10, 10+)
- `cv`: file, required, mime: docx (application/vnd.openxmlformats-officedocument.wordprocessingml.document), max 20MB
- `cover_letter`: file, required, mime: docx, max 20MB
- `job_title`: string, optional (if applying for a specific job)
- `job_id`: integer, optional (reference to job posting)

**Salary Expectation Values:**
- `below-1000` = Below $1,000/month
- `1000-2000` = $1,000 - $2,000/month
- `2001-3000` = $2,001 - $3,000/month
- `3001-4000` = $3,001 - $4,000/month
- `4001+` = Above $4,001/month

**Response (Success):**
```json
{
  "message": "Thank you for your application! You will receive a confirmation email shortly. Please check your spam folder if you don't see it in your inbox."
}
```

**Response (Error - Invalid file type):**
```json
{
  "message": "Only Word documents (.docx) are accepted",
  "errors": {
    "cv": ["The cv must be a file of type: docx."]
  }
}
```

---

## Email Notifications

When a candidate submits an application, send:
1. **To Admin**: Notification email with candidate details and download links
2. **To Candidate**: Automated response with the agreement document attached

### Laravel Mail Example

```php
// In CandidateApplicationController
public function store(Request $request)
{
    // Validate and store application...
    
    // Notify admin
    Mail::to(config('mail.admin_email'))->send(new NewCandidateApplication($candidate));
    
    // Send agreement to candidate
    Mail::to($candidate->email)->send(new CandidateAgreementMail($candidate));
    
    return response()->json(['message' => 'Successfully Submitted']);
}
```

---

## Blog Posts

### GET /api/admin/blog
List all blog posts with filtering and pagination. Requires authentication.

**Query Parameters:**
- `search` (optional): Search by title, excerpt, or author
- `status` (optional): Filter by status (published, draft)
- `category` (optional): Filter by category
- `page` (optional): Page number for pagination
- `per_page` (optional): Items per page

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "The Future of Offshore Accounting",
      "slug": "future-offshore-accounting-2024",
      "excerpt": "Discover how technological advancements...",
      "content": "# The Future of Offshore Accounting\n\n...",
      "category": "Industry Insights",
      "author": "Sarah Mitchell",
      "image_url": "/storage/blog/image.jpg",
      "is_published": true,
      "published_at": "2024-01-10T09:00:00Z",
      "created_at": "2024-01-10T08:00:00Z",
      "updated_at": "2024-01-10T09:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 10,
    "total": 25
  }
}
```

---

## Public Blog API

Public endpoints for the blog page to display published articles.

### GET /api/blog
List all published blog posts for the public blog page. No authentication required.

**Query Parameters:**
- `search` (optional): Search by title, excerpt, or content
- `category` (optional): Filter by category slug or name
- `author` (optional): Filter by author name
- `page` (optional): Page number for pagination
- `per_page` (optional): Items per page (default: 9)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "The Future of Offshore Accounting",
      "slug": "future-offshore-accounting-2024",
      "excerpt": "Discover how technological advancements are reshaping the offshore accounting landscape...",
      "category": "Industry Insights",
      "author": "Sarah Mitchell",
      "image_url": "/storage/blog/future-accounting.jpg",
      "published_at": "2024-01-10T09:00:00Z",
      "reading_time": 5
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 9,
    "total": 25
  },
  "filters": {
    "categories": [
      { "name": "Industry Insights", "slug": "industry-insights", "count": 8 },
      { "name": "Best Practices", "slug": "best-practices", "count": 5 },
      { "name": "Tax Advisory", "slug": "tax-advisory", "count": 4 }
    ],
    "authors": [
      { "name": "Sarah Mitchell", "count": 10 },
      { "name": "James Thompson", "count": 8 }
    ]
  }
}
```

**Note:** Only returns posts where `is_published = true`. The `reading_time` is calculated based on content length (~200 words/minute).

### GET /api/blog/{slug}
Get a single published blog post by slug. No authentication required.

**Response:**
```json
{
  "post": {
    "id": 1,
    "title": "The Future of Offshore Accounting",
    "slug": "future-offshore-accounting-2024",
    "excerpt": "Discover how technological advancements are reshaping...",
    "content": "# The Future of Offshore Accounting\n\nIn today's rapidly evolving business landscape...\n\n## Key Trends\n\n### 1. AI-Powered Automation\n\nArtificial intelligence is transforming...",
    "category": "Industry Insights",
    "author": "Sarah Mitchell",
    "image_url": "/storage/blog/future-accounting.jpg",
    "published_at": "2024-01-10T09:00:00Z",
    "reading_time": 5,
    "table_of_contents": [
      { "id": "key-trends", "title": "Key Trends", "level": 2 },
      { "id": "ai-powered-automation", "title": "AI-Powered Automation", "level": 3 },
      { "id": "cloud-integration", "title": "Cloud Integration", "level": 3 }
    ]
  },
  "related_posts": [
    {
      "id": 5,
      "title": "Best Practices for Remote Accounting Teams",
      "slug": "best-practices-remote-accounting",
      "excerpt": "Managing distributed accounting teams effectively...",
      "category": "Best Practices",
      "image_url": "/storage/blog/remote-teams.jpg",
      "published_at": "2024-01-08T09:00:00Z"
    }
  ]
}
```

**Error (Post not found or unpublished):**
```json
{
  "message": "Post not found"
}
```
Status: 404

### GET /api/blog/categories
Get available blog categories with post counts. No authentication required.

**Response:**
```json
{
  "categories": [
    {
      "id": 1,
      "name": "Industry Insights",
      "slug": "industry-insights",
      "description": "Latest trends and news from the accounting industry",
      "count": 8
    },
    {
      "id": 2,
      "name": "Best Practices",
      "slug": "best-practices",
      "description": "Tips and strategies for accounting professionals",
      "count": 5
    }
  ],
  "total_posts": 25
}
```

### GET /api/blog/featured
Get featured/recent blog posts for homepage display. No authentication required.

**Query Parameters:**
- `limit` (optional): Number of posts to return (default: 3, max: 6)

**Response:**
```json
{
  "posts": [
    {
      "id": 1,
      "title": "The Future of Offshore Accounting",
      "slug": "future-offshore-accounting-2024",
      "excerpt": "Discover how technological advancements...",
      "category": "Industry Insights",
      "author": "Sarah Mitchell",
      "image_url": "/storage/blog/future-accounting.jpg",
      "published_at": "2024-01-10T09:00:00Z",
      "reading_time": 5
    }
  ]
}
```

### Laravel Controller Example

```php
// app/Http/Controllers/Api/PublicBlogController.php
class PublicBlogController extends Controller
{
    public function index(Request $request)
    {
        $query = BlogPost::where('is_published', true);
        
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                  ->orWhere('excerpt', 'like', "%{$request->search}%")
                  ->orWhere('content', 'like', "%{$request->search}%");
            });
        }
        
        if ($request->category) {
            $query->where(function ($q) use ($request) {
                $q->where('category', $request->category)
                  ->orWhereRaw("LOWER(REPLACE(category, ' ', '-')) = ?", [strtolower($request->category)]);
            });
        }
        
        if ($request->author) {
            $query->where('author', $request->author);
        }
        
        $posts = $query->orderBy('published_at', 'desc')
                       ->paginate($request->per_page ?? 9);
        
        // Calculate reading time for each post
        $posts->getCollection()->transform(function ($post) {
            $post->reading_time = ceil(str_word_count(strip_tags($post->content)) / 200);
            return $post;
        });
        
        return response()->json([
            'data' => $posts->items(),
            'meta' => [...],
            'filters' => [...],
        ]);
    }
    
    public function show($slug)
    {
        $post = BlogPost::where('is_published', true)
                        ->where('slug', $slug)
                        ->first();
        
        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }
        
        // Calculate reading time
        $post->reading_time = ceil(str_word_count(strip_tags($post->content)) / 200);
        
        // Generate table of contents from markdown headings
        $post->table_of_contents = $this->generateTableOfContents($post->content);
        
        // Get related posts (same category, excluding current)
        $relatedPosts = BlogPost::where('is_published', true)
                                ->where('id', '!=', $post->id)
                                ->where('category', $post->category)
                                ->limit(3)
                                ->get();
        
        return response()->json([
            'post' => $post,
            'related_posts' => $relatedPosts,
        ]);
    }
    
    private function generateTableOfContents($content)
    {
        preg_match_all('/^(#{2,3})\s+(.+)$/m', $content, $matches, PREG_SET_ORDER);
        
        return collect($matches)->map(fn($match) => [
            'id' => Str::slug($match[2]),
            'title' => $match[2],
            'level' => strlen($match[1]),
        ])->values()->all();
    }
}
```

### Laravel Routes Example

```php
// routes/api.php

// Public blog routes (no auth required)
Route::get('/blog', [PublicBlogController::class, 'index']);
Route::get('/blog/categories', [PublicBlogController::class, 'categories']);
Route::get('/blog/featured', [PublicBlogController::class, 'featured']);
Route::get('/blog/{slug}', [PublicBlogController::class, 'show']);
```

---

### POST /api/admin/blog
Create a new blog post. Requires `blog:create` permission (super_admin, editor).

**Request:**
```json
{
  "title": "My New Blog Post",
  "excerpt": "Brief description of the post",
  "content": "# Full markdown content...",
  "category": "Industry Insights",
  "author": "Sarah Mitchell",
  "image_url": "/storage/blog/image.jpg",
  "is_published": false
}
```

**Response:**
```json
{
  "post": {
    "id": 1,
    "title": "My New Blog Post",
    "slug": "my-new-blog-post",
    ...
  }
}
```

### PUT /api/admin/blog/{id}
Update an existing blog post. Requires `blog:update` permission (super_admin, editor).

**Request:** Same as POST

### DELETE /api/admin/blog/{id}
Delete a blog post. Requires `blog:delete` permission (super_admin, editor).

### DELETE /api/admin/blog/bulk
Bulk delete blog posts. Requires `blog:delete` permission (super_admin, editor).

**Request:**
```json
{
  "ids": [1, 2, 3]
}
```

### PATCH /api/admin/blog/{id}/publish
Toggle publish status of a blog post. Requires `blog:update` permission.

**Request:**
```json
{
  "is_published": true
}
```

---

## Blog Image Upload

### POST /api/admin/upload-image
Upload an image for blog posts. Requires authentication. Returns the URL of the uploaded image.

**Request (multipart/form-data):**
- `image`: file, required, mime: jpeg,png,gif,webp, max 5MB

**Response (Success):**
```json
{
  "url": "/storage/blog/images/image-1234567890.jpg",
  "image_url": "/storage/blog/images/image-1234567890.jpg",
  "filename": "image-1234567890.jpg"
}
```

**Response (Error):**
```json
{
  "message": "The image must be a file of type: jpeg, png, gif, webp.",
  "errors": {
    "image": ["The image must be a file of type: jpeg, png, gif, webp."]
  }
}
```

### Laravel Controller Example

```php
// In BlogController or a dedicated UploadController
public function uploadImage(Request $request)
{
    $request->validate([
        'image' => 'required|image|mimes:jpeg,png,gif,webp|max:5120',
    ]);

    $path = $request->file('image')->store('blog/images', 'public');
    
    return response()->json([
        'url' => Storage::url($path),
        'image_url' => Storage::url($path),
        'filename' => basename($path),
    ]);
}
```

### Laravel Route Example

```php
// In routes/api.php
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/admin/upload-image', [BlogController::class, 'uploadImage']);
});
```

---

## Blog Posts Migration

```php
Schema::create('blog_posts', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->string('slug')->unique();
    $table->text('excerpt');
    $table->longText('content');
    $table->string('category');
    $table->string('author');
    $table->string('image_url')->nullable();
    $table->boolean('is_published')->default(false);
    $table->timestamp('published_at')->nullable();
    $table->timestamps();
});
```

---

## Admin Settings

### GET /api/admin/settings
Get all admin settings. Requires authentication.

**Response:**
```json
{
  "branding": {
    "logo_url": "/storage/branding/logo.png",
    "company_name": "Global Outsourced Accounting",
    "tagline": "Global Out Sourced Offshore Accounting Solutions",
    "primary_color": "222 47% 11%",
    "accent_color": "45 93% 47%"
  },
  "general": {
    "theme_mode": "light",
    "items_per_page": 10,
    "date_format": "MM/DD/YYYY",
    "time_format": "12h",
    "currency_format": "USD",
    "auto_archive_days": 90,
    "auto_archive_enabled": false
  },
  "social_links": [
    {
      "id": 1,
      "platform": "LinkedIn",
      "url": "https://linkedin.com/company/goa",
      "icon": "linkedin",
      "enabled": true
    }
  ],
  "blog_categories": [
    {
      "id": 1,
      "name": "Industry News",
      "slug": "industry-news",
      "description": "Latest accounting industry updates",
      "is_default": true
    }
  ],
  "experience_levels": [
    {
      "id": 1,
      "value": "0-3",
      "label": "0-3 years",
      "is_default": true
    }
  ],
  "notifications": {
    "email_new_candidates": true,
    "email_new_employer_requests": true,
    "email_digest_frequency": "daily",
    "candidate_threshold": 10,
    "employer_threshold": 5,
    "threshold_alert_enabled": true
  }
}
```

### PUT /api/admin/settings/branding
Update branding settings. Requires `settings:update` permission (super_admin only).

**Request:**
```json
{
  "company_name": "Global Outsourced Accounting",
  "tagline": "Your tagline here",
  "primary_color": "222 47% 11%",
  "accent_color": "45 93% 47%"
}
```

### PUT /api/admin/settings/general
Update general settings. Requires `settings:update` permission (super_admin only).

**Request:**
```json
{
  "theme_mode": "light",
  "items_per_page": 10,
  "date_format": "MM/DD/YYYY",
  "time_format": "12h",
  "currency_format": "USD",
  "auto_archive_days": 90,
  "auto_archive_enabled": false
}
```

**Valid Values:**
- `theme_mode`: "light", "dark", "system"
- `date_format`: "MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"
- `time_format`: "12h", "24h"
- `currency_format`: "USD", "EUR", "GBP", "AUD", "CAD"

### POST /api/admin/settings/branding/logo
Upload company logo. Requires `settings:update` permission (super_admin only).

**Request:** multipart/form-data
- `logo`: Image file (PNG, JPG, SVG, max 2MB)

**Response:**
```json
{
  "logo_url": "/storage/branding/logo.png"
}
```

### DELETE /api/admin/settings/branding/logo
Remove company logo. Requires `settings:update` permission (super_admin only).

---

## Social Links

### POST /api/admin/settings/social-links
Create a new social link. Requires `settings:update` permission (super_admin only).

**Request:**
```json
{
  "platform": "LinkedIn",
  "url": "https://linkedin.com/company/goa",
  "icon": "linkedin",
  "enabled": true
}
```

### PUT /api/admin/settings/social-links/{id}
Update a social link. Requires `settings:update` permission.

### DELETE /api/admin/settings/social-links/{id}
Delete a social link. Requires `settings:update` permission.

---

## Blog Categories

### POST /api/admin/settings/blog-categories
Create a new category. Requires `settings:update` permission (super_admin only).

**Request:**
```json
{
  "name": "New Category",
  "slug": "new-category",
  "description": "Optional description"
}
```

### PUT /api/admin/settings/blog-categories/{id}
Update a category. Requires `settings:update` permission.

### DELETE /api/admin/settings/blog-categories/{id}
Delete a category. Cannot delete default categories. Requires `settings:update` permission.

---

## Experience Levels

### POST /api/admin/settings/experience-levels
Create a new experience level. Requires `settings:update` permission (super_admin only).

**Request:**
```json
{
  "value": "15+",
  "label": "15+ years"
}
```

### PUT /api/admin/settings/experience-levels/{id}
Update an experience level. Requires `settings:update` permission.

### DELETE /api/admin/settings/experience-levels/{id}
Delete an experience level. Cannot delete default levels. Requires `settings:update` permission.

---

## Notification Preferences

### PUT /api/admin/settings/notifications
Update notification preferences. Requires `settings:update` permission (super_admin only).

**Request:**
```json
{
  "email_new_candidates": true,
  "email_new_employer_requests": true,
  "email_digest_frequency": "daily",
  "candidate_threshold": 10,
  "employer_threshold": 5,
  "threshold_alert_enabled": true
}
```

**Valid Values:**
- `email_digest_frequency`: "instant", "daily", "weekly", "never"

---

## Admin Users & Roles

### GET /api/admin/users
List all admin users. Requires `users:view` permission (super_admin only).

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "super_admin",
      "created_at": "2024-01-01T00:00:00Z",
      "last_login": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### POST /api/admin/users
Create/invite a new admin user. Requires `users:create` permission (super_admin only).

**Request:**
```json
{
  "name": "New Admin",
  "email": "newadmin@example.com",
  "role": "editor"
}
```

### PUT /api/admin/users/{id}/role
Update user role. Requires `users:update` permission (super_admin only).

**Request:**
```json
{
  "role": "viewer"
}
```

### DELETE /api/admin/users/{id}
Delete an admin user. Requires `users:delete` permission (super_admin only).

---

## Role Definitions

| Role | Permissions |
|------|-------------|
| super_admin | Full access to all features and settings |
| editor | Can manage blog posts and job postings, view all other data |
| viewer | Read-only access to all data, no downloads, no dashboard charts |

### Frontend UI Restrictions by Role

| UI Element | Super Admin | Editor | Viewer |
|------------|-------------|--------|--------|
| Dashboard Charts | Visible | Visible | Hidden |
| Dashboard Quick Actions | Full | Limited | View Only |
| Action Buttons | Full | Module-specific | "View" only |
| Delete Buttons | Visible | Limited | Hidden |
| Status Toggles | Enabled | Enabled | Disabled |
| CV/Cover Letter Download | Enabled | Enabled | Hidden |
| Bulk Actions | Full | Limited | Hidden |
| Settings Edit | Enabled | Disabled | Disabled |
| Audit Log Access | Visible | Hidden | Hidden |
| Role Badge in Header | "Admin" | "Editor" | "Viewer" |

### Laravel Migration for Admin Roles

```php
// Create roles enum or table
Schema::create('admin_users', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->enum('role', ['super_admin', 'editor', 'viewer'])->default('viewer');
    $table->timestamps();
});
```

### Settings Migrations

```php
Schema::create('settings', function (Blueprint $table) {
    $table->id();
    $table->string('key')->unique();
    $table->text('value')->nullable();
    $table->timestamps();
});

// Example settings keys:
// - branding.company_name
// - branding.tagline
// - branding.logo_url
// - branding.primary_color
// - branding.accent_color
// - general.theme_mode (default: 'light')
// - general.items_per_page
// - general.date_format
// - general.time_format
// - general.currency_format
// - general.auto_archive_days
// - general.auto_archive_enabled
// - notifications.email_new_candidates
// - notifications.email_new_employer_requests
// - notifications.email_digest_frequency
// - notifications.candidate_threshold
// - notifications.employer_threshold
// - notifications.threshold_alert_enabled

Schema::create('social_links', function (Blueprint $table) {
    $table->id();
    $table->string('platform');
    $table->string('url');
    $table->string('icon')->nullable();
    $table->boolean('enabled')->default(true);
    $table->integer('order')->default(0);
    $table->timestamps();
});

Schema::create('blog_categories', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('slug')->unique();
    $table->string('description')->nullable();
    $table->boolean('is_default')->default(false);
    $table->timestamps();
});

Schema::create('experience_levels', function (Blueprint $table) {
    $table->id();
    $table->string('value')->unique();
    $table->string('label');
    $table->boolean('is_default')->default(false);
    $table->timestamps();
});
```

---

## Admin Notifications

Real-time notifications for admin users about new candidates, employer requests, and system events.

### GET /api/admin/notifications
List notifications for the authenticated admin user. Requires authentication.

**Query Parameters:**
- `unread_only` (optional): Filter to only unread notifications (boolean)
- `limit` (optional): Maximum number to return (default: 50)

**Response:**
```json
{
  "data": [
    {
      "id": "notif_abc123",
      "type": "candidate",
      "title": "New Application",
      "message": "John Doe applied for Senior Accountant",
      "timestamp": "2024-01-15T10:30:00Z",
      "read": false,
      "link": "/admin/candidates"
    },
    {
      "id": "notif_def456",
      "type": "employer",
      "title": "New Employer Request",
      "message": "ABC Accounting submitted a request",
      "timestamp": "2024-01-15T09:15:00Z",
      "read": true,
      "link": "/admin/employers"
    }
  ],
  "unread_count": 5
}
```

**Notification Types:**
| Type | Description |
|------|-------------|
| candidate | New candidate application received |
| employer | New employer request received |
| job | Job posting status change |
| blog | Blog post published/updated |

### POST /api/admin/notifications
Create a new notification (typically called internally by the system). Requires authentication.

**Request:**
```json
{
  "type": "candidate",
  "title": "New Application",
  "message": "John Doe applied for Senior Accountant",
  "link": "/admin/candidates"
}
```

**Response:**
```json
{
  "notification": {
    "id": "notif_abc123",
    "type": "candidate",
    "title": "New Application",
    "message": "John Doe applied for Senior Accountant",
    "timestamp": "2024-01-15T10:30:00Z",
    "read": false,
    "link": "/admin/candidates"
  }
}
```

### PATCH /api/admin/notifications/{id}/read
Mark a single notification as read. Requires authentication.

**Response:**
```json
{
  "message": "Notification marked as read"
}
```

### POST /api/admin/notifications/mark-all-read
Mark all notifications as read for the authenticated user. Requires authentication.

**Response:**
```json
{
  "message": "All notifications marked as read",
  "updated_count": 5
}
```

### DELETE /api/admin/notifications/{id}
Delete a single notification. Requires authentication.

**Response:**
```json
{
  "message": "Notification deleted"
}
```

### DELETE /api/admin/notifications/clear
Clear all notifications for the authenticated user. Requires authentication.

**Response:**
```json
{
  "message": "All notifications cleared",
  "deleted_count": 15
}
```

### Notifications Migration

```php
Schema::create('admin_notifications', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->foreignId('user_id')->constrained('admin_users')->cascadeOnDelete();
    $table->enum('type', ['candidate', 'employer', 'job', 'blog']);
    $table->string('title');
    $table->text('message');
    $table->string('link')->nullable();
    $table->boolean('read')->default(false);
    $table->timestamp('timestamp');
    $table->timestamps();
    
    $table->index(['user_id', 'read']);
    $table->index(['user_id', 'timestamp']);
});
```

### Real-Time Notifications (Optional)

For real-time notification delivery, consider implementing Laravel Broadcasting with Pusher or Laravel WebSockets:

```php
// Event: NewNotificationEvent.php
class NewNotificationEvent implements ShouldBroadcast
{
    public $notification;
    
    public function __construct($notification)
    {
        $this->notification = $notification;
    }
    
    public function broadcastOn()
    {
        return new PrivateChannel('admin.notifications.' . $this->notification->user_id);
    }
    
    public function broadcastAs()
    {
        return 'notification.created';
    }
}

// Usage in CandidateController after new application:
event(new NewNotificationEvent($notification));
```

### Auto-Triggering Notifications

Notifications should be automatically created when:

| Event | Notification Type | Recipients |
|-------|------------------|------------|
| New candidate application | candidate | All admins |
| New employer request | employer | All admins |
| Job posting expires soon | job | Job creator + super_admin |
| Blog post published | blog | All admins |

---

## Audit Logs

### GET /api/admin/audit-logs
List all audit log entries with filtering. Requires `audit_logs:view` permission (super_admin only).

**Query Parameters:**
- `module` (optional): Filter by module (candidates, jobs, employer_requests, blog)
- `action` (optional): Filter by action type (create, update, delete, archive, deactivate, activate, publish, unpublish)
- `user_id` (optional): Filter by user ID
- `date_from` (optional): Filter from date (YYYY-MM-DD)
- `date_to` (optional): Filter to date (YYYY-MM-DD)
- `page` (optional): Page number for pagination
- `per_page` (optional): Items per page

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "timestamp": "2024-01-15T10:30:00Z",
      "user_id": "1",
      "user_name": "Admin User",
      "user_email": "admin@example.com",
      "user_role": "super_admin",
      "action": "update",
      "module": "jobs",
      "resource_id": 5,
      "resource_name": "Senior Accountant",
      "changes": [
        {
          "field": "salary_range",
          "old_value": "$50,000 - $60,000",
          "new_value": "$55,000 - $65,000"
        }
      ],
      "metadata": {}
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 10,
    "per_page": 50,
    "total": 250
  }
}
```

### Audit Logs Migration

```php
Schema::create('audit_logs', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->timestamp('timestamp');
    $table->foreignId('user_id')->constrained('admin_users')->cascadeOnDelete();
    $table->string('user_name');
    $table->string('user_email');
    $table->string('user_role');
    $table->enum('action', ['create', 'update', 'delete', 'archive', 'deactivate', 'activate', 'publish', 'unpublish']);
    $table->enum('module', ['candidates', 'jobs', 'employer_requests', 'blog']);
    $table->string('resource_id');
    $table->string('resource_name');
    $table->json('changes')->nullable();
    $table->json('metadata')->nullable();
    $table->timestamps();
    
    $table->index(['module', 'timestamp']);
    $table->index(['user_id', 'timestamp']);
    $table->index(['action', 'timestamp']);
});
```

---

## Currencies

The application supports 60+ currencies with automatic detection based on country. Available currencies include:

| Code | Name | Symbol |
|------|------|--------|
| USD | US Dollar | $ |
| EUR | Euro | € |
| GBP | British Pound | £ |
| JPY | Japanese Yen | ¥ |
| AUD | Australian Dollar | A$ |
| CAD | Canadian Dollar | C$ |
| CHF | Swiss Franc | CHF |
| CNY | Chinese Yuan | ¥ |
| INR | Indian Rupee | ₹ |
| AED | UAE Dirham | د.إ |
| SAR | Saudi Riyal | ر.س |
| ZAR | South African Rand | R |
| NGN | Nigerian Naira | ₦ |
| KES | Kenyan Shilling | KSh |
| ... | ... | ... |

### Currency Override

Job postings support a `currency_override` field to manually specify the currency when auto-detection from location is incorrect.

---

## Work Types

Job postings support the following work types:

| Value | Label |
|-------|-------|
| remote | Remote |
| hybrid | Hybrid |
| on-site | On-site |
| flexible | Flexible |

---

## Experience Levels

Default experience levels (configurable in settings):

| Value | Label |
|-------|-------|
| 0-3 | 0-3 years |
| 3-7 | 3-7 years |
| 7-10 | 7-10 years |
| 10+ | 10+ years |

---

## Pagination

All list endpoints support pagination with the following standard meta structure:

```json
{
  "meta": {
    "current_page": 1,
    "last_page": 10,
    "per_page": 10,
    "total": 100
  }
}
```

The `per_page` value defaults to the global `items_per_page` setting but can be overridden per request.

---

## Error Responses

### Standard Error Format

```json
{
  "message": "Error description",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Server Error |

---

## Environment Variables (Laravel .env)

```env
ADMIN_NOTIFICATION_EMAIL=hr@yourcompany.com
SANCTUM_STATEFUL_DOMAINS=localhost:5173,your-frontend.com
SESSION_DOMAIN=.yourdomain.com

# Default theme mode for new users
DEFAULT_THEME_MODE=light
```

---

## Laravel Middleware Example

```php
// app/Http/Middleware/CheckAdminRole.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckAdminRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = $request->user();
        
        if (!$user || !$user->adminUser) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        $userRole = $user->adminUser->role;
        
        if (!in_array($userRole, $roles)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        
        return $next($request);
    }
}

// Usage in routes:
Route::middleware(['auth:sanctum', 'admin.role:super_admin'])->group(function () {
    Route::delete('/admin/employer-requests/{id}', [EmployerRequestController::class, 'destroy']);
    Route::put('/admin/settings/general', [SettingsController::class, 'updateGeneral']);
});

Route::middleware(['auth:sanctum', 'admin.role:super_admin,editor'])->group(function () {
    Route::post('/admin/jobs', [JobController::class, 'store']);
    Route::put('/admin/jobs/{id}', [JobController::class, 'update']);
});
```

---

## Permission Helper Example

```php
// app/Helpers/PermissionHelper.php
namespace App\Helpers;

class PermissionHelper
{
    const PERMISSIONS = [
        'super_admin' => [
            'candidates:view', 'candidates:create', 'candidates:update', 'candidates:delete', 'candidates:download',
            'jobs:view', 'jobs:create', 'jobs:update', 'jobs:delete', 'jobs:archive', 'jobs:toggle_status',
            'employer_requests:view', 'employer_requests:delete',
            'blog:view', 'blog:create', 'blog:update', 'blog:delete',
            'settings:view', 'settings:update',
            'users:view', 'users:create', 'users:update', 'users:delete',
            'audit_logs:view',
            'dashboard:charts',
        ],
        'editor' => [
            'candidates:view', 'candidates:download',
            'jobs:view', 'jobs:create', 'jobs:update', 'jobs:archive', 'jobs:toggle_status',
            'employer_requests:view',
            'blog:view', 'blog:create', 'blog:update', 'blog:delete',
            'settings:view',
            'dashboard:charts',
        ],
        'viewer' => [
            'candidates:view',
            'jobs:view',
            'employer_requests:view',
            'blog:view',
            'settings:view',
        ],
    ];
    
    public static function hasPermission(string $role, string $permission): bool
    {
        return in_array($permission, self::PERMISSIONS[$role] ?? []);
    }
}
```
