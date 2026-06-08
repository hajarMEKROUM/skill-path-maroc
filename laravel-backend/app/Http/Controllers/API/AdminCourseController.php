<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Services\CourseService;
use Illuminate\Http\Request;

class AdminCourseController extends Controller
{
    public function __construct(protected CourseService $courseService)
    {
    }

    public function index()
    {
        return response()->json(Course::with('instructor')->latest()->paginate(15));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'nullable|string',
        ]);
        $course = $this->courseService->createCourse($validated, $request->user()->id);
        return response()->json($course, 201);
    }

    public function show($id)
    {
        $course = Course::findOrFail($id);
        return response()->json($course);
    }

    public function update(Request $request, $id)
    {
        $course = $this->courseService->updateCourse($id, $request->all());
        return response()->json($course);
    }

    public function destroy($id)
    {
        $this->courseService->deleteCourse($id);
        return response()->json(['message' => 'Course deleted successfully']);
    }
}
