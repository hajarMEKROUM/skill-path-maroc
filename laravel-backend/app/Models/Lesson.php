<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'module_id',
        'title',
        'slug',
        'content',
        'content_type',
        'video_url',
        'duration_seconds',
        'sort_order',
        'is_preview',
    ];

    protected $casts = [
        'is_preview' => 'boolean',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function module()
    {
        return $this->belongsTo(CourseModule::class, 'module_id');
    }

    public function exercises()
    {
        return $this->hasMany(Exercise::class)->orderBy('sort_order');
    }

    public function quiz()
    {
        return $this->hasOne(Quiz::class);
    }
}