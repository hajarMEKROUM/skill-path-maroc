<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        if (! $this->userHasRole($user, $role)) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        return $next($request);
    }

    protected function userHasRole($user, string $role): bool
    {
        $columnRole = $user->getAttributes()['role'] ?? null;
        if ($columnRole === $role) {
            return true;
        }

        if (method_exists($user, 'hasRole') && $user->hasRole($role)) {
            return true;
        }

        return $user->role === $role;
    }
}
