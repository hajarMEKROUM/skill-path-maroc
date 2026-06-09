<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exercises', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('content');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::table('quizzes', function (Blueprint $table) {
            $table->json('questions')->nullable()->after('passing_score');
        });
    }

    public function down(): void
    {
        Schema::table('quizzes', function (Blueprint $table) {
            $table->dropColumn('questions');
        });

        Schema::dropIfExists('exercises');
    }
};
