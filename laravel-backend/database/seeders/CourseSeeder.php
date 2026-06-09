<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseModule;
use App\Models\Lesson;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $instructor = User::where('role', 'admin')->first()
            ?? User::where('role', 'user')->first();

        if (! $instructor) {
            return;
        }

        $courses = [
            [
                'title' => 'Introduction au Développement Web',
                'description' => 'Apprenez les fondamentaux du HTML, CSS et JavaScript pour créer vos premiers sites web.',
                'level' => 'beginner',
                'price' => 0,
                'modules' => [
                    [
                        'title' => 'Les bases du HTML',
                        'lessons' => [
                            ['title' => 'Qu\'est-ce que le HTML ?', 'content_type' => 'text', 'content' => 'Le HTML est le langage de balisage standard pour créer des pages web.'],
                            ['title' => 'Structure d\'une page HTML', 'content_type' => 'video', 'video_url' => 'https://www.youtube.com/embed/qz0aGYrrlhU'],
                        ],
                    ],
                    [
                        'title' => 'CSS et mise en forme',
                        'lessons' => [
                            ['title' => 'Introduction au CSS', 'content_type' => 'text', 'content' => 'Le CSS permet de styliser vos pages HTML.'],
                            ['title' => 'Flexbox et Grid', 'content_type' => 'video', 'video_url' => 'https://www.youtube.com/embed/JJSoEo8JSnc'],
                        ],
                    ],
                ],
            ],
            [
                'title' => 'React.js — Applications Modernes',
                'description' => 'Maîtrisez React pour construire des interfaces utilisateur performantes et réactives.',
                'level' => 'intermediate',
                'price' => 299,
                'modules' => [
                    [
                        'title' => 'Fondamentaux React',
                        'lessons' => [
                            ['title' => 'Composants et JSX', 'content_type' => 'text', 'content' => 'React utilise des composants réutilisables pour construire des interfaces.'],
                            ['title' => 'Hooks : useState et useEffect', 'content_type' => 'video', 'video_url' => 'https://www.youtube.com/embed/O6P86uwfdR0'],
                        ],
                    ],
                    [
                        'title' => 'Gestion d\'état',
                        'lessons' => [
                            ['title' => 'Context API', 'content_type' => 'text', 'content' => 'Le Context API permet de partager l\'état entre composants.'],
                            ['title' => 'React Router', 'content_type' => 'video', 'video_url' => 'https://www.youtube.com/embed/Law7wfdg_ls'],
                        ],
                    ],
                ],
            ],
            [
                'title' => 'Laravel — Backend PHP',
                'description' => 'Développez des APIs robustes avec Laravel, le framework PHP le plus populaire au Maroc.',
                'level' => 'intermediate',
                'price' => 399,
                'modules' => [
                    [
                        'title' => 'Installation et configuration',
                        'lessons' => [
                            ['title' => 'Installer Laravel', 'content_type' => 'text', 'content' => 'Guide d\'installation de Laravel avec Composer.'],
                            ['title' => 'Routes et contrôleurs', 'content_type' => 'video', 'video_url' => 'https://www.youtube.com/embed/MFh0Fd7BsjE'],
                        ],
                    ],
                ],
            ],
        ];

        foreach ($courses as $courseData) {
            $modules = $courseData['modules'];
            unset($courseData['modules']);

            $course = Course::firstOrCreate(
                ['slug' => Str::slug($courseData['title'])],
                [
                    ...$courseData,
                    'slug' => Str::slug($courseData['title']),
                    'instructor_id' => $instructor->id,
                    'status' => 'published',
                ]
            );

            foreach ($modules as $moduleIndex => $moduleData) {
                $lessons = $moduleData['lessons'];
                unset($moduleData['lessons']);

                $module = CourseModule::firstOrCreate(
                    ['course_id' => $course->id, 'title' => $moduleData['title']],
                    [
                        ...$moduleData,
                        'course_id' => $course->id,
                        'sort_order' => $moduleIndex + 1,
                    ]
                );

                foreach ($lessons as $lessonIndex => $lessonData) {
                    Lesson::firstOrCreate(
                        ['course_id' => $course->id, 'slug' => Str::slug($lessonData['title'])],
                        [
                            ...$lessonData,
                            'course_id' => $course->id,
                            'module_id' => $module->id,
                            'slug' => Str::slug($lessonData['title']),
                            'sort_order' => $lessonIndex + 1,
                            'duration_seconds' => 600,
                        ]
                    );
                }
            }
        }
    }
}
