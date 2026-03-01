<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test user can register with valid data.
     */
    public function test_user_can_register(): void
    {
        $response = $this->postJson('/register', [
            'name' => 'John',
            'surname' => 'Doe',
            'username' => 'johndoe',
            'email' => 'john@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('users', ['email' => 'john@example.com']);
    }

    /**
     * Test registration fails without required fields.
     */
    public function test_register_fails_without_required_fields(): void
    {
        $response = $this->postJson('/register', []);

        $response->assertStatus(500);
    }

    /**
     * Test registration fails with duplicate email.
     */
    public function test_register_fails_with_duplicate_email(): void
    {
        User::factory()->create([
            'surname' => 'Doe',
            'username' => 'johndoe',
            'email' => 'john@example.com',
        ]);

        $response = $this->postJson('/register', [
            'name' => 'Jane',
            'surname' => 'Doe',
            'username' => 'janedoe',
            'email' => 'john@example.com',
            'password' => 'secret123',
        ]);

        $response->assertStatus(500);
    }

    /**
     * Test user can login with valid credentials.
     */
    public function test_user_can_login(): void
    {
        User::factory()->create([
            'surname' => 'Doe',
            'username' => 'johndoe',
            'email' => 'john@example.com',
            'password' => bcrypt('secret123'),
        ]);

        $response = $this->postJson('/login', [
            'email' => 'john@example.com',
            'password' => 'secret123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['token', 'user']);
    }

    /**
     * Test login fails with wrong password.
     */
    public function test_login_fails_with_wrong_password(): void
    {
        User::factory()->create([
            'surname' => 'Doe',
            'username' => 'johndoe',
            'email' => 'john@example.com',
            'password' => bcrypt('secret123'),
        ]);

        $response = $this->postJson('/login', [
            'email' => 'john@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401);
    }

    /**
     * Test login fails with non-existent email.
     */
    public function test_login_fails_with_nonexistent_email(): void
    {
        $response = $this->postJson('/login', [
            'email' => 'nobody@example.com',
            'password' => 'secret123',
        ]);

        $response->assertStatus(401);
    }

    /**
     * Test getUser without token returns 401.
     */
    public function test_get_user_without_token_returns_401(): void
    {
        $response = $this->getJson('/getUser');

        $response->assertStatus(401)
            ->assertJson(['error' => 'Unauthorized']);
    }
}
