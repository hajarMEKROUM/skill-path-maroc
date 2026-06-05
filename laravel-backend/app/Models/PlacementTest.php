<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlacementTest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'score',
        'path_category',
        'level',
        'completed_at',
    ];

    protected $casts = [
        'score' => 'integer',
        'completed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function answers()
    {
        return $this->hasMany(PlacementAnswer::class);
    }

    public function aiRecommendations()
    {
        return $this->hasMany(AiRecommendation::class);
    }
}