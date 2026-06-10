<?php

namespace Database\Seeders;

use App\Models\PlacementQuestion;
use Illuminate\Database\Seeder;

class PlacementQuestionSeeder extends Seeder
{
    public function run(): void
    {
        $questions = [
            ...$this->webQuestions(),
            ...$this->mobileQuestions(),
            ...$this->dataQuestions(),
        ];

        collect($questions)->each(fn (array $question) => PlacementQuestion::updateOrCreate(
            [
                'path_category' => $question['path_category'],
                'question_text' => $question['question_text'],
            ],
            $question
        ));
    }

    protected function webQuestions(): array
    {
        return [
            [
                'path_category' => 'Web',
                'question_text' => 'Quelle balise HTML est la plus adaptee pour un contenu autonome comme un article de blog ou une carte d actualite ?',
                'options' => ['<section>', '<article>', '<aside>', '<main>'],
                'correct_answer' => '<article>',
                'points' => 1,
            ],
            [
                'path_category' => 'Web',
                'question_text' => 'Quel Hook React permet de declencher un effet de bord apres le rendu d un composant ?',
                'options' => ['useState', 'useEffect', 'useMemo', 'useRef'],
                'correct_answer' => 'useEffect',
                'points' => 1,
            ],
            [
                'path_category' => 'Web',
                'question_text' => 'Dans Redux, quel principe decrit le mieux le role d un reducer ?',
                'options' => [
                    'Une fonction pure qui calcule le prochain etat a partir de l etat courant et de l action',
                    'Une fonction asynchrone qui interroge directement l API',
                    'Un composant React charge du rendu de l interface',
                    'Un middleware qui modifie le DOM',
                ],
                'correct_answer' => 'Une fonction pure qui calcule le prochain etat a partir de l etat courant et de l action',
                'points' => 2,
            ],
            [
                'path_category' => 'Web',
                'question_text' => 'Que fait reellement la commande `php artisan migrate:fresh --seed` ?',
                'options' => [
                    'Supprime toutes les tables, relance toutes les migrations puis execute les seeders',
                    'Annule uniquement la derniere migration enregistree',
                    'Cree une base vide sans structure ni donnees',
                    'Vide uniquement le cache de configuration',
                ],
                'correct_answer' => 'Supprime toutes les tables, relance toutes les migrations puis execute les seeders',
                'points' => 2,
            ],
            [
                'path_category' => 'Web',
                'question_text' => 'Quelle jointure MySQL retourne uniquement les lignes qui ont une correspondance dans les deux tables ?',
                'options' => ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'CROSS JOIN'],
                'correct_answer' => 'INNER JOIN',
                'points' => 1,
            ],
        ];
    }

    protected function mobileQuestions(): array
    {
        return [
            [
                'path_category' => 'Mobile',
                'question_text' => 'Dans Flutter, quel widget est generalement utilise pour aligner plusieurs enfants horizontalement ?',
                'options' => ['Row', 'Column', 'Stack', 'Container'],
                'correct_answer' => 'Row',
                'points' => 1,
            ],
            [
                'path_category' => 'Mobile',
                'question_text' => 'Quel composant affiche du texte dans React Native ?',
                'options' => ['Text', 'Paragraph', 'Label', 'Span'],
                'correct_answer' => 'Text',
                'points' => 1,
            ],
            [
                'path_category' => 'Mobile',
                'question_text' => 'Quelle classe Android est couramment utilisee pour conserver l etat de l interface en respectant le cycle de vie ?',
                'options' => ['ViewModel', 'RecyclerView', 'Intent', 'Service'],
                'correct_answer' => 'ViewModel',
                'points' => 2,
            ],
        ];
    }

    protected function dataQuestions(): array
    {
        return [
            [
                'path_category' => 'Data',
                'question_text' => 'Quelle fonction SQL sert a compter le nombre d enregistrements dans un ensemble de resultats ?',
                'options' => ['COUNT(*)', 'SUM()', 'AVG()', 'MAX()'],
                'correct_answer' => 'COUNT(*)',
                'points' => 1,
            ],
            [
                'path_category' => 'Data',
                'question_text' => 'Quelle methode pandas supprime les lignes contenant au moins une valeur manquante ?',
                'options' => ['dropna()', 'fillna()', 'isna()', 'rename()'],
                'correct_answer' => 'dropna()',
                'points' => 1,
            ],
            [
                'path_category' => 'Data',
                'question_text' => 'Quel est l avantage principal d un schema en etoile dans un data warehouse ?',
                'options' => [
                    'Simplifier les requetes analytiques et ameliorer souvent les performances de lecture',
                    'Normaliser toutes les tables au maximum',
                    'Supprimer le besoin de dimensions',
                    'Remplacer SQL par un moteur NoSQL',
                ],
                'correct_answer' => 'Simplifier les requetes analytiques et ameliorer souvent les performances de lecture',
                'points' => 2,
            ],
        ];
    }
}
