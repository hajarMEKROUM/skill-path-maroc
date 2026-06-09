<?php

namespace App\Http\Controllers\API;

use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\FreelanceJob;
use App\Models\Proposal;
use Illuminate\Http\Request;

class FreelanceProposalController extends Controller
{
    public function store(Request $request, FreelanceJob $job)
    {
        return $this->persistProposal($request, $job);
    }

    public function storeFromRequest(Request $request)
    {
        $validated = $request->validate([
            'mission_id' => 'required|exists:freelance_jobs,id',
            'bid_amount' => 'required|numeric|min:1',
            'delivery_time' => 'nullable|integer|min:1|required_without:delivery_days',
            'delivery_days' => 'nullable|integer|min:1|required_without:delivery_time',
            'cover_letter' => 'required|string|max:1000',
        ]);

        $job = FreelanceJob::findOrFail($validated['mission_id']);

        return $this->persistProposal($request, $job, $validated);
    }

    protected function persistProposal(Request $request, FreelanceJob $job, ?array $validated = null)
    {
        if ($job->client_id === $request->user()->id) {
            return response()->json([
                'message' => 'You cannot apply to your own mission.',
            ], 403);
        }

        $validated ??= $request->validate([
            'bid_amount' => 'required|numeric|min:1',
            'delivery_time' => 'nullable|integer|min:1|required_without:delivery_days',
            'delivery_days' => 'nullable|integer|min:1|required_without:delivery_time',
            'cover_letter' => 'required|string|max:1000',
        ]);

        $deliveryDays = (int) ($validated['delivery_time'] ?? $validated['delivery_days'] ?? 0);

        if ($deliveryDays < 1) {
            return response()->json([
                'message' => 'Delivery time is required.',
            ], 422);
        }

        $proposal = Proposal::create([
            'job_id' => $job->id,
            'freelancer_id' => $request->user()->id,
            'cover_letter' => $validated['cover_letter'],
            'bid_amount' => $validated['bid_amount'],
            'delivery_days' => $deliveryDays,
            'status' => 'pending',
        ]);

        $userId = (int) $request->user()->id;
        $recipientId = (int) $job->client_id;

        $pair = [$userId, $recipientId];
        sort($pair);

        $conversation = Conversation::firstOrCreate(
            [
                'user_one_id' => $pair[0],
                'user_two_id' => $pair[1],
            ],
            ['job_id' => $job->id]
        );

        $formattedMessage = "Nouvelle proposition\nMission: {$job->title}\nOffre: {$proposal->bid_amount} DH\nDelai: {$proposal->delivery_days} jours\nLettre: {$proposal->cover_letter}";

        $message = $conversation->messages()->create([
            'user_id' => $userId,
            'body' => $formattedMessage,
        ]);

        $conversation->touch();
        $message->load('user:id,name');
        broadcast(new MessageSent($message))->toOthers();

        return response()->json([
            'message' => 'Proposal submitted successfully',
            'proposal' => [
                'id' => $proposal->id,
                'bid_amount' => $proposal->bid_amount,
                'status' => $proposal->status,
                'conversation_id' => $conversation->id,
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
