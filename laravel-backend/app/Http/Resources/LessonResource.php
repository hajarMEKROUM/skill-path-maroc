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
            'progress_percent' => (int) ($this->progress_percent ?? 0),
            'content_completed' => (bool) ($this->content_completed ?? false),
            'quiz_score' => (int) ($this->quiz_score ?? 0),
            'completed_exercise_ids' => $this->completed_exercise_ids ?? [],
            'exercises' => $this->relationLoaded('exercises')
                ? $this->exercises->map(fn ($exercise) => [
                    'id' => $exercise->id,
                    'title' => $exercise->title,
                    'content' => $exercise->content,
                    'sort_order' => $exercise->sort_order,
                    'is_completed' => in_array($exercise->id, $this->completed_exercise_ids ?? [], true),
                ])->values()
                : [],
            'quiz' => $this->relationLoaded('quiz') && $this->quiz
                ? [
                    'id' => $this->quiz->id,
                    'title' => $this->quiz->title,
                    'passing_score' => $this->quiz->passing_score,
                    'questions' => collect($this->quiz->questions ?? [])->map(fn ($q) => [
                        'question' => $q['question'] ?? $q['body'] ?? '',
                        'options' => $q['options'] ?? [],
                    ])->values(),
                ]
                : null,
        ];
    }
}
