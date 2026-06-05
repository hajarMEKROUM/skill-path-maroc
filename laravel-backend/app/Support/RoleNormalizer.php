<?php

namespace App\Support;

class RoleNormalizer
{
    public const ROLES = ['admin', 'user', 'entreprise'];

    public static function normalize(?string $role): string
    {
        return match ($role) {
            'student', 'instructor', 'freelancer' => 'user',
            'company', 'enterprise' => 'entreprise',
            'admin', 'user', 'entreprise' => $role,
            default => 'user',
        };
    }

    public static function isAdmin(?string $role): bool
    {
        return self::normalize($role) === 'admin';
    }
}
