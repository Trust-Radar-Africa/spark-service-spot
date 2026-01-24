<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Controllers - Public
use App\Http\Controllers\Api\PublicJobController;
use App\Http\Controllers\Api\PublicBlogController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\CandidateApplicationController;
use App\Http\Controllers\Api\EmployerRequestController;

// Controllers - Admin
use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\CandidateController;
use App\Http\Controllers\Api\Admin\JobController;
use App\Http\Controllers\Api\Admin\EmployerRequestController as AdminEmployerRequestController;
use App\Http\Controllers\Api\Admin\BlogController;
use App\Http\Controllers\Api\Admin\SettingsController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\NotificationController;
use App\Http\Controllers\Api\Admin\AuditLogController;

/*
|--------------------------------------------------------------------------
| Public API Routes (No Authentication Required)
|--------------------------------------------------------------------------
*/

// Jobs - Public Careers Page
Route::get('/jobs', [PublicJobController::class, 'index']);
Route::get('/jobs/filters', [PublicJobController::class, 'filters']);
Route::get('/jobs/{id}', [PublicJobController::class, 'show']);

// Blog - Public Blog Page
Route::get('/blog', [PublicBlogController::class, 'index']);
Route::get('/blog/categories', [PublicBlogController::class, 'categories']);
Route::get('/blog/featured', [PublicBlogController::class, 'featured']);
Route::get('/blog/{slug}', [PublicBlogController::class, 'show']);

// Contact Form Submission
Route::post('/contact', [ContactController::class, 'store']);

// Candidate Application Submission
Route::post('/candidates/apply', [CandidateApplicationController::class, 'store']);

// Employer Request Submission
Route::post('/employer-requests', [EmployerRequestController::class, 'store']);

/*
|--------------------------------------------------------------------------
| Admin Authentication Routes
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

/*
|--------------------------------------------------------------------------
| Admin Protected Routes (Sanctum Authentication Required)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    
    // Authentication
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);
    
    /*
    |--------------------------------------------------------------------------
    | Candidates Management
    |--------------------------------------------------------------------------
    */
    Route::get('/candidates', [CandidateController::class, 'index']);
    Route::get('/nationalities', [CandidateController::class, 'nationalities']);
    Route::delete('/candidates/{id}', [CandidateController::class, 'destroy'])
        ->middleware('admin.role:super_admin');
    Route::delete('/candidates/bulk', [CandidateController::class, 'bulkDestroy'])
        ->middleware('admin.role:super_admin');
    Route::post('/candidates/bulk-export', [CandidateController::class, 'bulkExport']);
    
    // CV/Cover Letter Downloads (requires candidates:download permission)
    Route::get('/candidates/{id}/cv', [CandidateController::class, 'downloadCv'])
        ->middleware('admin.role:super_admin,editor');
    Route::get('/candidates/{id}/cover-letter', [CandidateController::class, 'downloadCoverLetter'])
        ->middleware('admin.role:super_admin,editor');
    Route::post('/candidates/bulk-download', [CandidateController::class, 'bulkDownload'])
        ->middleware('admin.role:super_admin,editor');
    
    /*
    |--------------------------------------------------------------------------
    | Job Postings Management
    |--------------------------------------------------------------------------
    */
    Route::get('/jobs', [JobController::class, 'index']);
    Route::post('/jobs', [JobController::class, 'store'])
        ->middleware('admin.role:super_admin,editor');
    Route::put('/jobs/{id}', [JobController::class, 'update'])
        ->middleware('admin.role:super_admin,editor');
    Route::delete('/jobs/{id}', [JobController::class, 'destroy'])
        ->middleware('admin.role:super_admin');
    Route::patch('/jobs/{id}/toggle-status', [JobController::class, 'toggleStatus'])
        ->middleware('admin.role:super_admin,editor');
    Route::delete('/jobs/bulk', [JobController::class, 'bulkDestroy'])
        ->middleware('admin.role:super_admin');
    Route::post('/jobs/bulk-export', [JobController::class, 'bulkExport']);
    
    /*
    |--------------------------------------------------------------------------
    | Employer Requests Management
    |--------------------------------------------------------------------------
    */
    Route::get('/employer-requests', [AdminEmployerRequestController::class, 'index']);
    Route::delete('/employer-requests/{id}', [AdminEmployerRequestController::class, 'destroy'])
        ->middleware('admin.role:super_admin');
    Route::delete('/employer-requests/bulk', [AdminEmployerRequestController::class, 'bulkDestroy'])
        ->middleware('admin.role:super_admin');
    Route::post('/employer-requests/bulk-export', [AdminEmployerRequestController::class, 'bulkExport']);
    
    /*
    |--------------------------------------------------------------------------
    | Blog Posts Management
    |--------------------------------------------------------------------------
    */
    Route::get('/blog', [BlogController::class, 'index']);
    Route::post('/blog', [BlogController::class, 'store'])
        ->middleware('admin.role:super_admin,editor');
    Route::put('/blog/{id}', [BlogController::class, 'update'])
        ->middleware('admin.role:super_admin,editor');
    Route::delete('/blog/{id}', [BlogController::class, 'destroy'])
        ->middleware('admin.role:super_admin,editor');
    Route::delete('/blog/bulk', [BlogController::class, 'bulkDestroy'])
        ->middleware('admin.role:super_admin,editor');
    Route::patch('/blog/{id}/publish', [BlogController::class, 'togglePublish'])
        ->middleware('admin.role:super_admin,editor');
    
    // Image Upload for Blog
    Route::post('/upload-image', [BlogController::class, 'uploadImage']);
    
    /*
    |--------------------------------------------------------------------------
    | Settings Management (Super Admin Only for Updates)
    |--------------------------------------------------------------------------
    */
    Route::get('/settings', [SettingsController::class, 'index']);
    
    Route::put('/settings/branding', [SettingsController::class, 'updateBranding'])
        ->middleware('admin.role:super_admin');
    Route::post('/settings/branding/logo', [SettingsController::class, 'uploadLogo'])
        ->middleware('admin.role:super_admin');
    Route::delete('/settings/branding/logo', [SettingsController::class, 'deleteLogo'])
        ->middleware('admin.role:super_admin');
    
    Route::put('/settings/general', [SettingsController::class, 'updateGeneral'])
        ->middleware('admin.role:super_admin');
    
    Route::put('/settings/notifications', [SettingsController::class, 'updateNotifications'])
        ->middleware('admin.role:super_admin');
    
    // Social Links (Super Admin Only)
    Route::post('/settings/social-links', [SettingsController::class, 'createSocialLink'])
        ->middleware('admin.role:super_admin');
    Route::put('/settings/social-links/{id}', [SettingsController::class, 'updateSocialLink'])
        ->middleware('admin.role:super_admin');
    Route::delete('/settings/social-links/{id}', [SettingsController::class, 'deleteSocialLink'])
        ->middleware('admin.role:super_admin');
    
    // Blog Categories (Super Admin Only)
    Route::post('/settings/blog-categories', [SettingsController::class, 'createBlogCategory'])
        ->middleware('admin.role:super_admin');
    Route::put('/settings/blog-categories/{id}', [SettingsController::class, 'updateBlogCategory'])
        ->middleware('admin.role:super_admin');
    Route::delete('/settings/blog-categories/{id}', [SettingsController::class, 'deleteBlogCategory'])
        ->middleware('admin.role:super_admin');
    
    // Experience Levels (Super Admin Only)
    Route::post('/settings/experience-levels', [SettingsController::class, 'createExperienceLevel'])
        ->middleware('admin.role:super_admin');
    Route::put('/settings/experience-levels/{id}', [SettingsController::class, 'updateExperienceLevel'])
        ->middleware('admin.role:super_admin');
    Route::delete('/settings/experience-levels/{id}', [SettingsController::class, 'deleteExperienceLevel'])
        ->middleware('admin.role:super_admin');
    
    /*
    |--------------------------------------------------------------------------
    | Admin Users Management (Super Admin Only)
    |--------------------------------------------------------------------------
    */
    Route::middleware('admin.role:super_admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{id}/role', [UserController::class, 'updateRole']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });
    
    /*
    |--------------------------------------------------------------------------
    | Notifications
    |--------------------------------------------------------------------------
    */
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
    Route::delete('/notifications/clear', [NotificationController::class, 'clearAll']);
    
    /*
    |--------------------------------------------------------------------------
    | Audit Logs (Super Admin Only)
    |--------------------------------------------------------------------------
    */
    Route::get('/audit-logs', [AuditLogController::class, 'index'])
        ->middleware('admin.role:super_admin');
});
