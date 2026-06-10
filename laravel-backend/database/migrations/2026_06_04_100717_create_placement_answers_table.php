<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('placement_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('placement_test_id')->constrained('placement_tests')->onDelete('cascade');
            $table->foreignId('placement_question_id')->constrained('placement_questions')->onDelete('cascade');
            $table->string('selected_answer');
            $table->boolean('is_correct')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('placement_answers');
    }
};
