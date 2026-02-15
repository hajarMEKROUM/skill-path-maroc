<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Freelance;

class FreelanceSeeder extends Seeder
{
    public function run(): void
    {
        Freelance::create([
            'title' => 'Développeur Full Stack React/Node.js',
            'company_name' => 'TechStart Maroc',
            'description' => 'Nous recherchons un développeur full stack pour créer une plateforme e-commerce moderne.',
            'budget' => '5000-8000 MAD',
            'duration' => '3 mois',
            'skills' => json_encode(['React', 'Node.js', 'MongoDB', 'TypeScript']),
            'status' => 'available'
        ]);

        Freelance::create([
            'title' => 'Designer UI/UX pour App Mobile',
            'company_name' => 'Creative Agency',
            'description' => 'Conception d\'une application mobile de gestion financière avec une expérience utilisateur fluide.',
            'budget' => '4000-6000 MAD',
            'duration' => '2 mois',
            'skills' => json_encode(['Figma', 'UI Design', 'Prototyping']),
            'status' => 'available'
        ]);
        
        Freelance::create([
            'title' => 'Expert SEO & Content Marketing',
            'company_name' => 'Digital Boost',
            'description' => 'Optimisation SEO et création de contenu pour plusieurs sites web de e-commerce.',
            'budget' => '3500-5000 MAD',
            'duration' => '6 mois',
            'skills' => json_encode(['SEO', 'Content Writing', 'Analytics']),
            'status' => 'available'
        ]);
    }
}