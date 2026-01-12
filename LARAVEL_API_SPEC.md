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

## Candidate Submission (Public)

### POST /api/candidates/apply
Public endpoint for candidates to submit their application.

**Request (multipart/form-data):**
- `first_name`: string, required
- `last_name`: string, required
- `email`: string, required, valid email
- `nationality`: string, required
- `experience`: string, required (0-3, 3-7, 7-10, 10+)
- `cv`: file, required, mime: docx (application/vnd.openxmlformats-officedocument.wordprocessingml.document)
- `cover_letter`: file, required, mime: docx

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

## Environment Variables (Laravel .env)

```env
ADMIN_NOTIFICATION_EMAIL=hr@yourcompany.com
SANCTUM_STATEFUL_DOMAINS=localhost:5173,your-frontend.com
SESSION_DOMAIN=.yourdomain.com
```
