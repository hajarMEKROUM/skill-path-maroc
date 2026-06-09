import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PenLine } from 'lucide-react';

const LessonExercises = ({ exercises }) => {
  if (!exercises?.length) return null;

  return (
    <div className="mt-10 pt-8 border-t border-slate-100">
      <div className="flex items-center gap-2 mb-6">
        <PenLine size={20} className="text-primary-600" />
        <h3 className="text-lg font-bold text-slate-900">Exercices pratiques</h3>
      </div>
      <div className="space-y-4">
        {exercises.map((exercise, index) => (
          <div
            key={exercise.id ?? index}
            className="rounded-xl border border-primary-100 bg-primary-50/40 p-5"
          >
            {exercise.title && (
              <h4 className="font-semibold text-slate-900 mb-3">
                Exercice {index + 1} : {exercise.title}
              </h4>
            )}
            <div className="prose prose-sm max-w-none text-slate-700">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{exercise.content}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonExercises;
