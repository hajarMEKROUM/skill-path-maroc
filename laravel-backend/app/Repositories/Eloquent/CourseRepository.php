<?php

namespace App\Repositories\Eloquent;

use App\Models\Course;
use App\Repositories\Contracts\CourseRepositoryInterface;

class CourseRepository implements CourseRepositoryInterface
{
    protected $model;

    public function __construct(Course $model)
    {
        $this->model = $model;
    }

    public function getAllPublished()
    {
        return $this->model->where('status', 'published')->with('instructor')->paginate(15);
    }

    public function findById($id)
    {
        return $this->model->with(['instructor', 'lessons'])->findOrFail($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $course = $this->findById($id);
        $course->update($data);
        return $course;
    }

    public function delete($id)
    {
        return $this->findById($id)->delete();
    }

    public function getRecommendedForUser($userId)
    {
        // Integration with Python AI Microservice goes here, or fallback logic.
        return $this->model->where('status', 'published')->inRandomOrder()->take(3)->get();
    }
}
