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
        $this->call(HtmlCssFundamentalsSeeder::class);

        $instructor = User::where('role', 'admin')->first()
            ?? User::where('role', 'user')->first();

        if (! $instructor) {
            return;
        }

        $courses = [
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
                            'video_url' => $lessonData['video_url'] ?? null,
                        ]
                    );
                }
            }
        }
    }
}
