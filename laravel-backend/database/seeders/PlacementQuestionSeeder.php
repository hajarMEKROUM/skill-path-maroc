<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PlacementQuestion;

class PlacementQuestionSeeder extends Seeder
{
    public function run(): void
    {
        $categories = ['Web', 'Mobile', 'Data'];

        foreach ($categories as $category) {
            for ($i = 1; $i <= 30; $i++) {
                PlacementQuestion::create([
                    'path_category' => $category,
                    'question_text' => "Question de test automatique $i pour le parcours $category ?",
                    'options' => json_encode(['Option A', 'Option B', 'Option C', 'Option D']),
                    'correct_answer' => 'Option A',
                    'points' => 1
                ]);
            }
        }
    }
}
