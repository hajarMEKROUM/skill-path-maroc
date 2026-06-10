<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\Exercise;
use App\Models\Lesson;
use App\Services\CourseService;
use App\Services\LessonProgressService;
use App\Http\Requests\Course\StoreCourseRequest;
use App\Http\Requests\Course\UpdateCourseRequest;
use App\Http\Resources\CourseResource;
use App\Http\Resources\LessonResource;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class CourseController extends Controller
{
    use AuthorizesRequests;

    protected $courseService;

    protected $lessonProgressService;

    public function __construct(CourseService $courseService, LessonProgressService $lessonProgressService)
    {
        $this->courseService = $courseService;
        $this->lessonProgressService = $lessonProgressService;
    }

    public function index(Request $request)
    {
        $query = Course::query()->with('instructor');

        $isAdminList = $request->user()
            && \App\Support\RoleNormalizer::isAdmin($request->user()->role)
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
            ->with(['lessons', 'modules.lessons', 'instructor'])
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
        $enrollments = $user->enrollments()
            ->with(['course.instructor', 'course.lessons'])
            ->get();

        $courses = $enrollments->map(function ($enrollment) {
            $course = $enrollment->course;
            if (! $course) {
                return null;
            }

            return [
                ...$course->toArray(),
                'progress' => $enrollment->progress ?? 0,
                'enrollment' => [
                    'progress' => $enrollment->progress ?? 0,
                    'enrolled_at' => $enrollment->enrolled_at,
                    'completed_at' => $enrollment->completed_at,
                ],
                'lessons_count' => $course->lessons?->count() ?? 0,
            ];
        })->filter()->values();

        return response()->json(['data' => $courses]);
    }

    public function lessons(Request $request, Course $course)
    {
        $lessons = $this->courseService->getCourseLessons($course, $request->user());

        return response()->json(LessonResource::collection($lessons)->resolve());
    }

    public function lesson(Request $request, Course $course, Lesson $lesson)
    {
        $lesson = $this->courseService->getLesson($course, $lesson, $request->user());

        return new LessonResource($lesson);
    }

    public function completeLesson(Request $request, Course $course, Lesson $lesson)
    {
        abort_unless($lesson->course_id === $course->id, 404);

        return $this->completeLessonForUser($request, $lesson);
    }

    public function completeLessonByLesson(Request $request, Lesson $lesson)
    {
        return $this->completeLessonForUser($request, $lesson);
    }

    public function certificate(Request $request, Course $course)
    {
        $certificate = Certificate::where('user_id', $request->user()->id)
            ->where('course_id', $course->id)
            ->with('course')
            ->first();

        if (! $certificate) {
            return response()->json(['message' => 'Certificat non disponible.'], 404);
        }

        return response()->json($this->formatCertificate($certificate));
    }

    public function submitExercise(Request $request, Exercise $exercise)
    {
        $validated = $request->validate([
            'answer' => 'required|string|max:2000',
        ]);

        $result = $this->lessonProgressService->submitExercise(
            $exercise,
            $request->user(),
            $validated['answer']
        );

        return response()->json($result);
    }

    public function validateQuizAnswer(Request $request, Lesson $lesson)
    {
        $validated = $request->validate([
            'question_index' => 'required|integer|min:0',
            'selected' => 'required|string|max:500',
        ]);

        $result = $this->lessonProgressService->validateQuizAnswer(
            $lesson,
            $request->user(),
            $validated['question_index'],
            $validated['selected']
        );

        return response()->json($result);
    }

    protected function completeLessonForUser(Request $request, Lesson $lesson)
    {
        abort_unless($lesson->course_id, 404);

        $result = $this->courseService->markLessonComplete($lesson, $request->user());
        $certificate = $result['certificate'];

        return response()->json([
            'message' => 'Contenu de la leçon marqué comme lu',
            'progress' => $result['progress'],
            'certificate' => $this->formatCertificate($certificate),
            'course_completed' => (bool) $certificate,
        ]);
    }

    protected function formatCertificate(?Certificate $certificate): ?array
    {
        if (! $certificate) {
            return null;
        }

        $certificate->loadMissing('course');

        return [
            'id' => $certificate->id,
            'certificate_number' => $certificate->certificate_number,
            'course_title' => $certificate->course?->title,
            'issued_at' => $certificate->issued_at,
        ];
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
