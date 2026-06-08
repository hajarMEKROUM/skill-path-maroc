<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        Course::create([
            'instructor_id' => 1,
            'title' => 'Laravel Basics',
            'slug' => 'laravel-basics',
            'description' => 'Learn Laravel from routes, controllers, models and APIs.',
            'price' => 200,
            'level' => 'beginner',
            'status' => 'published',
        ]);

        Course::create([
            'instructor_id' => 1,
            'title' => 'React Fundamentals',
            'slug' => 'react-fundamentals',
            'description' => 'Learn React components, hooks, routing and API integration.',
            'price' => 180,
            'level' => 'beginner',
            'status' => 'published',
        ]);

        Course::create([
            'instructor_id' => 1,
            'title' => 'SQL & MySQL',
            'slug' => 'sql-mysql',
            'description' => 'Learn SQL queries, joins, relationships and database design.',
            'price' => 150,
            'level' => 'beginner',
            'status' => 'published',
        ]);

        Course::create([
            'instructor_id' => 1,
            'title' => 'Python Programming',
            'slug' => 'python-programming',
            'description' => 'Learn Python basics, OOP, files and real-world projects.',
            'price' => 220,
            'level' => 'beginner',
            'status' => 'published',
        ]);
    }
}