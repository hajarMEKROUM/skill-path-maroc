<?php

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$email = $argv[1] ?? 'hajarmekroum9@gmail.com';
$user = \App\Models\User::where('email', $email)->first();

if (! $user) {
    echo "User not found: {$email}\n";
    exit(1);
}

$user->role = 'admin';
$user->save();

if (method_exists($user, 'syncRoles')) {
    $user->syncRoles(['admin']);
}

echo "OK column={$user->getAttributes()['role']} accessor={$user->role}\n";
