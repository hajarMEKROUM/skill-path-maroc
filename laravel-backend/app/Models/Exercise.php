<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exercise extends Model
{
    use HasFactory;

    protected $fillable = [
        'lesson_id',
        'title',
        'content',
        'expected_answer',
        'hint',
        'sort_order',
    ];

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }
}
