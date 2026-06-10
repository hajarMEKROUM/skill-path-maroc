<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('freelance_jobs', function (Blueprint $table) {
            $table->enum('approval_status', ['pending', 'approved', 'rejected'])
                ->default('approved')
                ->after('status');
        });

        Schema::table('lesson_progress', function (Blueprint $table) {
            $table->boolean('content_completed')->default(false)->after('is_completed');
            $table->unsignedTinyInteger('quiz_score')->default(0)->after('content_completed');
            $table->json('quiz_answers')->nullable()->after('quiz_score');
            $table->json('completed_exercise_ids')->nullable()->after('quiz_answers');
            $table->unsignedTinyInteger('progress_percent')->default(0)->after('completed_exercise_ids');
        });

        Schema::table('exercises', function (Blueprint $table) {
            $table->string('expected_answer')->nullable()->after('content');
            $table->string('hint')->nullable()->after('expected_answer');
        });
    }

    public function down(): void
    {
        Schema::table('exercises', function (Blueprint $table) {
            $table->dropColumn(['expected_answer', 'hint']);
        });

        Schema::table('lesson_progress', function (Blueprint $table) {
            $table->dropColumn(['content_completed', 'quiz_score', 'completed_exercise_ids', 'progress_percent']);
        });

        Schema::table('freelance_jobs', function (Blueprint $table) {
            $table->dropColumn('approval_status');
        });
    }
};
