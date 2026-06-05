<?php

namespace App\Services;

use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Support\Str;

class CertificateService
{
    public function issueIfCourseCompleted(Course $course, User $user): ?Certificate
    {
        $lessonIds = $course->lessons()->pluck('id');
        if ($lessonIds->isEmpty()) {
            return null;
        }

        $completedCount = \Illuminate\Support\Facades\DB::table('lesson_progress')
            ->where('user_id', $user->id)
            ->whereIn('lesson_id', $lessonIds)
            ->where('is_completed', true)
            ->count();

        if ($completedCount < $lessonIds->count()) {
            return null;
        }

        $certificate = Certificate::firstOrCreate(
            [
                'user_id' => $user->id,
                'course_id' => $course->id,
            ],
            [
                'certificate_number' => 'SPM-'.strtoupper(Str::random(10)),
                'status' => 'validated',
                'issued_at' => now(),
                'certificate_url' => null,
            ]
        );

        Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->update([
                'completed_at' => now(),
                'progress' => 100,
            ]);

        return $certificate;
    }
}
