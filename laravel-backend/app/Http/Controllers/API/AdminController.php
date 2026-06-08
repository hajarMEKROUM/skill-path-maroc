<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\FreelanceJob;
use App\Models\User;
use App\Services\CourseService;
use App\Support\RoleNormalizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    public function __construct(protected CourseService $courseService)
    {
    }

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
        try {
            $currentUser = auth('sanctum')->user();
            if (!$currentUser) {
                return response()->json(['message' => 'Unauthenticated'], 401);
            }

            $query = User::query()->with('roles');

            if ($request->filled('search')) {
                $query->where(function ($builder) use ($request) {
                    $builder->where('name', 'like', '%'.$request->search.'%')
                        ->orWhere('email', 'like', '%'.$request->search.'%');
                });
            }

            if ($request->filled('role')) {
                $query->where('role', RoleNormalizer::normalize($request->role));
            }

            try {
                $users = $query->latest()->paginate($request->integer('per_page', 15));
            } catch (\Exception $e) {
                $users = $query->latest()->get();
            }

            return response()->json($users);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Internal Server Error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function user(User $user)
    {
        return response()->json($user->load('roles', 'courses', 'enrollments.course'));
    }

    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => ['required', Rule::in(RoleNormalizer::ROLES)],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => $validated['role'],
            'status' => 'active',
            'is_verified' => true,
        ]);

        $user->syncRoles([$validated['role']]);

        return response()->json([
            'message' => 'Utilisateur créé.',
            'user' => $user->load('roles'),
        ], 201);
    }

    public function updateRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => ['required', Rule::in(RoleNormalizer::ROLES)],
        ]);

        $actor = $request->user();
        $newRole = $validated['role'];

        if ($newRole === 'admin' && ! RoleNormalizer::isAdmin($actor->getAttributes()['role'] ?? $actor->role)) {
            return response()->json([
                'message' => 'Seuls les administrateurs peuvent attribuer le rôle admin.',
            ], 403);
        }

        if ($user->id === $actor->id && $newRole !== 'admin') {
            return response()->json([
                'message' => 'Vous ne pouvez pas retirer votre propre rôle administrateur.',
            ], 403);
        }

        $user->syncRoles([$newRole]);
        $user->update(['role' => $newRole]);

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

    public function storeCourse(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'nullable|numeric|min:0',
            'level' => 'nullable|in:beginner,intermediate,expert',
            'status' => 'nullable|in:draft,published,archived',
            'thumbnail' => 'nullable|string|max:2048',
            'instructor_id' => 'nullable|exists:users,id',
        ]);

        $instructorId = $validated['instructor_id'] ?? $request->user()->id;
        unset($validated['instructor_id']);

        $course = $this->courseService->createCourse($validated, $instructorId);

        return response()->json([
            'message' => 'Cours créé.',
            'course' => $course->load('instructor'),
        ], 201);
    }

    public function storeJob(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'budget_min' => 'nullable|numeric|min:0',
            'budget_max' => 'nullable|numeric|gte:budget_min',
            'deadline' => 'nullable|date|after:today',
            'status' => 'nullable|in:open,in_progress,completed,cancelled',
            'client_id' => 'nullable|exists:users,id',
        ]);

        $clientId = $validated['client_id'] ?? $request->user()->id;
        unset($validated['client_id']);

        $job = FreelanceJob::create(array_merge($validated, [
            'client_id' => $clientId,
            'status' => $validated['status'] ?? 'open',
        ]));

        return response()->json([
            'message' => 'Offre créée.',
            'job' => $job->load('client'),
        ], 201);
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
