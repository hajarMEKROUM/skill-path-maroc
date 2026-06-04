<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlacementQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'path_category',
        'question_text',
        'options',
        'correct_answer',
        'points'
    ];

    protected $casts = [
        'options' => 'array', // Convertit automatiquement le JSON en tableau PHP
        'points' => 'integer',
    ];

    public function answers()
    {
        return $this->hasMany(PlacementAnswer::class);
    }
}