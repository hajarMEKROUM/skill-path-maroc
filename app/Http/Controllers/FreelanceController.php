<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// 1. استدعاء الموديل لكي نتمكن من الوصول لجدول البيانات
use App\Models\Freelance; 

class FreelanceController extends Controller
{
    /**
     * عرض قائمة عروض العمل (Freelance)
     */
    public function index()
    {
        // 2. جلب جميع السجلات من جدول 'freelances' في قاعدة البيانات
        $freelances = Freelance::all();

        // 3. إرسال البيانات إلى ملف الـ View (index.blade.php)
        return view('freelance.index', compact('freelances'));
    }


}