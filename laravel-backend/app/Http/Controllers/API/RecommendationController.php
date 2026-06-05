<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\PlacementTest;
use Illuminate\Http\Request;
use Exception;

class RecommendationController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            
            // 1. Récupérer le dernier test de placement de l'utilisateur
            $lastTest = PlacementTest::where('user_id', $user->id)
                ->latest()
                ->first();

            // 2. Filtrer les cours selon la catégorie du parcours (path_category)
            if ($lastTest && !empty($lastTest->path_category)) {
                $category = $lastTest->path_category;

                if ($category === 'Web') {
                    $courses = Course::whereIn('level', ['beginner', 'intermediate'])->take(3)->get();
                } elseif ($category === 'Mobile') {
                    $courses = Course::where(function($query) {
                        $query->where('title', 'LIKE', '%flutter%')
                              ->orWhere('title', 'LIKE', '%mobile%');
                    })->take(3)->get();
                } elseif ($category === 'Data') {
                    $courses = Course::where(function($query) {
                        $query->where('title', 'LIKE', '%python%')
                              ->orWhere('title', 'LIKE', '%data%');
                    })->take(3)->get();
                } else {
                    $courses = Course::where('is_published', true)->take(3)->get();
                }
            } else {
                // 4. Si aucun test, retourner les 3 premiers cours par défaut
                $courses = Course::take(3)->get();
            }

            // 3. Formatage de la réponse
            $formattedCourses = $courses->map(function ($course) {
                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'slug' => $course->slug,
                    'level' => $course->level,
                    'price' => $course->price,
                    'description' => $course->description,
                ];
            });

            return response()->json(['data' => $formattedCourses]);

        } catch (Exception $e) {
            // 5. Retourner un tableau vide en cas d'erreur
            return response()->json(['data' => []]);
        }
    }
}