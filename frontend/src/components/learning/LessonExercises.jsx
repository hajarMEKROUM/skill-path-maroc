import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PenLine, CheckCircle, Loader2 } from 'lucide-react';
import useLearningStore from '../../store/learningStore';
import { lessonService } from '../../services/lesson.service';

const LessonExercises = ({ exercises }) => {
  const { currentLesson, applyProgressUpdate } = useLearningStore();
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  if (!exercises?.length || !currentLesson) return null;

  const handleSubmit = async (exercise) => {
    const answer = answers[exercise.id]?.trim();
    if (!answer || loadingId) return;

    setLoadingId(exercise.id);
    try {
      const data = await lessonService.submitExercise(exercise.id, answer);
      setResults((prev) => ({
        ...prev,
        [exercise.id]: { correct: data.correct, hint: data.hint },
      }));
      if (data.correct) {
        applyProgressUpdate(currentLesson.id, data);
      }
    } catch {
      setResults((prev) => ({
        ...prev,
        [exercise.id]: { correct: false, hint: 'Erreur de soumission. Réessayez.' },
      }));
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="mt-10 pt-8 border-t border-slate-100">
      <div className="flex items-center gap-2 mb-6">
        <PenLine size={20} className="text-primary-600" />
        <h3 className="text-lg font-bold text-slate-900">Exercices pratiques</h3>
      </div>
      <div className="space-y-5">
        {exercises.map((exercise, index) => {
          const result = results[exercise.id];
          const done = exercise.is_completed || result?.correct;

          return (
            <div
              key={exercise.id ?? index}
              className={`rounded-xl border p-5 ${
                done ? 'border-emerald-200 bg-emerald-50/40' : 'border-primary-100 bg-primary-50/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-slate-900">
                  Exercice {index + 1} : {exercise.title}
                </h4>
                {done && <CheckCircle className="text-emerald-600" size={20} />}
              </div>
              <div className="prose prose-sm max-w-none text-slate-700 mb-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{exercise.content}</ReactMarkdown>
              </div>

              {!done && (
                <div className="space-y-3">
                  <textarea
                    value={answers[exercise.id] ?? ''}
                    onChange={(e) =>
                      setAnswers((prev) => ({ ...prev, [exercise.id]: e.target.value }))
                    }
                    placeholder="Tapez votre réponse ici..."
                    rows={3}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleSubmit(exercise)}
                    disabled={!answers[exercise.id]?.trim() || loadingId === exercise.id}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    {loadingId === exercise.id && <Loader2 size={16} className="animate-spin" />}
                    Valider ma réponse
                  </button>
                </div>
              )}

              {result && !result.correct && (
                <p className="mt-3 text-sm text-amber-800 bg-amber-50 rounded-lg px-3 py-2">
                  Indice : {result.hint}
                </p>
              )}
              {done && (
                <p className="mt-2 text-sm text-emerald-700 font-medium">Exercice complété !</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LessonExercises;
