<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
        ]);

        $profiles = [
            [
                'email' => 'hajarmekroum9@gmail.com',
                'name' => 'Hajar Mekroum',
                'password' => '123456789',
                'role' => 'admin',
                'spatie_role' => 'admin',
                'bio' => 'Administratrice principale de la plateforme SkillPath Maroc.',
            ],
            [
                'email' => 'karim.alami@skillpath.ma',
                'name' => 'Karim Alami',
                'password' => 'password',
                'role' => 'instructor',
                'spatie_role' => 'user',
                'bio' => 'Developpeur Full-Stack Senior avec huit ans d experience.',
            ],
            [
                'email' => 'amine.bennani@skillpath.ma',
                'name' => 'Amine Bennani',
                'password' => 'password',
                'role' => 'student',
                'spatie_role' => 'user',
                'bio' => 'Etudiant en developpement d applications web et mobiles.',
            ],
        ];

        collect($profiles)->each(fn (array $profile) => tap(
            User::updateOrCreate(
                ['email' => $profile['email']],
                [
                    'name' => $profile['name'],
                    'password' => $profile['password'],
                    'role' => $profile['role'],
                    'status' => 'active',
                    'is_verified' => true,
                    'email_verified_at' => now(),
                    'bio' => $profile['bio'],
                ]
            ),
            fn (User $user) => $user->assignRole($profile['spatie_role'])
        ));

        $this->call([
            PlacementQuestionSeeder::class,
            HtmlCssFundamentalsSeeder::class,
        ]);
    }
}
