<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\FreelanceJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

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
            'deadline' => 'nullable|date|after:today'
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
}
