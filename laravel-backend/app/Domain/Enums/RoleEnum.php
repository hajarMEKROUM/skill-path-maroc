<?php

namespace App\Domain\Enums;

enum RoleEnum: string
{
    case STUDENT = 'student';
    case INSTRUCTOR = 'instructor';
    case FREELANCER = 'freelancer';
    case COMPANY = 'company';
    case ADMIN = 'admin';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
