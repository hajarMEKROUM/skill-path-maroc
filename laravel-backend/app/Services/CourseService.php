<?php

namespace App\Services;

use App\Repositories\Contracts\CourseRepositoryInterface;
use Illuminate\Support\Str;

class CourseService
{
    protected $courseRepository;

    public function __construct(CourseRepositoryInterface $courseRepository)
    {
        $this->courseRepository = $courseRepository;
    }

    public function createCourse(array $data, $instructorId)
    {
        $data['instructor_id'] = $instructorId;
        $data['slug'] = Str::slug($data['title']) . '-' . uniqid();
        
        return $this->courseRepository->create($data);
    }

    public function getAllPublishedCourses()
    {
        return $this->courseRepository->getAllPublished();
    }

    // Other business logic methods...
}
