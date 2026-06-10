<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\PlacementTest;
use Illuminate\Http\Request;
use Exception;

class RecommendationController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = $request->user();

            $lastTest = PlacementTest::where('user_id', $user->id)
                ->whereNotNull('completed_at')
                ->latest()
                ->first();

            $level = $lastTest?->level ?? 'beginner';

            $query = Course::query()->where('status', 'published');

            if ($level === 'beginner') {
                $query->where(function ($q) {
                    $q->where('title', 'like', '%HTML%')
                        ->orWhere('title', 'like', '%CSS%')
                        ->orWhere('level', 'beginner');
                });
            } elseif ($level === 'intermediate') {
                $query->where(function ($q) {
                    $q->where('title', 'like', '%React%')
                        ->orWhere('title', 'like', '%JavaScript%')
                        ->orWhere('level', 'intermediate');
                });
            } else {
                $query->where(function ($q) {
                    $q->where('title', 'like', '%Laravel%')
                        ->orWhere('title', 'like', '%Fullstack%')
                        ->orWhere('level', 'expert')
                        ->orWhere('level', 'intermediate');
                });
            }

            $courses = $query->take(3)->get();

            if ($courses->isEmpty()) {
                $courses = Course::where('status', 'published')->take(3)->get();
            }

            $formattedCourses = $courses->map(function ($course) {
                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'slug' => $course->slug,
                    'level' => $course->level,
                    'price' => $course->price,
                    'description' => $course->description,
                ];
            });

            return response()->json([
                'data' => $formattedCourses,
                'level' => $level,
            ]);

        } catch (Exception $e) {
            return response()->json(['data' => []]);
        }
    }
}
