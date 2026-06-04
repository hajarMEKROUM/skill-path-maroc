<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlacementAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'placement_test_id',
        'placement_question_id',
        'selected_answer',
        'is_correct'
    ];

    protected $casts = [
        'is_correct' => 'boolean',
    ];

    public function placementTest()
    {
        return $this->belongsTo(PlacementTest::class);
    }

    public function question()
    {
        return $this->belongsTo(PlacementQuestion::class, 'placement_question_id');
    }
}