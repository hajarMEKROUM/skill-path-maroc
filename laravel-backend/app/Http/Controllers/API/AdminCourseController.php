<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Services\CourseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
            'price' => 'nullable|numeric|min:0',
            'level' => 'nullable|in:beginner,intermediate,expert',
            'status' => 'nullable|in:draft,published,archived',
            'photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $validated['thumbnail'] = '/storage/'.$request->file('photo')->store('courses', 'public');
        }

        $course = $this->courseService->createCourse($validated, $request->user()->id);

        return response()->json($course->load('instructor'), 201);
    }

    public function show($id)
    {
        $course = Course::findOrFail($id);
        return response()->json($course);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'level' => 'sometimes|in:beginner,intermediate,expert',
            'status' => 'sometimes|in:draft,published,archived',
            'photo' => 'nullable|image|max:2048',
        ]);

        $course = Course::findOrFail($id);

        if ($request->hasFile('photo')) {
            if ($course->thumbnail && str_starts_with($course->thumbnail, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $course->thumbnail));
            }

            $validated['thumbnail'] = '/storage/'.$request->file('photo')->store('courses', 'public');
        }

        $course = $this->courseService->updateCourse($id, $validated);

        return response()->json($course->load('instructor'));
    }

    public function destroy($id)
    {
        $this->courseService->deleteCourse($id);
        return response()->json(['message' => 'Course deleted successfully']);
    }
}
