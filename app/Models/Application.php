<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;

    /**
     * الأعمدة المسموح بتعبئتها آلياً
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'freelance_id',
        'message',
        'status'
    ];

    /**
     * علاقة التقديم بالعرض (كل تقديم ينتمي لعرض واحد)
     */
   public function freelance()
{
    return $this->belongsTo(Freelance::class);
}

// أضف هذه الدالة داخل كلاس Application
public function user()
{
    return $this->belongsTo(User::class);
}
}