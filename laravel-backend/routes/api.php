<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // Auth Routes (public)
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Protected Routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        // Placement Test
        Route::post('/placement-test/start', [\App\Http\Controllers\API\PlacementTestController::class, 'start']);
        Route::post('/placement-test/submit', [\App\Http\Controllers\API\PlacementTestController::class, 'submit']);
        Route::get('/recommendations', [\App\Http\Controllers\API\PlacementTestController::class, 'recommendations']);

        // Courses CRUD
        Route::apiResource('courses', \App\Http\Controllers\API\CourseController::class);

        // Jobs CRUD (existing)
        Route::apiResource('jobs', \App\Http\Controllers\API\JobController::class);

        // Freelance Marketplace — routes used by FreelanceMarketplaceTest
        Route::prefix('freelance')->group(function () {
            Route::get('/missions', [\App\Http\Controllers\API\JobController::class, 'index']);
            Route::post('/missions/{job}/proposals', [\App\Http\Controllers\API\FreelanceProposalController::class, 'store']);
        });
    });
});
