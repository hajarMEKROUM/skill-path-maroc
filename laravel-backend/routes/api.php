<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CourseController;
use App\Http\Controllers\API\PlacementTestController;
use App\Http\Controllers\API\JobController;
use App\Http\Controllers\API\FreelanceProposalController;
use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\CertificationController;
use App\Http\Controllers\API\ForumController;
use App\Http\Controllers\API\RecommendationController;
use App\Http\Controllers\API\ChatController;
use App\Http\Controllers\API\AdminCourseController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\EmploymentJobController;
use App\Http\Controllers\API\FreelanceController;
use App\Http\Controllers\MarketplaceController;

Route::prefix('v1')->group(function () {

    // Routes publiques
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/{course}', [CourseController::class, 'show']);
    Route::get('/jobs', [JobController::class, 'index']);

    // Routes protégées
    Route::middleware('auth:sanctum')->group(function () {

        // Auth
        Route::get('/me', [AuthController::class, 'me']);
        Route::get('/user', [AuthController::class, 'me']); // Alias for compatibility
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::put('/user/profile', [AuthController::class, 'updateProfile']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
        Route::put('/user/password', [AuthController::class, 'updatePassword']);
        Route::post('/profile/avatar', [AuthController::class, 'uploadAvatar']);
        Route::delete('/user', [AuthController::class, 'destroyAccount']);
        Route::get('/users', [ChatController::class, 'searchUsers']);

        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index']);

        // Cours (actions protégées)
        Route::post('/courses', [CourseController::class, 'store']);
        Route::put('/courses/{course}', [CourseController::class, 'update']);
        Route::patch('/courses/{course}', [CourseController::class, 'update']);
        Route::delete('/courses/{course}', [CourseController::class, 'destroy']);
        Route::post('/courses/{course}/enroll', [CourseController::class, 'enroll']);
        Route::get('/my-courses', [CourseController::class, 'myCourses']);
        Route::get('/courses/{course}/lessons', [CourseController::class, 'lessons']);
        Route::get('/courses/{course}/lessons/{lesson}', [CourseController::class, 'lesson']);
        Route::post('/courses/{course}/lessons/{lesson}/complete', [CourseController::class, 'completeLesson']);
        Route::patch('/lessons/{lesson}/complete', [CourseController::class, 'completeLessonByLesson']);
        Route::post('/lesson-progress', [CourseController::class, 'updateProgress']);

        // Messagerie
        Route::prefix('chat')->group(function () {
            Route::get('/conversations', [ChatController::class, 'index']);
            Route::post('/conversations', [ChatController::class, 'startConversation']);
            Route::get('/conversations/{conversation}/messages', [ChatController::class, 'messages']);
            Route::post('/conversations/{conversation}/messages', [ChatController::class, 'storeMessage']);
        });

        // Test de positionnement + IA
        Route::post('/placement-test/start', [PlacementTestController::class, 'start']);
        Route::post('/placement-test/submit', [PlacementTestController::class, 'submit']);
        Route::get('/placement-test/result', [PlacementTestController::class, 'result']);
        Route::get('/recommendations', [RecommendationController::class, 'index']);

        // Certifications
        Route::get('/certifications', [CertificationController::class, 'index']);
        Route::post('/certifications/{id}/download', [CertificationController::class, 'download']);

        // Espace Freelance
        Route::apiResource('jobs', JobController::class)->except(['index']);
        Route::post('/proposals', [FreelanceProposalController::class, 'storeFromRequest']);
        Route::post('/jobs/{job}/apply', [FreelanceProposalController::class, 'store']);
        Route::get('/my-proposals', [FreelanceProposalController::class, 'myProposals']);
        Route::apiResource('marketplace', MarketplaceController::class);

        // Routes legacy (tests + frontend freelance.service)
        Route::prefix('freelance')->group(function () {
            Route::get('/missions', [JobController::class, 'index']);
            Route::post('/missions/{job}/proposals', [FreelanceProposalController::class, 'store']);
            Route::get('/users', [ChatController::class, 'searchUsers']);
        });

        // Offres d'emploi
        Route::get('/employment', [EmploymentJobController::class, 'index']);
        Route::post('/employment', [EmploymentJobController::class, 'store']);
        Route::get('/employment-jobs', [EmploymentJobController::class, 'index']);
        Route::post('/employment-jobs', [EmploymentJobController::class, 'store']);

        // Forum communautaire
        Route::get('/forum/topics', [ForumController::class, 'index']);
        Route::post('/forum/topics', [ForumController::class, 'store']);
        Route::get('/forum/topics/{topic}', [ForumController::class, 'show']);
        Route::put('/forum/topics/{topic}', [ForumController::class, 'update']);
        Route::post('/forum/topics/{topic}/comments', [ForumController::class, 'addComment']);
        Route::delete('/forum/topics/{topic}', [ForumController::class, 'destroy']);

        // Admin
        Route::middleware('role:admin')->prefix('admin')->group(function () {
            Route::get('/stats', [AdminController::class, 'stats']);
            Route::get('/users', [AdminController::class, 'users']);
            Route::post('/users', [AdminController::class, 'storeUser']);
            Route::get('/user/{user}', [AdminController::class, 'user']);
            Route::put('/user/{user}', [AdminController::class, 'updateUser']);
            Route::patch('/user/{user}', [AdminController::class, 'updateUser']);
            Route::delete('/user/{user}', [AdminController::class, 'destroyUser']);
            Route::put('/user/{user}/role', [AdminController::class, 'updateRole']);
            Route::apiResource('courses', AdminCourseController::class);
            Route::post('/jobs', [AdminController::class, 'storeJob']);
            Route::put('/user/{user}/ban', [AdminController::class, 'ban']);
            Route::put('/user/{user}/verify', [AdminController::class, 'verify']);
            Route::get('/jobs/pending', [AdminController::class, 'pendingJobs']);
            Route::put('/jobs/{job}/approve', [AdminController::class, 'approveJob']);
            Route::put('/jobs/{job}/reject', [AdminController::class, 'rejectJob']);
            Route::get('/freelance', [FreelanceController::class, 'index']);
            Route::get('/certifications', [AdminController::class, 'certifications']);
            Route::put('/certifications/{id}/approve', [AdminController::class, 'approveCertification']);
            Route::put('/forum/topics/{topic}', [ForumController::class, 'update']);
        });
    });
});
