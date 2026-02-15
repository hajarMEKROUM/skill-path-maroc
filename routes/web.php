<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApplicationController; // استيراد متحكم الطلبات
use App\Http\Controllers\FreelanceController;   // استيراد متحكم الوظائف

Route::get('/', function () {
    return view('welcome');
});

// عرض قائمة الوظائف
Route::get('/freelance', [FreelanceController::class, 'index']);

// استقبال طلب التقديم
Route::post('/applications', [ApplicationController::class, 'store'])->name('applications.store');

// صفحة طلباتي الجديدة 📂
Route::get('/my-applications', [ApplicationController::class, 'index'])->name('applications.index');// مسار لوحة تحكم المسؤول لرؤية جميع الطلبات
Route::get('/admin/applications', [ApplicationController::class, 'adminIndex'])->name('admin.applications.index');

// مسار لتحديث حالة الطلب (قبول أو رفض)
Route::patch('/admin/applications/{application}/status', [ApplicationController::class, 'updateStatus'])->name('admin.applications.updateStatus');

Route::delete('/admin/applications/{application}', [ApplicationController::class, 'destroy'])->name('admin.applications.destroy');