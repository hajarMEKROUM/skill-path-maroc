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

    public function index(Request $request)
    {
        $query = Course::query()->with('instructor');

        $isAdminList = $request->user()
            && $request->user()->role === 'admin'
            && $request->boolean('admin');

        if (! $isAdminList) {
            $query->where('status', 'published');
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($builder) use ($search) {
                $builder->where('title', 'like', '%'.$search.'%')
                    ->orWhere('description', 'like', '%'.$search.'%')
                    ->orWhereHas('instructor', function ($q) use ($search) {
                        $q->where('name', 'like', '%'.$search.'%');
                    });
            });
        }

        if ($request->filled('level')) {
            $query->where('level', $request->input('level'));
        }

        if ($request->filled('category')) {
            $category = $request->input('category');
            $query->where(function ($builder) use ($category) {
                $builder->where('title', 'like', '%'.$category.'%')
                    ->orWhere('description', 'like', '%'.$category.'%')
                    ->orWhere('level', 'like', '%'.$category.'%');
            });
        }

        $perPage = $request->integer('per_page', 15);

        return CourseResource::collection(
            $query->latest()->paginate($perPage)
        );
    }

    public function store(StoreCourseRequest $request)
    {
        $course = $this->courseService->createCourse($request->validated(), $request->user()->id);

        return response()->json([
            'message' => 'Course created successfully',
            'course' => new CourseResource($course),
        ], 201);
    }

    public function show($courseIdentifier)
    {
        $course = Course::query()
            ->where(function ($query) use ($courseIdentifier) {
                $query->where('slug', $courseIdentifier);
                if (is_numeric($courseIdentifier)) {
                    $query->orWhere('id', $courseIdentifier);
                }
            })
            ->with(['lessons', 'instructor'])
            ->first();

        if (! $course || $course->status !== 'published') {
            return response()->json(['message' => 'Cours introuvable.'], 404);
        }

        return (new CourseResource($course))->response();
    }

    public function update(UpdateCourseRequest $request, $id)
    {
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
        $user = $request->user();
        $courses = $user->enrollments()
            ->with('course')
            ->get()
            ->pluck('course')
            ->filter();

        return response()->json(['data' => $courses->values()]);
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

        $this->courseService->updateLessonProgress(
            $validated['lesson_id'],
            $request->user(),
            $validated['time_watched']
        );

        return response()->json(['message' => 'Progress saved']);
    }
}
