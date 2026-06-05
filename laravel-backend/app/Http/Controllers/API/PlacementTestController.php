<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\PlacementAnswer;
use App\Models\PlacementQuestion;
use App\Models\PlacementTest;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PlacementTestController extends Controller
{
    public function start(Request $request)
    {
        $questions = collect();
        foreach (['Web', 'Mobile', 'Data'] as $category) {
            $questions = $questions->concat(
                PlacementQuestion::where('path_category', $category)->inRandomOrder()->limit(5)->get()
            );
        }

        $test = PlacementTest::create([
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'test_id' => $test->id,
            'questions' => $questions,
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
                $category = $question->path_category;
                if (isset($categoryScores[$category])) {
                    $categoryScores[$category] += $question->points;
                }
                $totalScore += $question->points;
            }
        }

        $scorePercent = $maxScore > 0 ? round(($totalScore / $maxScore) * 100, 2) : 0;

        if ($scorePercent >= 70) {
            $level = 'advanced';
        } elseif ($scorePercent >= 40) {
            $level = 'intermediate';
        } else {
            $level = 'beginner';
        }

        $pathCategory = 'Web';
        $bestCategoryScore = -1;
        foreach ($categoryScores as $category => $points) {
            if ($points > $bestCategoryScore) {
                $bestCategoryScore = $points;
                $pathCategory = $category;
            }
        }

        $test->update([
            'score' => (int) round($scorePercent),
            'path_category' => $pathCategory,
            'level' => $level,
            'completed_at' => now(),
        ]);

        $langageRecommande = match ($pathCategory) {
            'Web' => 'JavaScript',
            'Mobile' => 'Flutter',
            'Data' => 'Python',
            default => 'JavaScript',
        };

        return response()->json([
            'score' => $scorePercent,
            'level' => $level,
            'recommended_path' => $pathCategory,
            'message' => 'Test soumis avec succès. Votre parcours a été personnalisé.',
            'niveau' => $level,
            'parcours_recommande' => $pathCategory,
            'langage_recommande' => $langageRecommande,
        ]);
    }

    public function result(Request $request)
    {
        try {
            $user = $request->user();

            $lastTest = PlacementTest::where('user_id', $user->id)
                ->latest()
                ->first();

            if (! $lastTest) {
                return response()->json([
                    'data' => null,
                    'message' => 'Aucun test effectué',
                ], 200);
            }

            return response()->json([
                'data' => [
                    'score' => $lastTest->score,
                    'level' => $lastTest->level,
                    'recommended_path' => $lastTest->path_category,
                    'niveau' => $lastTest->level,
                    'parcours_recommande' => $lastTest->path_category,
                ],
            ]);
        } catch (Exception $e) {
            Log::error('placement-test/result error: '.$e->getMessage());

            return response()->json(['data' => null], 200);
        }
    }
}
