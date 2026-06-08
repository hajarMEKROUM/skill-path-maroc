<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\FreelanceJob;
use App\Models\Proposal;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $role = $user->roles->first()?->name ?? $user->getRawOriginal('role') ?? 'student';

        return match ($role) {
            'admin' => response()->json($this->adminPayload()),
            'instructor' => response()->json($this->instructorPayload($user)),
            'freelancer' => response()->json($this->freelancerPayload($user)),
            'enterprise', 'entreprise' => response()->json($this->enterprisePayload($user)),
            default => response()->json($this->studentPayload($user)),
        };
    }

    protected function studentPayload(User $user): array
    {
        $enrollments = $user->enrollments()->with('course')->get();

        $learningProgress = $enrollments
            ->filter(fn (Enrollment $enrollment) => $enrollment->course !== null)
            ->map(fn (Enrollment $enrollment) => [
                'id' => $enrollment->course->id,
                'title' => $enrollment->course->title,
                'slug' => $enrollment->course->slug,
                'thumbnail' => $enrollment->course->thumbnail,
                'progress' => (int) ($enrollment->progress ?? 0),
                'level' => $enrollment->course->level,
                'completed' => (bool) $enrollment->completed_at || (int) ($enrollment->progress ?? 0) >= 100,
            ])
            ->values();

        $activeCourses = $learningProgress
            ->filter(fn (array $course) => ! $course['completed'])
            ->count();

        $totalCertificates = Certificate::where('user_id', $user->id)->count();

        $overallProgress = $learningProgress->isNotEmpty()
            ? (int) round($learningProgress->avg('progress'))
            : 0;

        return [
            'role' => 'student',
            'total_courses_enrolled' => $enrollments->count(),
            'total_certificates' => $totalCertificates,
            'active_courses' => $activeCourses,
            'overall_progress' => $overallProgress,
            'learning_progress' => $learningProgress,
        ];
    }

    protected function adminPayload(): array
    {
        return [
            'role' => 'admin',
            'stats' => [
                'total_users' => User::count(),
                'total_courses' => Course::count(),
                'published_courses' => Course::where('status', 'published')->count(),
                'active_jobs' => FreelanceJob::where('status', 'open')->count(),
            ],
            'recent_activity' => [],
        ];
    }

    protected function instructorPayload(User $user): array
    {
        $courses = Course::where('instructor_id', $user->id)->get();
        $courseIds = $courses->pluck('id');

        $totalStudents = $courseIds->isEmpty()
            ? 0
            : Enrollment::whereIn('course_id', $courseIds)->distinct()->count('user_id');

        $publishedCourses = $courses->where('status', 'published')->count();

        return [
            'role' => 'instructor',
            'stats' => [
                'total_courses' => $courses->count(),
                'published_courses' => $publishedCourses,
                'total_students' => $totalStudents,
                'active_courses' => $publishedCourses,
            ],
            'courses' => $courses->take(5)->map(fn (Course $course) => [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'status' => $course->status,
                'enrollments_count' => $course->enrollments()->count(),
            ])->values(),
            'recent_activity' => [],
        ];
    }

    protected function freelancerPayload(User $user): array
    {
        $proposals = Proposal::where('freelancer_id', $user->id)->get();

        $activeProposals = $proposals->whereIn('status', ['pending', 'accepted'])->count();
        $acceptedProposals = $proposals->where('status', 'accepted')->count();

        return [
            'role' => 'freelancer',
            'stats' => [
                'proposals_sent' => $proposals->count(),
                'active_proposals' => $activeProposals,
                'active_contracts' => $acceptedProposals,
                'open_jobs' => FreelanceJob::where('status', 'open')->count(),
            ],
            'recent_proposals' => $proposals
                ->sortByDesc('created_at')
                ->take(5)
                ->map(fn (Proposal $proposal) => [
                    'id' => $proposal->id,
                    'status' => $proposal->status,
                    'bid_amount' => $proposal->bid_amount,
                    'job_title' => $proposal->job?->title,
                    'created_at' => $proposal->created_at,
                ])
                ->values(),
            'recent_activity' => [],
        ];
    }

    protected function enterprisePayload(User $user): array
    {
        $jobs = FreelanceJob::where('client_id', $user->id)->get();
        $jobIds = $jobs->pluck('id');

        $proposalsReceived = $jobIds->isEmpty()
            ? 0
            : Proposal::whereIn('job_id', $jobIds)->count();

        return [
            'role' => 'enterprise',
            'stats' => [
                'open_jobs' => $jobs->where('status', 'open')->count(),
                'active_contracts' => $jobs->where('status', 'in_progress')->count(),
                'completed_projects' => $jobs->where('status', 'completed')->count(),
                'proposals_received' => $proposalsReceived,
            ],
            'recent_jobs' => $jobs
                ->sortByDesc('created_at')
                ->take(5)
                ->map(fn (FreelanceJob $job) => [
                    'id' => $job->id,
                    'title' => $job->title,
                    'status' => $job->status,
                    'proposals_count' => $job->proposals()->count(),
                    'created_at' => $job->created_at,
                ])
                ->values(),
            'recent_activity' => [],
        ];
    }
}
