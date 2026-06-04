<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->bootstrap(); // IMPORTANT: Boot the framework to enable DB connection

$request = Illuminate\Http\Request::create('/api/v1/courses', 'GET');
$request->headers->set('Accept', 'application/json');

$user = \App\Models\User::first();
if ($user) {
    $app['auth']->guard('sanctum')->setUser($user);
    $app['auth']->shouldUse('sanctum');
    $request->setUserResolver(fn() => $user);
}

try {
    $response = $kernel->handle($request);
    echo "STATUS: " . $response->getStatusCode() . "\n";
    echo "CONTENT: " . $response->getContent() . "\n";
} catch (\Throwable $e) {
    echo "FATAL ERROR: " . $e->getMessage() . "\n";
}