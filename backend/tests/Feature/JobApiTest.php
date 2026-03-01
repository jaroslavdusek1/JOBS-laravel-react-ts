<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Job;

class JobApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test GET /jobs returns 200.
     */
    public function test_get_all_jobs_returns_200(): void
    {
        $response = $this->getJson('/jobs');

        $response->assertStatus(200);
    }

    /**
     * Test GET /jobs returns empty array when no jobs.
     */
    public function test_get_all_jobs_returns_empty_when_none(): void
    {
        $response = $this->getJson('/jobs');

        $response->assertStatus(200)
            ->assertJson([]);
    }

    /**
     * Test GET /jobs/{id} returns 404 for non-existent job.
     */
    public function test_get_job_returns_404_for_invalid_id(): void
    {
        $response = $this->getJson('/jobs/999');

        $response->assertStatus(404);
    }

    /**
     * Test authenticated user can create a job.
     */
    public function test_authenticated_user_can_create_job(): void
    {
        $user = User::factory()->create([
            'surname' => 'Doe',
            'username' => 'johndoe',
        ]);

        $jobData = [
            'title' => 'Laravel Developer',
            'description' => 'Build APIs with Laravel.',
            'salary' => '$80,000',
            'location' => 'Prague, CZ',
            'job_type' => 'full-time',
            'user_id' => $user->id,
        ];

        $response = $this->actingAs($user)
            ->postJson('/jobs', $jobData);

        $response->assertStatus(201);
        $this->assertDatabaseHas('jobs', ['title' => 'Laravel Developer']);
    }

    /**
     * Test unauthenticated user cannot create a job.
     */
    public function test_unauthenticated_user_cannot_create_job(): void
    {
        $response = $this->postJson('/jobs', [
            'title' => 'Test Job',
            'description' => 'Test',
            'salary' => '$50,000',
            'location' => 'Remote',
            'job_type' => 'full-time',
        ]);

        $response->assertStatus(401);
    }

    /**
     * Test unauthenticated user cannot delete a job.
     */
    public function test_unauthenticated_user_cannot_delete_job(): void
    {
        $response = $this->deleteJson('/jobs/1');

        $response->assertStatus(401);
    }
}
