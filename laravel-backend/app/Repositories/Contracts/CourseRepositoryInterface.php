<?php

namespace App\Repositories\Contracts;

interface CourseRepositoryInterface
{
    public function getAllPublished();
    public function findById($id);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
    public function getRecommendedForUser($userId);
}
