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

    public function getCourseLessonsWithProgress(Course $course, $user)
    {
        $completed = $user
            ? DB::table('lesson_progress')
                ->where('user_id', $user->id)
                ->where('is_completed', true)
                ->pluck('lesson_id')
                ->all()
            : [];

        $modules = $course->modules()
            ->with(['lessons' => fn ($q) => $q->orderBy('sort_order')])
            ->orderBy('sort_order')
            ->get();

        $lessons = $course->lessons()->orderBy('sort_order')->get();

        return [
            'modules' => $modules,
            'lessons' => $lessons,
            'completed_ids' => $completed,
        ];
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
