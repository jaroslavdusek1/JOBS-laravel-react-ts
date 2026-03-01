<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Models\Job;
use App\Models\User;

class JobModelTest extends TestCase
{
    /**
     * Test Job model fillable attributes.
     */
    public function test_job_has_correct_fillable_attributes(): void
    {
        $job = new Job();

        $this->assertEquals([
            'title',
            'description',
            'user_id',
            'location',
            'job_type',
            'salary',
        ], $job->getFillable());
    }

    /**
     * Test Job model can be instantiated.
     */
    public function test_job_can_be_instantiated(): void
    {
        $job = new Job();
        $this->assertInstanceOf(Job::class, $job);
    }

    /**
     * Test Job model has user relationship method.
     */
    public function test_job_has_user_relationship(): void
    {
        $job = new Job();
        $this->assertTrue(method_exists($job, 'user'));
    }
}
