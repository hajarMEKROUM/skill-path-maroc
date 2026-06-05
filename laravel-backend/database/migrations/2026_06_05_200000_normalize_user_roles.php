<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('users')) {
            return;
        }

        if (Schema::hasTable('roles')) {
            foreach (['admin', 'user', 'entreprise'] as $roleName) {
                DB::table('roles')->updateOrInsert(
                    ['name' => $roleName, 'guard_name' => 'web'],
                    ['created_at' => now(), 'updated_at' => now()]
                );
            }
        }

        DB::table('users')
            ->whereIn('role', ['student', 'instructor', 'freelancer'])
            ->update(['role' => 'user']);

        DB::table('users')
            ->whereIn('role', ['company', 'enterprise'])
            ->update(['role' => 'entreprise']);

        if (Schema::hasTable('roles')) {
            $map = [
                'student' => 'user',
                'instructor' => 'user',
                'freelancer' => 'user',
                'company' => 'entreprise',
                'enterprise' => 'entreprise',
            ];

            foreach ($map as $old => $new) {
                $oldId = DB::table('roles')->where('name', $old)->value('id');
                $newId = DB::table('roles')->where('name', $new)->value('id');

                if ($oldId && $newId && $oldId !== $newId) {
                    DB::table('model_has_roles')
                        ->where('role_id', $oldId)
                        ->update(['role_id' => $newId]);
                }
            }

            DB::table('roles')->whereIn('name', array_keys($map))->delete();
        }
    }

    public function down(): void
    {
        // Irreversible without backup
    }
};
