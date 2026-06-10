<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\FreelanceJob;
use App\Models\Proposal;
use Illuminate\Http\Request;
use App\Support\RoleNormalizer;

class JobController extends Controller
{
    public function index(Request $request)
    {
        $query = FreelanceJob::query()
            ->where('status', 'open')
            ->where('approval_status', 'approved')
            ->with('client');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($builder) use ($search) {
                $builder->where('title', 'like', '%'.$search.'%')
                    ->orWhere('description', 'like', '%'.$search.'%');
            });
        }

        if ($request->filled('category')) {
            $category = $request->input('category');
            $keywords = $this->categoryKeywords($category);

            $query->where(function ($builder) use ($keywords) {
                foreach ($keywords as $keyword) {
                    $builder->orWhere('title', 'like', '%'.$keyword.'%')
                        ->orWhere('description', 'like', '%'.$keyword.'%');
                }
            });
        }

        if ($request->filled('budget_min')) {
            $query->where(function ($builder) use ($request) {
                $builder->where('budget_max', '>=', $request->input('budget_min'))
                    ->orWhere('budget_min', '>=', $request->input('budget_min'));
            });
        }

        if ($request->filled('budget_max')) {
            $query->where(function ($builder) use ($request) {
                $builder->where('budget_min', '<=', $request->input('budget_max'))
                    ->orWhere('budget_max', '<=', $request->input('budget_max'));
            });
        }

        $perPage = $request->integer('per_page', 15);

        return response()->json($query->latest()->paginate($perPage));
    }

    protected function categoryKeywords(string $category): array
    {
        return match ($category) {
            'web-dev' => ['web', 'react', 'laravel', 'javascript', 'frontend', 'vue'],
            'mobile-dev' => ['mobile', 'flutter', 'dart', 'ios', 'android', 'react native'],
            'ui-ux' => ['ui', 'ux', 'design', 'figma', 'interface'],
            'backend' => ['backend', 'api', 'php', 'node', 'server'],
            'data' => ['data', 'python', 'machine', 'ai', 'analytics'],
            default => [$category],
        };
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'budget_min' => 'nullable|numeric|min:0',
            'budget_max' => 'nullable|numeric|gte:budget_min',
            'deadline' => 'nullable|date|after:today',
            'status' => 'nullable|in:open,in_progress,completed,cancelled',
        ]);

        $isAdmin = RoleNormalizer::isAdmin($request->user()->role ?? null);

        if (! $isAdmin) {
            unset($validated['status']);
        }

        $job = FreelanceJob::create(array_merge(
            $validated,
            [
                'client_id' => $request->user()->id,
                'status' => 'open',
                'approval_status' => $isAdmin ? 'approved' : 'pending',
            ]
        ));

        return response()->json([
            'message' => $isAdmin
                ? 'Offre publiée avec succès.'
                : 'Offre soumise. En attente de validation par un administrateur.',
            'job' => $job,
        ], 201);
    }

    public function show($id)
    {
        $job = FreelanceJob::with(['client', 'proposals.freelancer'])->findOrFail($id);

        return response()->json($job);
    }

    public function update(Request $request, $id)
    {
        $job = FreelanceJob::findOrFail($id);

        $isAdmin = RoleNormalizer::isAdmin($request->user()->role ?? null);

        if (! $isAdmin && ! $request->user()->can('manage marketplace') && $job->client_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'budget_min' => 'nullable|numeric|min:0',
            'budget_max' => 'nullable|numeric|gte:budget_min',
            'deadline' => 'nullable|date',
            'status' => 'sometimes|in:open,in_progress,completed,cancelled',
        ]);

        $job->update($validated);

        return response()->json($job->load('client'));
    }

    public function destroy(Request $request, $id)
    {
        $job = FreelanceJob::findOrFail($id);

        $isAdmin = RoleNormalizer::isAdmin($request->user()->role ?? null);

        if (! $isAdmin && ! $request->user()->can('manage marketplace') && $job->client_id !== $request->user()->id) {
            abort(403);
        }

        $job->delete();

        return response()->json(['message' => 'Job deleted successfully']);
    }

    public function submitProposal(Request $request, FreelanceJob $job)
    {
        if ($job->client_id === $request->user()->id) {
            abort(403, 'You cannot apply to your own mission.');
        }

        $validated = $request->validate([
            'bid_amount' => 'required|numeric|min:1',
            'delivery_days' => 'required|integer|min:1|max:365',
            'cover_letter' => 'required|string|max:1000',
        ]);

        $proposal = Proposal::create([
            'job_id' => $job->id,
            'freelancer_id' => $request->user()->id,
            'cover_letter' => $validated['cover_letter'],
            'bid_amount' => $validated['bid_amount'],
            'delivery_days' => $validated['delivery_days'],
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Proposal submitted successfully',
            'proposal' => $proposal,
        ], 201);
    }
}
