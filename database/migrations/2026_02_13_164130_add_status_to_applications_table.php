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
    Schema::table('applications', function (Blueprint $table) {
        // إضافة عمود الحالة مع قيمة افتراضية 'en_attente'
        $table->string('status')->default('en_attente')->after('message');
    });
}

public function down(): void
{
    Schema::table('applications', function (Blueprint $table) {
        // حذف العمود في حال قررنا التراجع عن التهجير
        $table->dropColumn('status');
    });
}
};