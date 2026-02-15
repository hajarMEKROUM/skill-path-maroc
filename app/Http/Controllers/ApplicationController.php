<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Application; // استدعاء الموديل لكي يتعرف عليه الكود
use App\Http\Controllers\Controller;

class ApplicationController extends Controller
{
    /**
     * حفظ طلب التقديم في قاعدة البيانات
     */
  
    public function store(Request $request)
{
    $request->validate([
        'message' => 'required|min:5',
        'freelance_id' => 'required|exists:freelances,id'
    ]);

    \App\Models\Application::create([
        'user_id' => 1, // الآن هذا الرقم سيجد مستخدماً في قاعدة البيانات ✅
        'freelance_id' => $request->freelance_id,
        'message' => $request->message,
    ]);

    return back()->with('success', 'Votre candidature a été envoyée !');
}

public function index()
{
    // جلب طلبات التقديم الخاصة بالمستخدم رقم 1 حالياً
    // واستخدام Eager Loading لجلب بيانات الوظيفة المرتبطة بها
    $applications = \App\Models\Application::where('user_id', 1)
        ->with('freelance')
        ->latest()
        ->get();

    // سنقوم بإنشاء هذا الملف في الخطوة القادمة
    return view('applications.index', compact('applications'));
}

// لعرض كافة الطلبات للمسؤول
public function adminIndex()
{
    // الآن 'user' ستعمل بنجاح بعد إضافة الدالة أعلاه
    $applications = \App\Models\Application::with(['freelance', 'user'])->latest()->get();
    return view('admin.applications.index', compact('applications'));
}
// لتحديث الحالة (قبول/رفض)


public function updateStatus(Request $request, $id)
{
    // 1. البحث عن الطلب في قاعدة البيانات باستخدام الرقم المعرف
    $application = \App\Models\Application::findOrFail($id);

    // 2. تحديث الحالة بناءً على الزر الذي ضغطت عليه (acceptée أو refusée)
    $application->update([
        'status' => $request->status
    ]);

    // 3. العودة لنفس الصفحة مع رسالة نجاح
    return back()->with('success', 'Le statut a été mis à jour avec succès !');
}


public function destroy($id)
{
    $application = \App\Models\Application::findOrFail($id);
    $application->delete();

    return back()->with('success', 'La candidature a été supprimée définitiveً !');
}

}