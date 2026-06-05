<?php

namespace App\Domain\Enums;

enum RoleEnum: string
{
    case USER = 'user';
    case ENTREPRISE = 'entreprise';
    case ADMIN = 'admin';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
