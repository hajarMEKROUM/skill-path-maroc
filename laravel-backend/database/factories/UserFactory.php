<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name'              => fake()->name(),
            'email'             => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password'          => static::$password ??= Hash::make('password'),
            'role'              => 'user',
            'remember_token'    => Str::random(10),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    // Named role states for readability in tests
    public function student(): static
    {
        return $this->state(fn (array $attributes) => ['role' => 'student']);
    }

    public function instructor(): static
    {
        return $this->state(fn (array $attributes) => ['role' => 'instructor']);
    }

    public function freelancer(): static
    {
        return $this->state(fn (array $attributes) => ['role' => 'freelancer']);
    }

    public function enterprise(): static
    {
        return $this->state(fn (array $attributes) => ['role' => 'company']);
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => ['role' => 'admin']);
    }
}
