<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\PlacementTest;
use App\Models\AiRecommendation;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ProcessAiRecommendation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $test;
    public $normalizedCategoryScores;
    
    public $tries = 3;
    public $timeout = 30;

    public function __construct(PlacementTest $test, array $normalizedCategoryScores)
    {
        $this->test = $test;
        $this->normalizedCategoryScores = $normalizedCategoryScores;
    }

    public function handle(): void
    {
        try {
            $aiUrl = env('AI_SERVICE_URL', 'http://localhost:8000') . '/api/v1/analyze-placement';
            
            $response = Http::timeout(10)->post($aiUrl, [
                'user_id' => (string)$this->test->user_id,
                'category_scores' => $this->normalizedCategoryScores,
            ]);

            if ($response->successful()) {
                $aiData = $response->json();
            } else {
                Log::warning("AI Service returned non-success code: " . $response->status());
                $aiData = $this->getFallbackData();
            }

        } catch (\Exception $e) {
            Log::error("AI Service failed: " . $e->getMessage());
            $aiData = $this->getFallbackData();
        }

        AiRecommendation::create([
            'user_id' => $this->test->user_id,
            'placement_test_id' => $this->test->id,
            'niveau' => $aiData['niveau'] ?? 'Débutant',
            'langage_recommande' => $aiData['langage_recommande'] ?? 'JavaScript',
            'parcours_recommande' => $aiData['parcours_recommande'] ?? 'Web',
            'score' => $aiData['score'] ?? $this->test->score,
        ]);
    }

    protected function getFallbackData(): array
    {
        // Simple fallback logic if AI is offline
        $bestCategory = 'Web';
        $bestScore = -1;
        
        foreach ($this->normalizedCategoryScores as $category => $score) {
            if ($score > $bestScore) {
                $bestScore = $score;
                $bestCategory = $category;
            }
        }
        
        $niveau = 'Débutant';
        if ($this->test->score >= 70) $niveau = 'Avancé';
        elseif ($this->test->score >= 40) $niveau = 'Intermédiaire';

        return [
            'niveau' => $niveau,
            'langage_recommande' => $bestCategory === 'Web' ? 'JavaScript' : ($bestCategory === 'Mobile' ? 'Dart' : 'Python'),
            'parcours_recommande' => $bestCategory,
            'score' => $this->test->score,
        ];
    }
}
