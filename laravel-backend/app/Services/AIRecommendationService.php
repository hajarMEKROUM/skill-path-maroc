<?php

namespace App\Services;

use App\Models\Recommendation;
use Illuminate\Support\Facades\Http;

class AIRecommendationService
{
    public function generateForUser($user): array
    {
        $baseUrl = rtrim((string) (config('services.ai.url') ?? ''), '/');
        if ($baseUrl === '') {
            return [
                'user_id' => (string) $user->id,
                'recommended_focus' => 'Laravel',
                'confidence_score' => 50,
            ];
        }

        $payload = [
            'user_id' => (string) $user->id,
            'skills' => [],
            'quiz_scores' => ['php' => 60, 'react' => 55, 'sql' => 50],
        ];

        $response = Http::timeout(5)->post($baseUrl.'/api/v1/analyze-skills', $payload);

        if (! $response->successful()) {
            $response = Http::timeout(5)->get($baseUrl.'/api/v1/recommend-courses/'.$user->id);
        }

        $data = $response->json() ?: [
            'user_id' => (string) $user->id,
            'recommended_focus' => 'Laravel',
            'confidence_score' => 50,
        ];

        Recommendation::create([
            'user_id' => $user->id,
            'payload' => $data,
            'generated_at' => now(),
        ]);

        return $data;
    }
}
