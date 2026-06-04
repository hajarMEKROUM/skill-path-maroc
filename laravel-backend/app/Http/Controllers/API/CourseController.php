<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Lesson;
use App\Services\CourseService;
use App\Http\Requests\Course\StoreCourseRequest;
use App\Http\Requests\Course\UpdateCourseRequest;
use App\Http\Resources\CourseResource;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class CourseController extends Controller
{
    use AuthorizesRequests;

    protected $courseService;

    public function __construct(CourseService $courseService)
    {
        $this->courseService = $courseService;
    }

    public function index()
    {
        $courses = $this->courseService->getAllPublishedCourses();
        return CourseResource::collection($courses);
    }

    public function store(StoreCourseRequest $request)
    {
        $course = $this->courseService->createCourse($request->validated(), $request->user()->id);

        return response()->json([
            'message' => 'Course created successfully',
            'course' => new CourseResource($course)
        ], 201);
    }

    public function show($id)
    {
        $course = $this->courseService->findCourse($id);
        return new CourseResource($course);
    }

    public function update(UpdateCourseRequest $request, $id)
    {
        // Authorization is handled in UpdateCourseRequest
        $course = $this->courseService->updateCourse($id, $request->validated());
        
        return new CourseResource($course);
    }

    public function destroy(Request $request, $id)
    {
        $course = Course::findOrFail($id);
        $this->authorize('delete', $course);

        $this->courseService->deleteCourse($id);

        return response()->json(['message' => 'Course deleted successfully']);
    }

    public function enroll(Request $request, Course $course)
    {
        $enrollment = $this->courseService->enrollUser($course, $request->user());

        return response()->json([
            'message' => 'Enrollment confirmed',
            'enrollment' => $enrollment,
        ], 201);
    }

    public function myCourses(Request $request)
    {
        $enrollments = $this->courseService->getUserEnrollments($request->user());
        return response()->json($enrollments);
    }

    public function lessons(Request $request, Course $course)
    {
        $data = $this->courseService->getCourseLessonsWithProgress($course, $request->user());
        return response()->json($data);
    }

    public function lesson(Course $course, Lesson $lesson)
    {
        abort_unless($lesson->course_id === $course->id, 404);
        return response()->json($lesson->load('quiz.questions'));
    }

    public function completeLesson(Request $request, Course $course, Lesson $lesson)
    {
        abort_unless($lesson->course_id === $course->id, 404);
        
        $this->courseService->markLessonComplete($lesson, $request->user());

        return response()->json(['message' => 'Lesson marked as complete']);
    }

    public function updateProgress(Request $request)
    {
        $validated = $request->validate([
            'lesson_id' => 'required|exists:lessons,id',
            'time_watched' => 'required|integer|min:0',
        ]);

        $this->courseService->updateLessonProgress($validated['lesson_id'], $request->user(), $validated['time_watched']);

        return response()->json(['message' => 'Progress saved']);
    }
}
