<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Marketplace extends Model
{
    protected $fillable = [
        'title',
        'description',
        'budget',
        'category',
        'duration',
        'user_id',
        'status'
    ];
}
