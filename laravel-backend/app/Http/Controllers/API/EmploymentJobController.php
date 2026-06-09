<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\EmploymentJob;
use Illuminate\Http\Request;

class EmploymentJobController extends Controller
{
    public function index()
    {
        $jobs = EmploymentJob::with(['user:id,name', 'client:id,name'])
            ->where('status', 'open')
            ->latest()
            ->get();

        return response()->json($jobs);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'contract_type' => 'required|string|max:50',
        ]);

        $job = EmploymentJob::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'status' => 'open',
        ]);

        return response()->json($job->load(['user:id,name', 'client:id,name']), 201);
    }
}
