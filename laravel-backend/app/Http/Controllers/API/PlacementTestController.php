<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\PlacementTest;
use App\Models\PlacementQuestion;
use App\Models\PlacementAnswer;
use App\Models\AiRecommendation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PlacementTestController extends Controller
{
    public function start(Request $request)
    {
        // Fetch 5 random questions for each category (Web, Mobile, Data)
        $questions = collect();
        foreach (['Web', 'Mobile', 'Data'] as $category) {
            $questions = $questions->concat(PlacementQuestion::where('path_category', $category)->inRandomOrder()->limit(5)->get());
        }
        
        $test = PlacementTest::create([
            'user_id' => $request->user()->id,
        ]);
        
        return response()->json([
            'test_id' => $test->id,
            'questions' => $questions
        ]);
    }

    public function submit(Request $request)
    {
        $validated = $request->validate([
            'test_id' => 'required|exists:placement_tests,id',
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:placement_questions,id',
            'answers.*.selected_answer' => 'required|string',
        ]);

        $test = PlacementTest::findOrFail($validated['test_id']);
        if ($test->user_id !== $request->user()->id) {
            abort(403);
        }

        $categoryScores = [
            'Web' => 0,
            'Mobile' => 0,
            'Data' => 0,
        ];
        
        $totalScore = 0;
        $maxScore = 0;

        foreach ($validated['answers'] as $answerData) {
            $question = PlacementQuestion::find($answerData['question_id']);
            $isCorrect = $question->correct_answer === $answerData['selected_answer'];
            
            PlacementAnswer::create([
                'placement_test_id' => $test->id,
                'placement_question_id' => $question->id,
                'selected_answer' => $answerData['selected_answer'],
                'is_correct' => $isCorrect,
            ]);
            
            $maxScore += $question->points;
            
            if ($isCorrect) {
                $categoryScores[$question->path_category] += $question->points;
                $totalScore += $question->points;
            }
        }
        
        // Normalize scores to 100
        $normalizedCategoryScores = [
            'Web' => ($categoryScores['Web'] / max(1, 5)) * 100,
            'Mobile' => ($categoryScores['Mobile'] / max(1, 5)) * 100,
            'Data' => ($categoryScores['Data'] / max(1, 5)) * 100,
        ];

        $test->update([
            'score' => $maxScore > 0 ? ($totalScore / $maxScore) * 100 : 0,
            'completed_at' => now(),
        ]);

        // Call AI Service
        $aiUrl = env('AI_SERVICE_URL', 'http://localhost:8000') . '/api/v1/analyze-placement';
        $response = Http::post($aiUrl, [
            'user_id' => (string)$request->user()->id,
            'category_scores' => $normalizedCategoryScores,
        ]);
        
        $aiData = $response->json();
        
        $recommendation = AiRecommendation::create([
            'user_id' => $request->user()->id,
            'placement_test_id' => $test->id,
            'niveau' => $aiData['niveau'] ?? 'Débutant',
            'langage_recommande' => $aiData['langage_recommande'] ?? 'JavaScript',
            'parcours_recommande' => $aiData['parcours_recommande'] ?? 'Web',
            'score' => $aiData['score'] ?? 0,
        ]);

        return response()->json([
            'message' => 'Test submitted successfully',
            'test_result' => $test,
            'recommendation' => $recommendation
        ]);
    }

    public function recommendations(Request $request)
    {
        $recommendation = AiRecommendation::where('user_id', $request->user()->id)->latest()->first();
        return response()->json($recommendation);
    }
}
