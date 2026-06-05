<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::table('lessons', function (Blueprint $table) {
            if (! Schema::hasColumn('lessons', 'module_id')) {
                $table->foreignId('module_id')->nullable()->after('course_id')->constrained('course_modules')->nullOnDelete();
            }
            if (! Schema::hasColumn('lessons', 'content_type')) {
                $table->string('content_type')->default('text')->after('content');
            }
        });
    }

    public function down(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            if (Schema::hasColumn('lessons', 'module_id')) {
                $table->dropConstrainedForeignId('module_id');
            }
            if (Schema::hasColumn('lessons', 'content_type')) {
                $table->dropColumn('content_type');
            }
        });

        Schema::dropIfExists('course_modules');
    }
};
