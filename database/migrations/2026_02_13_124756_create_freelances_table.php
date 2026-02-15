<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('freelances', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // مثال: Développeur Full Stack
            $table->string('company_name'); // اسم الشركة
            $table->text('description'); // الوصف الوظيفي
            $table->string('budget'); // الميزانية (مثلاً: 5000-8000 MAD)
            $table->string('duration'); // المدة (مثلاً: 3 mois)
            $table->json('skills')->nullable(); // المهارات المطلوبة كمصفوفة
            $table->string('status')->default('available'); // حالة العرض
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('freelances');
    }
};