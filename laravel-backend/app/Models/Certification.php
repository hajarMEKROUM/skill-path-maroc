<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certification extends Model
{
    protected $fillable = [
        'user_id', 'course_id', 'status', 'issued_at', 'certificate_url'
    ];

    protected $casts = [
        'issued_at' => 'datetime',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function course() {
        return $this->belongsTo(Course::class);
    }
}