<?php

namespace App\Policies;

use App\Models\Course;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CoursePolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Course $course): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->can('manage courses') || $user->role === 'instructor';
    }

    public function update(User $user, Course $course): bool
    {
        return $user->can('manage courses') || $user->id === $course->instructor_id;
    }

    public function delete(User $user, Course $course): bool
    {
        return $user->can('manage courses') || $user->id === $course->instructor_id;
    }

    public function restore(User $user, Course $course): bool
    {
        return $user->can('manage courses');
    }

    public function forceDelete(User $user, Course $course): bool
    {
        return $user->can('manage courses');
    }
}
