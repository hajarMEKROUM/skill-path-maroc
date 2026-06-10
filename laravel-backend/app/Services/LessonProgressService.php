<?php

namespace App\Services;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Exercise;
use App\Models\Lesson;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class LessonProgressService
{
    public const WEIGHT_CONTENT = 50;

    public const WEIGHT_EXERCISES = 30;

    public const WEIGHT_QUIZ = 20;

    public function attachProgressToLessons($lessons, ?User $user): void
    {
        if (! $user || $lessons->isEmpty()) {
            return;
        }

        $rows = DB::table('lesson_progress')
            ->where('user_id', $user->id)
            ->whereIn('lesson_id', $lessons->pluck('id'))
            ->get()
            ->keyBy('lesson_id');

        foreach ($lessons as $lesson) {
            $row = $rows->get($lesson->id);
            $exerciseTotal = $lesson->relationLoaded('exercises') ? $lesson->exercises->count() : 0;
            $progress = $row ? $this->calculatePercent($row, $exerciseTotal) : 0;

            $lesson->setAttribute('progress_percent', $progress);
            $lesson->setAttribute('content_completed', (bool) ($row->content_completed ?? false));
            $lesson->setAttribute('quiz_score', (int) ($row->quiz_score ?? 0));
            $lesson->setAttribute('completed_exercise_ids', json_decode($row->completed_exercise_ids ?? '[]', true) ?: []);
            $lesson->setAttribute('is_completed', $progress >= 100 || (bool) ($row->is_completed ?? false));
        }
    }

    public function calculatePercent(object $row, int $exerciseTotal): int
    {
        $percent = 0;

        if ($row->content_completed ?? false) {
            $percent += self::WEIGHT_CONTENT;
        }

        $completedIds = json_decode($row->completed_exercise_ids ?? '[]', true) ?: [];
        if ($exerciseTotal > 0) {
            $percent += (count($completedIds) / $exerciseTotal) * self::WEIGHT_EXERCISES;
        } else {
            $percent += self::WEIGHT_EXERCISES;
        }

        $percent += ((int) ($row->quiz_score ?? 0) / 100) * self::WEIGHT_QUIZ;

        return min(100, (int) round($percent));
    }

    public function markContentComplete(Lesson $lesson, User $user): array
    {
        $this->upsertField($user->id, $lesson->id, ['content_completed' => true]);

        return $this->syncLesson($lesson, $user);
    }

    public function submitExercise(Exercise $exercise, User $user, string $answer): array
    {
        $lesson = $exercise->lesson;
        $normalized = $this->normalize($answer);
        $expected = $this->normalize($exercise->expected_answer ?? '');

        $correct = $expected !== ''
            ? $normalized === $expected
            : strlen(trim($answer)) >= 3;

        if ($correct) {
            $row = $this->getRow($user->id, $lesson->id);
            $completed = json_decode($row->completed_exercise_ids ?? '[]', true) ?: [];
            if (! in_array($exercise->id, $completed, true)) {
                $completed[] = $exercise->id;
            }
            $this->upsertField($user->id, $lesson->id, [
                'completed_exercise_ids' => json_encode(array_values($completed)),
            ]);
        }

        $sync = $this->syncLesson($lesson, $user);

        return array_merge($sync, [
            'correct' => $correct,
            'hint' => $correct ? null : ($exercise->hint ?? 'Réessayez en relisant la leçon.'),
        ]);
    }

    public function validateQuizAnswer(Lesson $lesson, User $user, int $questionIndex, string $selected): array
    {
        $quiz = $lesson->quiz;
        if (! $quiz || ! is_array($quiz->questions)) {
            abort(404, 'Quiz introuvable.');
        }

        $question = $quiz->questions[$questionIndex] ?? null;
        if (! $question) {
            abort(422, 'Question invalide.');
        }

        $correctAnswer = $question['answer'] ?? $question['correct_answer'] ?? '';
        $isCorrect = $this->normalize($selected) === $this->normalize($correctAnswer);

        $row = $this->getRow($user->id, $lesson->id);
        $quizAnswers = json_decode($row->quiz_answers ?? '{}', true) ?: [];
        $quizAnswers[$questionIndex] = [
            'selected' => $selected,
            'correct' => $isCorrect,
        ];

        $totalQuestions = count($quiz->questions);
        $correctCount = collect($quizAnswers)->filter(fn ($a) => $a['correct'] ?? false)->count();
        $quizScore = $totalQuestions > 0 ? (int) round(($correctCount / $totalQuestions) * 100) : 0;

        $this->upsertField($user->id, $lesson->id, [
            'quiz_answers' => json_encode($quizAnswers),
            'quiz_score' => $quizScore,
        ]);

        $sync = $this->syncLesson($lesson->fresh(['exercises', 'quiz']), $user);

        return array_merge($sync, [
            'correct' => $isCorrect,
            'explanation' => $question['explanation'] ?? ($isCorrect
                ? 'Bonne réponse !'
                : 'La bonne réponse est : '.$correctAnswer),
            'correct_answer' => $isCorrect ? null : $correctAnswer,
            'quiz_score' => $quizScore,
        ]);
    }

    public function syncLesson(Lesson $lesson, User $user): array
    {
        $lesson->loadMissing('exercises', 'quiz', 'course');
        $row = $this->getRow($user->id, $lesson->id);
        $exerciseTotal = $lesson->exercises->count();
        $progressPercent = $this->calculatePercent($row, $exerciseTotal);
        $isCompleted = $progressPercent >= 100;

        DB::table('lesson_progress')->where('user_id', $user->id)
            ->where('lesson_id', $lesson->id)
            ->update([
                'progress_percent' => $progressPercent,
                'is_completed' => $isCompleted,
                'updated_at' => now(),
            ]);

        $courseProgress = $this->syncEnrollmentProgress($lesson->course, $user);

        $certificate = $lesson->course
            ? app(CertificateService::class)->issueIfCourseCompleted($lesson->course, $user)
            : null;

        return [
            'progress_percent' => $progressPercent,
            'is_completed' => $isCompleted,
            'content_completed' => (bool) $row->content_completed,
            'quiz_score' => (int) $row->quiz_score,
            'completed_exercise_ids' => json_decode($row->completed_exercise_ids ?? '[]', true) ?: [],
            'course_progress' => $courseProgress,
            'certificate' => $certificate ? [
                'id' => $certificate->id,
                'certificate_number' => $certificate->certificate_number,
                'course_title' => $certificate->course?->title,
                'issued_at' => $certificate->issued_at,
            ] : null,
            'course_completed' => (bool) $certificate,
        ];
    }

    public function syncEnrollmentProgress(?Course $course, User $user): int
    {
        if (! $course) {
            return 0;
        }

        $lessons = $course->lessons()->pluck('id');
        if ($lessons->isEmpty()) {
            return 0;
        }

        $avgProgress = (int) round(
            DB::table('lesson_progress')
                ->where('user_id', $user->id)
                ->whereIn('lesson_id', $lessons)
                ->avg('progress_percent') ?? 0
        );

        Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->update(['progress' => $avgProgress]);

        return $avgProgress;
    }

    protected function getRow(int $userId, int $lessonId): object
    {
        $row = DB::table('lesson_progress')
            ->where('user_id', $userId)
            ->where('lesson_id', $lessonId)
            ->first();

        if ($row) {
            return $row;
        }

        DB::table('lesson_progress')->insert([
            'user_id' => $userId,
            'lesson_id' => $lessonId,
            'time_watched' => 0,
            'is_completed' => false,
            'content_completed' => false,
            'quiz_score' => 0,
            'completed_exercise_ids' => json_encode([]),
            'progress_percent' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return $this->getRow($userId, $lessonId);
    }

    protected function upsertField(int $userId, int $lessonId, array $fields): void
    {
        $this->getRow($userId, $lessonId);

        DB::table('lesson_progress')->updateOrInsert(
            ['user_id' => $userId, 'lesson_id' => $lessonId],
            array_merge($fields, ['updated_at' => now(), 'created_at' => now()])
        );
    }

    protected function normalize(string $value): string
    {
        return strtolower(trim($value));
    }
}
