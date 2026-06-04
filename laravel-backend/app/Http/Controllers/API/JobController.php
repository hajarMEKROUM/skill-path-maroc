<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\FreelanceJob;
use App\Models\Proposal;
use Illuminate\Http\Request;

class JobController extends Controller
{
    public function index()
    {
        $jobs = FreelanceJob::where('status', 'open')->with('client')->paginate(15);
        return response()->json($jobs);
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

        $job = FreelanceJob::create(array_merge(
            $validated,
            ['client_id' => $request->user()->id]
        ));

        return response()->json([
            'message' => 'Job posted successfully',
            'job' => $job
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

        if (! $request->user()->can('manage marketplace') && $job->client_id !== $request->user()->id) {
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

        if (! $request->user()->can('manage marketplace') && $job->client_id !== $request->user()->id) {
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
