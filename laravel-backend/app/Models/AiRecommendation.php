<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiRecommendation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'placement_test_id',
        'niveau',
        'langage_recommande',
        'parcours_recommande',
        'score'
    ];

    protected $casts = [
        'score' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function placementTest()
    {
        return $this->belongsTo(PlacementTest::class);
    }
}