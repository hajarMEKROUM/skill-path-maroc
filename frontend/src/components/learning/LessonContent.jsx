import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useLearningStore from '../../store/learningStore';
import LessonExercises from './LessonExercises';
import LessonQuiz from './LessonQuiz';

const LessonContent = () => {
  const { currentLesson } = useLearningStore();

  if (!currentLesson) return null;

  return (
    <article className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <header className="border-b border-slate-100 px-6 py-5 bg-slate-50/80">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-600 mb-1">
          Leçon {currentLesson.sort_order}
        </p>
        <h2 className="text-xl lg:text-2xl font-bold text-slate-900">{currentLesson.title}</h2>
        {currentLesson.is_preview && (
          <span className="inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
            Aperçu gratuit
          </span>
        )}
      </header>

      <div className="px-6 py-8">
        <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-a:text-primary-600 prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-li:marker:text-primary-500">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {currentLesson.content || '*Aucun contenu disponible pour cette leçon.*'}
          </ReactMarkdown>
        </div>

        <LessonExercises exercises={currentLesson.exercises} />
        <LessonQuiz quiz={currentLesson.quiz} />
      </div>
    </article>
  );
};

export default LessonContent;
