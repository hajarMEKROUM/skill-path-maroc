<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\CourseService;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    protected $courseService;

    public function __construct(CourseService $courseService)
    {
        $this->courseService = $courseService;
        // Optionally protect certain routes with middleware here
        // $this->middleware('permission:create courses')->only('store');
    }

    public function index()
    {
        $courses = $this->courseService->getAllPublishedCourses();
        return response()->json($courses);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'numeric|min:0',
            'level' => 'in:beginner,intermediate,expert'
        ]);

        $course = $this->courseService->createCourse($validated, $request->user()->id);

        return response()->json([
            'message' => 'Course created successfully',
            'course' => $course
        ], 201);
    }

    // show, update, destroy...
}
