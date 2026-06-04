<?php

namespace Database\Factories;

use App\Models\FreelanceJob;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<FreelanceJob>
 */
class FreelanceJobFactory extends Factory
{
    public function definition(): array
    {
        return [
            'client_id'   => User::factory(),
            'title'       => fake()->sentence(),
            'description' => fake()->paragraph(),
            'status'      => 'open',
            'budget_min'  => fake()->numberBetween(100, 500),
            'budget_max'  => fake()->numberBetween(600, 5000),
            'deadline'    => fake()->dateTimeBetween('+1 week', '+3 months'),
        ];
    }

    public function open(): static
    {
        return $this->state(fn (array $attributes) => ['status' => 'open']);
    }

    public function closed(): static
    {
        return $this->state(fn (array $attributes) => ['status' => 'completed']);
    }
}

