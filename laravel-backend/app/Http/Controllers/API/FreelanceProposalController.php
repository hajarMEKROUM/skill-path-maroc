<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FreelanceJob;
use App\Models\Proposal;

class FreelanceProposalController extends Controller
{
    public function store(Request $request, FreelanceJob $job)
    {
        // 403 — user cannot apply to their own job
        if ($job->client_id === $request->user()->id) {
            return response()->json([
                'message' => 'You cannot apply to your own mission.'
            ], 403);
        }

        // 422 — validate required fields
        $validated = $request->validate([
            'bid_amount'   => 'required|numeric|min:1',
            'delivery_days' => 'required|integer|min:1',
            'cover_letter' => 'required|string|max:1000',
        ]);

        // Save to proposals table via Eloquent
        $proposal = Proposal::create([
            'job_id'       => $job->id,
            'freelancer_id' => $request->user()->id,
            'cover_letter' => $validated['cover_letter'],
            'bid_amount'   => $validated['bid_amount'],
            'delivery_days' => $validated['delivery_days'],
            'status'       => 'pending',
        ]);

        return response()->json([
            'message'  => 'Proposal submitted successfully',
            'proposal' => [
                'id'         => $proposal->id,
                'bid_amount' => $proposal->bid_amount,
                'status'     => $proposal->status,
            ],
        ], 201);
    }

    public function myProposals(Request $request)
    {
        $proposals = Proposal::where('freelancer_id', $request->user()->id)
            ->with(['job.client'])
            ->latest()
            ->paginate(15);

        return response()->json($proposals);
    }
}