# JSON Server Mock API

This project includes a `db.json` file for mocking all Laravel API endpoints using [JSON Server](https://github.com/typicode/json-server).

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

```bash
npm install -g json-server
# or
yarn global add json-server
```

## Running the Mock Server

```bash
# Start JSON Server on port 3001
npx json-server --watch db.json --port 3001

# Or with custom delay to simulate network latency
npx json-server --watch db.json --port 3001 --delay 300
```

The server will start at `http://localhost:3001`

## Available Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/jobs` | List all job postings |
| GET | `/jobs/:id` | Get a single job |
| GET | `/jobs?is_active=true` | Filter active jobs |
| GET | `/blog` | List all blog posts |
| GET | `/blog/:id` | Get a single blog post |
| GET | `/blog?slug=:slug` | Get blog post by slug |
| GET | `/blog?is_published=true` | Filter published posts |
| POST | `/contact-messages` | Submit contact form |
| POST | `/candidates` | Submit job application |
| POST | `/employer-requests` | Submit employer request |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | List admin users |
| POST | `/users` | Create admin user |
| GET | `/candidates` | List all candidates |
| GET | `/candidates/:id` | Get candidate details |
| DELETE | `/candidates/:id` | Delete candidate |
| GET | `/employer-requests` | List employer requests |
| GET | `/employer-requests/:id` | Get request details |
| DELETE | `/employer-requests/:id` | Delete request |
| GET | `/notifications` | List notifications |
| PATCH | `/notifications/:id` | Mark notification read |
| GET | `/audit-logs` | List audit logs |
| GET | `/settings` | Get all settings |
| PATCH | `/settings` | Update settings |

### Reference Data

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/nationalities` | List nationalities |
| GET | `/experience-levels` | List experience levels |
| GET | `/blog-categories` | List blog categories |
| GET | `/social-links` | List social media links |
| GET | `/dashboard` | Get dashboard stats |

## Query Examples

### Pagination
```bash
# Get page 2 with 10 items per page
GET /jobs?_page=2&_limit=10
```

### Sorting
```bash
# Sort jobs by created_at descending
GET /jobs?_sort=created_at&_order=desc
```

### Filtering
```bash
# Filter jobs by country
GET /jobs?country=United%20Kingdom

# Filter candidates by experience
GET /candidates?experience=3-7

# Multiple filters
GET /jobs?is_active=true&work_type=remote
```

### Full-text Search
```bash
# Search jobs by title
GET /jobs?q=accountant

# Search blog posts
GET /blog?q=tax
```

### Relationships
```bash
# Get candidate with related job (if using _expand)
GET /candidates/1?_expand=job
```

## Testing with cURL

### Get all active jobs
```bash
curl http://localhost:3001/jobs?is_active=true
```

### Submit a contact message
```bash
curl -X POST http://localhost:3001/contact-messages \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "company": "Test Company",
    "subject": "Test Subject",
    "message": "This is a test message",
    "is_read": false,
    "created_at": "2024-01-25T10:00:00Z",
    "updated_at": "2024-01-25T10:00:00Z"
  }'
```

### Submit a candidate application
```bash
curl -X POST http://localhost:3001/candidates \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "jane.doe@email.com",
    "nationality": "American",
    "country": "United States",
    "location": "Los Angeles",
    "experience": "3-7",
    "expected_salary": "3001-4000",
    "job_applied": "Senior Accountant",
    "job_id": 1,
    "cv_url": "/storage/cvs/cv-new.docx",
    "cover_letter_url": null,
    "created_at": "2024-01-25T10:00:00Z",
    "updated_at": "2024-01-25T10:00:00Z"
  }'
```

### Submit an employer request
```bash
curl -X POST http://localhost:3001/employer-requests \
  -H "Content-Type: application/json" \
  -d '{
    "firm_name": "New Accounting Firm",
    "email": "hr@newaccounting.com",
    "country": "United States",
    "preferred_location": "Chicago",
    "preferred_nationality": "Any",
    "budgeted_salary": "3001-4000",
    "years_experience": "3-7",
    "notes": "Looking for audit specialists",
    "created_at": "2024-01-25T10:00:00Z",
    "updated_at": "2024-01-25T10:00:00Z"
  }'
```

### Update a job posting
```bash
curl -X PATCH http://localhost:3001/jobs/1 \
  -H "Content-Type: application/json" \
  -d '{"is_active": false}'
```

### Delete a candidate
```bash
curl -X DELETE http://localhost:3001/candidates/1
```

## Frontend Configuration

The frontend automatically switches between JSON Server and Laravel API based on environment variables.

### Option 1: Use JSON Server (Development)

Update your `.env` file:

```bash
# Use JSON Server backend
VITE_API_BACKEND=json-server
VITE_JSON_SERVER_URL=http://localhost:3001

# Enable live mode to fetch from API
VITE_DATA_MODE=live
```

### Option 2: Use Laravel API (Production)

```bash
# Use Laravel backend
VITE_API_BACKEND=laravel
VITE_LARAVEL_API_URL=https://api.yoursite.com

# Enable live mode
VITE_DATA_MODE=live
```

### Option 3: Demo Mode (No Backend)

```bash
# Use local Zustand stores
VITE_DATA_MODE=demo
```

### Environment Variables Reference

| Variable | Values | Description |
|----------|--------|-------------|
| `VITE_API_BACKEND` | `json-server`, `laravel` | Backend type (default: `laravel`) |
| `VITE_JSON_SERVER_URL` | URL | JSON Server URL (default: `http://localhost:3001`) |
| `VITE_LARAVEL_API_URL` | URL | Laravel API URL |
| `VITE_DATA_MODE` | `demo`, `live` | Override mode (auto-detected if not set) |

## Data Structure

The `db.json` file contains the following collections:

| Collection | Description | Count |
|------------|-------------|-------|
| `users` | Admin users for authentication | 3 |
| `jobs` | Job postings | 8 |
| `candidates` | Job applications | 10 |
| `employer-requests` | Employer hiring requests | 6 |
| `blog` | Blog posts | 6 |
| `contact-messages` | Contact form submissions | 3 |
| `notifications` | Admin notifications | 5 |
| `audit-logs` | System audit trail | 5 |
| `settings` | Application settings | 1 (object) |
| `social-links` | Social media links | 3 |
| `blog-categories` | Blog categories | 4 |
| `experience-levels` | Experience level options | 4 |
| `nationalities` | Nationality options | 20 |
| `dashboard` | Dashboard statistics | 1 (object) |

## Notes

- JSON Server automatically generates IDs for new records
- All data is persisted to `db.json` when modified
- The `settings` and `dashboard` endpoints return objects (not arrays)
- Use `_embed` and `_expand` for relationships (requires naming conventions)

## Troubleshooting

### Port already in use
```bash
# Use a different port
npx json-server --watch db.json --port 3002
```

### CORS issues
JSON Server enables CORS by default. If you still have issues:
```bash
npx json-server --watch db.json --port 3001 --no-cors
```

### Reset data
Simply copy the original `db.json` from version control to reset all data.
