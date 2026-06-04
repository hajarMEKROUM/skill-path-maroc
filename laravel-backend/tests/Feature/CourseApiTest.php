<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;

class CourseApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_fetch_courses_and_see_500_or_200()
    {
        $this->withoutExceptionHandling(); // Expose the 500 error
        
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/courses');

        $response->assertStatus(200);
    }
}
