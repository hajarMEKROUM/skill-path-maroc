<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Certificate;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $total_courses_enrolled = $user->enrollments()->count();
        $total_certificates = Certificate::where('user_id', $user->id)->count();

        // Count enrollments that are not 100% complete
        $active_courses = $user->enrollments()->where(function ($query) {
            $query->where('progress', '<', 100)->orWhereNull('progress');
        })->count();

        // Calculate average learning progress
        $learning_progress = $user->enrollments()->avg('progress') ?? 0;

        return response()->json([
            'success' => true,
            'data' => [
                'total_courses_enrolled' => $total_courses_enrolled,
                'total_certificates' => $total_certificates,
                'active_courses' => $active_courses,
                'learning_progress' => round($learning_progress),
                'recent_courses' => []
            ]
        ]);
    }
}
