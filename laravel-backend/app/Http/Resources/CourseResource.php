<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $durationSeconds = (int) ($this->duration_seconds ?? 0);

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => $this->price,
            'level' => $this->level,
            'category' => $this->level,
            'status' => $this->status,
            'thumbnail' => $this->thumbnail,
            'instructor_id' => $this->instructor_id,
            'instructor' => new UserResource($this->whenLoaded('instructor')),
            'lessons_count' => $this->when(isset($this->lessons_count), (int) $this->lessons_count),
            'duration_seconds' => $this->when(
                isset($this->duration_seconds),
                $durationSeconds
            ),
            'lessons' => $this->whenLoaded('lessons'),
            'modules' => $this->whenLoaded('modules'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
