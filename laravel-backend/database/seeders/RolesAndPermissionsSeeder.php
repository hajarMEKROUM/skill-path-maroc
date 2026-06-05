<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'manage users',
            'manage courses',
            'create courses',
            'take courses',
            'post jobs',
            'apply jobs',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $roleAdmin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $roleAdmin->syncPermissions(Permission::all());

        $roleUser = Role::firstOrCreate(['name' => 'user', 'guard_name' => 'web']);
        $roleUser->syncPermissions(['take courses', 'apply jobs', 'create courses']);

        $roleEntreprise = Role::firstOrCreate(['name' => 'entreprise', 'guard_name' => 'web']);
        $roleEntreprise->syncPermissions(['post jobs', 'take courses']);
    }
}
