<?php

namespace App\Services;

use App\Repositories\Contracts\CourseRepositoryInterface;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Enrollment;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class CourseService
{
    public function __construct(
        protected CourseRepositoryInterface $courseRepository,
        protected CertificateService $certificateService
    ) {
    }

    public function createCourse(array $data, $instructorId)
    {
        $data['instructor_id'] = $instructorId;
        $data['slug'] = Str::slug($data['title']) . '-' . uniqid();
        
        return $this->courseRepository->create($data);
    }

    public function getAllPublishedCourses()
    {
        return $this->courseRepository->getAllPublished();
    }

    public function findCourse($id)
    {
        return $this->courseRepository->findById($id);
    }

    public function updateCourse($id, array $data)
    {
        if (isset($data['title'])) {
            $data['slug'] = Str::slug($data['title']).'-'.$id;
        }
        return $this->courseRepository->update($id, $data);
    }

    public function deleteCourse($id)
    {
        return $this->courseRepository->delete($id);
    }

    public function enrollUser(Course $course, $user)
    {
        return Enrollment::firstOrCreate([
            'user_id' => $user->id,
            'course_id' => $course->id,
        ])->load('course');
    }

    public function getUserEnrollments($user)
    {
        return Enrollment::where('user_id', $user->id)
            ->with('course.instructor')
            ->latest()
            ->paginate(15);
    }

    public function getCourseLessons(Course $course, $user)
    {
        $completed = $user
            ? DB::table('lesson_progress')
                ->where('user_id', $user->id)
                ->where('is_completed', true)
                ->pluck('lesson_id')
                ->all()
            : [];

        return $course->lessons()
            ->with(['exercises', 'quiz', 'module'])
            ->get()
            ->sortBy(fn ($lesson) => [
                $lesson->module?->sort_order ?? 0,
                $lesson->sort_order,
            ])
            ->values()
            ->each(function ($lesson) use ($completed) {
                $lesson->setAttribute('is_completed', in_array($lesson->id, $completed, true));
            });
    }

    public function getLesson(Course $course, Lesson $lesson, $user)
    {
        abort_unless($lesson->course_id === $course->id, 404);

        $isCompleted = $user
            ? DB::table('lesson_progress')
                ->where('user_id', $user->id)
                ->where('lesson_id', $lesson->id)
                ->where('is_completed', true)
                ->exists()
            : false;

        $lesson->load(['exercises', 'quiz', 'module']);
        $lesson->setAttribute('is_completed', $isCompleted);

        return $lesson;
    }

    public function markLessonComplete(Lesson $lesson, $user): ?\App\Models\Certificate
    {
        DB::table('lesson_progress')->updateOrInsert(
            ['user_id' => $user->id, 'lesson_id' => $lesson->id],
            ['is_completed' => true, 'updated_at' => now(), 'created_at' => now()]
        );

        $course = $lesson->course;

        return $course
            ? $this->certificateService->issueIfCourseCompleted($course, $user)
            : null;
    }

    public function updateLessonProgress($lessonId, $user, $timeWatched)
    {
        DB::table('lesson_progress')->updateOrInsert(
            ['user_id' => $user->id, 'lesson_id' => $lessonId],
            ['time_watched' => $timeWatched, 'updated_at' => now(), 'created_at' => now()]
        );
    }
}
