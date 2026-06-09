import React from 'react';
import { CheckCircle2, Circle, PlayCircle, Video, FileText } from 'lucide-react';
import useLearningStore from '../../store/learningStore';

const LessonSidebar = () => {
  const { lessons, currentLesson, completedLessonIds, selectLesson, courseTitle } =
    useLearningStore();

  const progressPercent =
    lessons.length > 0
      ? Math.round((completedLessonIds.length / lessons.length) * 100)
      : 0;

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-slate-100">
        <h3 className="font-bold text-slate-900 text-base leading-snug">
          {courseTitle || 'Contenu du cours'}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {lessons.length} leçon{lessons.length > 1 ? 's' : ''}
        </p>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-600 font-medium">Progression</span>
            <span className="font-bold text-primary-600">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1.5">
            {completedLessonIds.length} / {lessons.length} terminée
            {completedLessonIds.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {lessons.map((lesson, index) => {
          const isComplete = completedLessonIds.includes(lesson.id);
          const isActive = currentLesson?.id === lesson.id;

          return (
            <button
              key={lesson.id}
              type="button"
              onClick={() => selectLesson(lesson.id)}
              className={`w-full text-left px-3 py-3 rounded-lg transition-all flex items-start gap-3 ${
                isActive
                  ? 'bg-primary-50 border border-primary-200 shadow-sm'
                  : 'hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isComplete ? (
                  <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                ) : isActive ? (
                  <PlayCircle className="text-primary-600 w-5 h-5" />
                ) : (
                  <Circle className="text-slate-300 w-5 h-5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium leading-snug ${
                    isActive ? 'text-primary-900' : 'text-slate-700'
                  }`}
                >
                  {index + 1}. {lesson.title}
                </p>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                  {lesson.video_url ? (
                    <>
                      <Video size={12} />
                      <span>Vidéo</span>
                    </>
                  ) : (
                    <>
                      <FileText size={12} />
                      <span>Lecture</span>
                    </>
                  )}
                  {lesson.duration_seconds > 0 && (
                    <span>· {Math.floor(lesson.duration_seconds / 60)} min</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LessonSidebar;
