<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Models\User;

class UserModelTest extends TestCase
{
    /**
     * Test User model fillable attributes.
     */
    public function test_user_has_correct_fillable_attributes(): void
    {
        $user = new User();

        $this->assertEquals([
            'name',
            'surname',
            'username',
            'email',
            'password',
        ], $user->getFillable());
    }

    /**
     * Test User model hidden attributes.
     */
    public function test_user_hides_sensitive_attributes(): void
    {
        $user = new User();

        $this->assertEquals([
            'password',
            'remember_token',
        ], $user->getHidden());
    }

    /**
     * Test User model can be instantiated.
     */
    public function test_user_can_be_instantiated(): void
    {
        $user = new User();
        $this->assertInstanceOf(User::class, $user);
    }

    /**
     * Test User model has jobs relationship method.
     */
    public function test_user_has_jobs_relationship(): void
    {
        $user = new User();
        $this->assertTrue(method_exists($user, 'jobs'));
    }

    /**
     * Test User model has correct casts.
     */
    public function test_user_has_correct_casts(): void
    {
        $user = new User();
        $casts = $user->getCasts();

        $this->assertArrayHasKey('email_verified_at', $casts);
        $this->assertArrayHasKey('password', $casts);
        $this->assertEquals('datetime', $casts['email_verified_at']);
        $this->assertEquals('hashed', $casts['password']);
    }
}
