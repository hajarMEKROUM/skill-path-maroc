<?php

namespace Database\Factories;

use App\Models\Proposal;
use App\Models\FreelanceJob;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Proposal>
 */
class ProposalFactory extends Factory
{
    public function definition(): array
    {
        return [
            'job_id'        => FreelanceJob::factory(),
            'freelancer_id' => User::factory(),
            'cover_letter'  => fake()->paragraph(),
            'bid_amount'    => fake()->numberBetween(100, 5000),
            'delivery_days' => fake()->numberBetween(1, 60),
            'status'        => 'pending',
        ];
    }

    public function accepted(): static
    {
        return $this->state(fn (array $attributes) => ['status' => 'accepted']);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => ['status' => 'rejected']);
    }
}
