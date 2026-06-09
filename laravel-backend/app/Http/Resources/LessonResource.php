<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LessonResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'course_id' => $this->course_id,
            'title' => $this->title,
            'content' => $this->content,
            'video_url' => $this->video_url,
            'sort_order' => $this->sort_order,
            'is_preview' => (bool) $this->is_preview,
            'is_completed' => (bool) ($this->is_completed ?? false),
            'exercises' => $this->relationLoaded('exercises')
                ? $this->exercises->map(fn ($exercise) => [
                    'id' => $exercise->id,
                    'title' => $exercise->title,
                    'content' => $exercise->content,
                    'sort_order' => $exercise->sort_order,
                ])->values()
                : [],
            'quiz' => $this->relationLoaded('quiz') && $this->quiz
                ? [
                    'id' => $this->quiz->id,
                    'title' => $this->quiz->title,
                    'passing_score' => $this->quiz->passing_score,
                    'questions' => $this->quiz->questions ?? [],
                ]
                : null,
        ];
    }
}
