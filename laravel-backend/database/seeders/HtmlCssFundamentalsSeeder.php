<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseModule;
use App\Models\Exercise;
use App\Models\Lesson;
use App\Models\Quiz;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class HtmlCssFundamentalsSeeder extends Seeder
{
    public function run(): void
    {
        $instructor = User::where('role', 'admin')->first()
            ?? User::where('role', 'user')->first();

        if (! $instructor) {
            return;
        }

        $course = Course::updateOrCreate(
            ['slug' => 'html-css-fundamentals'],
            [
                'title' => 'HTML & CSS Fundamentals',
                'description' => 'Maîtrisez les fondamentaux du développement web avec des leçons structurées, des exercices pratiques et des quiz interactifs.',
                'level' => 'beginner',
                'price' => 0,
                'instructor_id' => $instructor->id,
                'status' => 'published',
            ]
        );

        $this->purgeCourseChildren($course);

        $module = CourseModule::create([
            'course_id' => $course->id,
            'title' => 'Leçons principales',
            'description' => 'Fondamentaux HTML et CSS',
            'sort_order' => 1,
        ]);

        foreach ($this->lessonsData() as $index => $lessonData) {
            $exercises = $lessonData['exercises'];
            $quizData = $lessonData['quiz'];
            unset($lessonData['exercises'], $lessonData['quiz']);

            $lesson = Lesson::create([
                ...$lessonData,
                'course_id' => $course->id,
                'module_id' => $module->id,
                'slug' => Str::slug($lessonData['title']),
                'sort_order' => $index + 1,
                'duration_seconds' => $lessonData['duration_seconds'] ?? 600,
                'content_type' => 'video',
            ]);

            foreach ($exercises as $exerciseIndex => $exercise) {
                Exercise::create([
                    'lesson_id' => $lesson->id,
                    'title' => $exercise['title'],
                    'content' => $exercise['content'],
                    'expected_answer' => $exercise['expected_answer'] ?? null,
                    'hint' => $exercise['hint'] ?? null,
                    'sort_order' => $exerciseIndex + 1,
                ]);
            }

            Quiz::create([
                'course_id' => $course->id,
                'lesson_id' => $lesson->id,
                'title' => $quizData['title'],
                'passing_score' => 70,
                'questions' => $quizData['questions'],
            ]);
        }
    }

    protected function purgeCourseChildren(Course $course): void
    {
        $lessonIds = $course->lessons()->pluck('id');

        Exercise::whereIn('lesson_id', $lessonIds)->delete();
        Quiz::whereIn('lesson_id', $lessonIds)->delete();
        $course->lessons()->delete();
        $course->modules()->delete();
    }

    protected function lessonsData(): array
    {
        return [
            [
                'title' => 'Introduction au HTML',
                'is_preview' => true,
                'video_url' => 'https://www.youtube.com/embed/ok-plXXHlWw',
                'duration_seconds' => 720,
                'content' => $this->lessonContent(
                    'Introduction au HTML',
                    [
                        'Le **HTML** (HyperText Markup Language) structure le contenu web',
                        'Les balises s\'ouvrent `<tag>` et se ferment `</tag>`',
                        'Le navigateur interprète le HTML et affiche la page',
                        'Les balises sémantiques améliorent l\'accessibilité',
                    ],
                    'Chaque site web est construit avec du HTML. Il définit les titres, paragraphes, liens et images. Le HTML décrit le contenu, pas son style.',
                    <<<'HTML'
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>Ma première page</title>
  </head>
  <body>
    <h1>Bienvenue en HTML</h1>
    <p>Mon premier paragraphe.</p>
  </body>
</html>
HTML,
                    'Créez une page HTML avec un titre `<h1>` et un paragraphe de présentation.',
                    'Une page affichant un grand titre et un paragraphe en dessous.'
                ),
                'exercises' => [[
                    'title' => 'Créer votre première page',
                    'content' => 'Écrivez un fichier HTML avec `<!DOCTYPE html>`, un `<title>` dans `<head>`, un `<h1>` **Bonjour Maroc** et un `<p>` avec une phrase sur vos objectifs.',
                    'expected_answer' => 'bonjour maroc',
                    'hint' => 'Utilisez les balises `<h1>` et `<p>` à l\'intérieur de `<body>`.',
                ]],
                'quiz' => [
                    'title' => 'Quiz — Introduction au HTML',
                    'questions' => [
                        [
                            'question' => 'Que signifie HTML ?',
                            'options' => ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink Text Management Language'],
                            'answer' => 'HyperText Markup Language',
                        ],
                        [
                            'question' => 'Quelle balise définit le titre principal ?',
                            'options' => ['<h6>', '<heading>', '<h1>', '<head>'],
                            'answer' => '<h1>',
                        ],
                        [
                            'question' => 'Où se place le contenu visible de la page ?',
                            'options' => ['<head>', '<meta>', '<body>', '<link>'],
                            'answer' => '<body>',
                        ],
                    ],
                ],
            ],
            [
                'title' => 'Structure HTML',
                'is_preview' => false,
                'video_url' => 'https://www.youtube.com/embed/qz0aGYrrlhU',
                'duration_seconds' => 600,
                'content' => $this->lessonContent(
                    'Structure HTML',
                    [
                        'Un document HTML valide suit une structure standard',
                        '`<!DOCTYPE html>` déclare le mode HTML5',
                        '`<head>` contient les métadonnées, `<body>` le contenu visible',
                        'Les balises sémantiques organisent la page logiquement',
                    ],
                    'Une page bien structurée sépare les métadonnées du contenu visible. Utilisez `<header>`, `<nav>`, `<main>`, `<section>` et `<footer>` pour une structure claire.',
                    <<<'HTML'
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Portfolio</title>
  </head>
  <body>
    <header>
      <h1>Mon Portfolio</h1>
      <nav><a href="#about">À propos</a></nav>
    </header>
    <main>
      <section id="about">
        <h2>À propos de moi</h2>
        <p>J'apprends le développement web.</p>
      </section>
    </main>
    <footer><p>&copy; 2026</p></footer>
  </body>
</html>
HTML,
                    'Construisez une page portfolio avec `<header>`, `<main>`, `<section>` et `<footer>`.',
                    'Une page structurée avec en-tête, section principale et pied de page sémantiques.'
                ),
                'exercises' => [[
                    'title' => 'Mise en page sémantique',
                    'content' => 'Créez une page avec `<header>` (titre du site), `<nav>` (2 liens), `<main>` avec une `<section>`, et `<footer>` (copyright).',
                    'expected_answer' => '<header>',
                    'hint' => 'Commencez par `<!DOCTYPE html>` puis utilisez `<header>`, `<nav>`, `<main>` et `<footer>`.',
                ]],
                'quiz' => [
                    'title' => 'Quiz — Structure HTML',
                    'questions' => [
                        [
                            'question' => 'Quel élément contient tout le contenu visible ?',
                            'options' => ['<head>', '<body>', '<html>', '<meta>'],
                            'answer' => '<body>',
                        ],
                        [
                            'question' => 'Quelle balise est utilisée pour la navigation ?',
                            'options' => ['<nav>', '<menu>', '<links>', '<header>'],
                            'answer' => '<nav>',
                        ],
                        [
                            'question' => 'Que déclare `<!DOCTYPE html>` ?',
                            'options' => ['La version CSS', 'Le mode JavaScript', 'Le type de document HTML5', 'L\'encodage des caractères'],
                            'answer' => 'Le type de document HTML5',
                        ],
                    ],
                ],
            ],
            [
                'title' => 'CSS de base',
                'is_preview' => false,
                'video_url' => 'https://www.youtube.com/embed/1Rs2ND1ryYc',
                'duration_seconds' => 660,
                'content' => $this->lessonContent(
                    'CSS de base',
                    [
                        'Le **CSS** contrôle la présentation visuelle',
                        'Les sélecteurs ciblent les éléments HTML',
                        'Les propriétés `color`, `font-size`, `margin` modifient l\'apparence',
                        'Un fichier CSS externe sépare le style de la structure',
                    ],
                    'Le CSS associe des règles à des sélecteurs. Liez une feuille externe avec `<link rel="stylesheet" href="styles.css">` dans le `<head>`.',
                    "/* styles.css */\nbody {\n  font-family: Arial, sans-serif;\n  background-color: #f8fafc;\n  text-align: center;\n}\n\nh1 {\n  color: #2563eb;\n  font-size: 2rem;\n}",
                    'Stylisez une page : titres bleus, texte centré, fond gris clair.',
                    'Une page avec fond gris clair, titre bleu centré et texte lisible.'
                ),
                'exercises' => [[
                    'title' => 'Styliser une page',
                    'content' => 'Écrivez un fichier `styles.css` : fond `#f8fafc`, texte centré, tous les `h1` en bleu (`#2563eb`) avec `font-size: 2rem`. Liez-le à votre page HTML.',
                    'expected_answer' => '#2563eb',
                    'hint' => 'Utilisez `color: #2563eb` pour les titres et `text-align: center` pour centrer.',
                ]],
                'quiz' => [
                    'title' => 'Quiz — CSS de base',
                    'questions' => [
                        [
                            'question' => 'Quelle propriété change la couleur du texte ?',
                            'options' => ['font-weight', 'color', 'background', 'border'],
                            'answer' => 'color',
                        ],
                        [
                            'question' => 'Comment sélectionner une classe "card" ?',
                            'options' => ['#card', '.card', 'card', '*card'],
                            'answer' => '.card',
                        ],
                        [
                            'question' => 'Où lier un fichier CSS externe ?',
                            'options' => ['Dans <body>', 'Dans <head>', 'Après </html>', 'Dans <footer>'],
                            'answer' => 'Dans <head>',
                        ],
                    ],
                ],
            ],
        ];
    }

    protected function lessonContent(
        string $title,
        array $keyConcepts,
        string $explanation,
        string $codeExample,
        string $exercise,
        string $expectedResult
    ): string {
        $concepts = implode("\n", array_map(fn ($c) => "- {$c}", $keyConcepts));
        $lang = str_contains($codeExample, 'color:') || str_contains($codeExample, 'font-family')
            ? 'css'
            : 'html';

        return <<<MD
# {$title}

## Concepts clés

{$concepts}

## Explication

{$explanation}

## Exemple de code

```{$lang}
{$codeExample}
```

## Exercice

{$exercise}

## Résultat attendu

{$expectedResult}
MD;
    }
}
