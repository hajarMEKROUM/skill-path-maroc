<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // create permissions
        Permission::create(['name' => 'manage users']);
        Permission::create(['name' => 'manage courses']);
        Permission::create(['name' => 'create courses']);
        Permission::create(['name' => 'take courses']);
        Permission::create(['name' => 'post jobs']);
        Permission::create(['name' => 'apply jobs']);

        // create roles and assign created permissions
        $roleAdmin = Role::create(['name' => 'admin']);
        $roleAdmin->givePermissionTo(Permission::all());

        $roleInstructor = Role::create(['name' => 'instructor']);
        $roleInstructor->givePermissionTo(['create courses']);

        $roleStudent = Role::create(['name' => 'student']);
        $roleStudent->givePermissionTo(['take courses']);

        $roleFreelancer = Role::create(['name' => 'freelancer']);
        $roleFreelancer->givePermissionTo(['apply jobs']);

        $roleEnterprise = Role::create(['name' => 'enterprise']);
        $roleEnterprise->givePermissionTo(['post jobs']);
    }
}
