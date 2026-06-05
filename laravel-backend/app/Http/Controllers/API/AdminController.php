<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\FreelanceJob;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats()
    {
        return response()->json([
            'stats' => [
                'users' => User::count(),
                'courses' => Course::count(),
                'published_courses' => Course::where('status', 'published')->count(),
                'jobs' => FreelanceJob::count(),
            ],
            'recent_activity' => [],
        ]);
    }

    public function users(Request $request)
    {
        $query = User::query()->with('roles');

        if ($request->filled('search')) {
            $query->where(function ($builder) use ($request) {
                $builder->where('name', 'like', '%'.$request->search.'%')
                    ->orWhere('email', 'like', '%'.$request->search.'%');
            });
        }

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        return response()->json($query->latest()->paginate($request->integer('per_page', 15)));
    }

    public function user(User $user)
    {
        return response()->json($user->load('roles', 'courses', 'enrollments.course'));
    }

    public function updateRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => 'required|in:student,instructor,company,admin',
        ]);

        $user->syncRoles([$validated['role']]);
        $user->update(['role' => $validated['role']]);

        return response()->json($user->load('roles'));
    }

    public function ban(Request $request, User $user)
    {
        $user->update(['status' => 'banned']);

        return response()->json(['message' => 'User banned', 'user' => $user]);
    }

    public function verify(User $user)
    {
        $user->update(['is_verified' => true]);

        return response()->json(['message' => 'User verified', 'user' => $user]);
    }

    public function pendingJobs()
    {
        $jobs = FreelanceJob::with('client')
            ->where('status', 'open')
            ->latest()
            ->paginate(15);

        return response()->json($jobs);
    }

    public function approveJob(FreelanceJob $job)
    {
        $job->update(['status' => 'open']);

        return response()->json([
            'message' => 'Offre approuvée.',
            'job' => $job->load('client'),
        ]);
    }

    public function rejectJob(FreelanceJob $job)
    {
        $job->update(['status' => 'cancelled']);

        return response()->json([
            'message' => 'Offre rejetée.',
            'job' => $job->load('client'),
        ]);
    }

    public function certifications()
    {
        $certificates = Certificate::with(['user', 'course'])
            ->latest()
            ->paginate(15);

        return response()->json($certificates);
    }

    public function approveCertification($id)
    {
        $certificate = Certificate::findOrFail($id);
        $certificate->update(['status' => 'validated']);

        return response()->json([
            'message' => 'Certification approuvée.',
            'certification' => $certificate->load(['user', 'course']),
        ]);
    }
}
