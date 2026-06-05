<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('certificates', function (Blueprint $table) {
            if (! Schema::hasColumn('certificates', 'status')) {
                $table->string('status')->default('validated')->after('certificate_number');
            }
            if (! Schema::hasColumn('certificates', 'certificate_url')) {
                $table->string('certificate_url')->nullable()->after('status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('certificates', function (Blueprint $table) {
            if (Schema::hasColumn('certificates', 'certificate_url')) {
                $table->dropColumn('certificate_url');
            }
            if (Schema::hasColumn('certificates', 'status')) {
                $table->dropColumn('status');
            }
        });
    }
};
