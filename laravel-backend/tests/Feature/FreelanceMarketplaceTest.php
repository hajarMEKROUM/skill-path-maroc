<?php

namespace Tests\Feature;

use App\Models\FreelanceJob;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class FreelanceMarketplaceTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $student;
    protected $client;
    protected $job;

    protected function setUp(): void
    {
        parent::setUp();

        // Create mock users
        $this->student = User::factory()->create(['role' => 'student']);
        $this->client = User::factory()->create(['role' => 'enterprise']);

        // Create a mock freelance job
        $this->job = FreelanceJob::factory()->create([
            'client_id' => $this->client->id,
            'status' => 'open',
            'budget_min' => 1000,
            'budget_max' => 5000,
        ]);
    }

    /** @test */
    public function a_student_can_view_open_freelance_missions()
    {
        $response = $this->actingAs($this->student)->getJson('/api/v1/freelance/missions');

        $response->assertStatus(200)
                 ->assertJsonFragment([
                     'id' => $this->job->id,
                     'status' => 'open'
                 ]);
    }

    /** @test */
    public function a_student_can_successfully_submit_a_valid_proposal()
    {
        $payload = [
            'bid_amount' => 2500,
            'delivery_days' => 14,
            'cover_letter' => $this->faker->paragraphs(3, true)
        ];

        $response = $this->actingAs($this->student)
                         ->postJson("/api/v1/freelance/missions/{$this->job->id}/proposals", $payload);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'message',
                     'proposal' => ['id', 'bid_amount', 'status']
                 ]);

        $this->assertDatabaseHas('proposals', [
            'job_id' => $this->job->id,
            'freelancer_id' => $this->student->id,
            'bid_amount' => 2500
        ]);
    }

    /** @test */
    public function a_student_cannot_submit_a_proposal_for_their_own_job_posting()
    {
        // Student creates their own job
        $ownJob = FreelanceJob::factory()->create([
            'client_id' => $this->student->id,
            'status' => 'open'
        ]);

        $payload = [
            'bid_amount' => 1000,
            'delivery_days' => 5,
            'cover_letter' => 'Applying to my own job.'
        ];

        $response = $this->actingAs($this->student)
                         ->postJson("/api/v1/freelance/missions/{$ownJob->id}/proposals", $payload);

        $response->assertStatus(403); // Forbidden
    }

    /** @test */
    public function form_validations_rules_work_properly_for_proposals()
    {
        // Test missing fields
        $response = $this->actingAs($this->student)
                         ->postJson("/api/v1/freelance/missions/{$this->job->id}/proposals", []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['bid_amount', 'delivery_days', 'cover_letter']);

        // Test over max length for cover letter
        $longString = str_repeat('a', 1001); // Assuming 1000 is max
        $response2 = $this->actingAs($this->student)
                          ->postJson("/api/v1/freelance/missions/{$this->job->id}/proposals", [
                              'bid_amount' => 1000,
                              'delivery_days' => 5,
                              'cover_letter' => $longString
                          ]);
                          
        $response2->assertStatus(422)
                  ->assertJsonValidationErrors(['cover_letter']);
    }
}
