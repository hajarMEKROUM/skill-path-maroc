<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Recommendation;
use App\Services\AIRecommendationService;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    public function show(Request $request, AIRecommendationService $service)
    {
        $latest = Recommendation::where('user_id', $request->user()->id)->latest()->first();

        return response()->json($latest?->payload ?? $service->generateForUser($request->user()));
    }

    public function refresh(Request $request, AIRecommendationService $service)
    {
        return response()->json($service->generateForUser($request->user()), 201);
    }
}
