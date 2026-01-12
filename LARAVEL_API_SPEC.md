# Laravel API Specification

This document outlines the API endpoints required for the admin panel to function properly.

## Configuration

Set the following environment variable in your React app:
```
VITE_LARAVEL_API_URL=https://your-laravel-api.com
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
    "email": "admin@example.com"
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
    "email": "admin@example.com"
  }
}
```

---

## Candidate Applications

### GET /api/admin/candidates
List all candidate applications with filtering and pagination.

**Query Parameters:**
- `experience` (optional): Filter by experience level (0-3, 3-7, 7-10, 10+)
- `nationality` (optional): Filter by nationality
- `search` (optional): Search by name or email
- `page` (optional): Page number for pagination

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
      "experience": "3-7",
      "cv_url": "/storage/cvs/cv-1.docx",
      "cover_letter_url": "/storage/cover-letters/cl-1.docx",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "total": 48
  }
}
```

### GET /api/admin/candidates/{id}/cv
Download candidate's CV file. Returns the Word document as a binary stream.

### GET /api/admin/candidates/{id}/cover-letter
Download candidate's cover letter. Returns the Word document as a binary stream.

### DELETE /api/admin/candidates/{id}
Delete a candidate application. Requires authentication.

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
- `page` (optional): Page number for pagination

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Senior Accountant",
      "description": "We are looking for an experienced Senior Accountant...",
      "location": "London, UK",
      "experience_required": "7-10",
      "requirements": "CPA or ACCA qualified...",
      "benefits": "Competitive salary...",
      "salary_range": "£55,000 - £70,000",
      "is_active": true,
      "created_at": "2024-01-10T09:00:00Z",
      "updated_at": "2024-01-10T09:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 3,
    "total": 25
  }
}
```

### POST /api/admin/jobs
Create a new job posting. Requires authentication.

**Request:**
```json
{
  "title": "Senior Accountant",
  "description": "Full job description...",
  "location": "London, UK",
  "experience_required": "7-10",
  "requirements": "CPA or ACCA qualified...",
  "benefits": "Competitive salary...",
  "salary_range": "£55,000 - £70,000",
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
Update an existing job posting. Requires authentication.

**Request:** Same as POST

### DELETE /api/admin/jobs/{id}
Delete a job posting. Requires authentication.

### PATCH /api/admin/jobs/{id}/toggle-status
Toggle the active status of a job posting.

**Request:**
```json
{
  "is_active": true
}
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
  "position_title": "Senior Accountant",
  "preferred_location": "Dubai, UAE",
  "preferred_nationality": "Arab",
  "years_experience": "7-10",
  "other_qualifications": "CPA/CA certified, Big 4 experience preferred"
}
```

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
- `experience` (optional): Filter by experience level (0-3, 3-7, 7-10, 10+)
- `search` (optional): Search by firm name, email, or position title
- `page` (optional): Page number for pagination

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "firm_name": "ABC Accounting Firm",
      "email": "hr@company.com",
      "country": "United Arab Emirates",
      "position_title": "Senior Accountant",
      "preferred_location": "Dubai, UAE",
      "preferred_nationality": "Arab",
      "years_experience": "7-10",
      "other_qualifications": "CPA/CA certified, Big 4 experience preferred",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 3,
    "total": 25
  }
}
```

### DELETE /api/admin/employer-requests/{id}
Delete an employer request. Requires authentication.

---

## Employer Requests Migration

```php
Schema::create('employer_requests', function (Blueprint $table) {
    $table->id();
    $table->string('firm_name');
    $table->string('email');
    $table->string('country');
    $table->string('position_title')->nullable();
    $table->string('preferred_location');
    $table->string('preferred_nationality');
    $table->enum('years_experience', ['0-3', '3-7', '7-10', '10+']);
    $table->text('other_qualifications')->nullable();
    $table->timestamps();
});
```

---

## Job Postings Migration

```php
Schema::create('job_postings', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->text('description');
    $table->string('location');
    $table->enum('experience_required', ['0-3', '3-7', '7-10', '10+']);
    $table->text('requirements')->nullable();
    $table->text('benefits')->nullable();
    $table->string('salary_range')->nullable();
    $table->boolean('is_active')->default(true);
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
- `experience`: string, required (0-3, 3-7, 7-10, 10+)
- `cv`: file, required, mime: docx (application/vnd.openxmlformats-officedocument.wordprocessingml.document), max 5MB
- `cover_letter`: file, required, mime: docx, max 5MB
- `job_title`: string, optional (if applying for a specific job)

**Response (Success):**
```json
{
  "message": "Successfully Submitted"
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

## Laravel Migration Example

```php
Schema::create('candidate_applications', function (Blueprint $table) {
    $table->id();
    $table->string('first_name');
    $table->string('last_name');
    $table->string('email');
    $table->string('nationality');
    $table->enum('experience', ['0-3', '3-7', '7-10', '10+']);
    $table->string('cv_path');
    $table->string('cover_letter_path');
    $table->timestamps();
});
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
    "total": 25
  }
}
```

### POST /api/admin/blog
Create a new blog post. Requires authentication.

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
Update an existing blog post. Requires authentication.

**Request:** Same as POST

### DELETE /api/admin/blog/{id}
Delete a blog post. Requires authentication.

### PATCH /api/admin/blog/{id}/publish
Toggle publish status of a blog post.

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
Get all admin settings.

**Response:**
```json
{
  "branding": {
    "logo_url": "/storage/branding/logo.png",
    "company_name": "Global Outsourced Accounting",
    "tagline": "Global Out Sourced Offshore Accounting Solutions"
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
Update branding settings.

**Request:**
```json
{
  "company_name": "Global Outsourced Accounting",
  "tagline": "Your tagline here"
}
```

### POST /api/admin/settings/branding/logo
Upload company logo.

**Request:** multipart/form-data
- `logo`: Image file (PNG, JPG, SVG, max 2MB)

**Response:**
```json
{
  "logo_url": "/storage/branding/logo.png"
}
```

### DELETE /api/admin/settings/branding/logo
Remove company logo.

---

## Social Links

### POST /api/admin/settings/social-links
Create a new social link.

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
Update a social link.

### DELETE /api/admin/settings/social-links/{id}
Delete a social link.

---

## Blog Categories

### POST /api/admin/settings/blog-categories
Create a new category.

**Request:**
```json
{
  "name": "New Category",
  "slug": "new-category",
  "description": "Optional description"
}
```

### PUT /api/admin/settings/blog-categories/{id}
Update a category.

### DELETE /api/admin/settings/blog-categories/{id}
Delete a category. Cannot delete default categories.

---

## Experience Levels

### POST /api/admin/settings/experience-levels
Create a new experience level.

**Request:**
```json
{
  "value": "15+",
  "label": "15+ years"
}
```

### PUT /api/admin/settings/experience-levels/{id}
Update an experience level.

### DELETE /api/admin/settings/experience-levels/{id}
Delete an experience level. Cannot delete default levels.

---

## Notification Preferences

### PUT /api/admin/settings/notifications
Update notification preferences.

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

---

## Admin Users & Roles

### GET /api/admin/users
List all admin users.

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
Create/invite a new admin user. Requires super_admin role.

**Request:**
```json
{
  "name": "New Admin",
  "email": "newadmin@example.com",
  "role": "editor"
}
```

### PUT /api/admin/users/{id}/role
Update user role. Requires super_admin role.

**Request:**
```json
{
  "role": "viewer"
}
```

### DELETE /api/admin/users/{id}
Delete an admin user. Requires super_admin role.

---

## Role Definitions

| Role | Permissions |
|------|-------------|
| super_admin | Full access to all features and settings |
| editor | Can manage blog posts and job postings only |
| viewer | Read-only access to all data |

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

## Environment Variables (Laravel .env)

```env
ADMIN_NOTIFICATION_EMAIL=hr@yourcompany.com
SANCTUM_STATEFUL_DOMAINS=localhost:5173,your-frontend.com
SESSION_DOMAIN=.yourdomain.com
```
