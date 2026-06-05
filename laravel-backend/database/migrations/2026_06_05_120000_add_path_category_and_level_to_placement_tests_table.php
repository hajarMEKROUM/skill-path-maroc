<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('placement_tests', function (Blueprint $table) {
            $table->string('path_category')->nullable()->after('score');
            $table->string('level')->nullable()->after('path_category');
        });
    }

    public function down(): void
    {
        Schema::table('placement_tests', function (Blueprint $table) {
            $table->dropColumn(['path_category', 'level']);
        });
    }
};
