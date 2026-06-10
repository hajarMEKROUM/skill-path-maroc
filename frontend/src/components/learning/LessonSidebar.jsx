import React from 'react';
import { CheckCircle2, Circle, PlayCircle, Video, FileText } from 'lucide-react';
import useLearningStore from '../../store/learningStore';

const LessonSidebar = () => {
  const { lessons, currentLesson, courseTitle, courseProgress, selectLesson } = useLearningStore();

  return (
    <div className="flex flex-col h-full min-h-[320px] lg:min-h-0">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">
          {courseTitle || 'Contenu du cours'}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {lessons.length} leçon{lessons.length > 1 ? 's' : ''}
        </p>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-600 font-medium">Progression globale</span>
            <span className="font-bold text-primary-600">{courseProgress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div
              className="bg-primary-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${courseProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {lessons.map((lesson, index) => {
          const isActive = currentLesson?.id === lesson.id;
          const progress = lesson.progress_percent ?? 0;
          const isComplete = lesson.is_completed || progress >= 100;

          return (
            <button
              key={lesson.id}
              type="button"
              onClick={() => selectLesson(lesson.id)}
              className={`w-full text-left px-3 py-3 rounded-lg transition-all flex items-start gap-3 ${
                isActive
                  ? 'bg-primary-50 border-l-4 border-l-primary-600 border border-primary-100 shadow-sm'
                  : 'hover:bg-slate-50 border border-transparent border-l-4 border-l-transparent'
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
                  <span>· {progress}%</span>
                </div>
                <div className="mt-1.5 w-full bg-slate-100 rounded-full h-1">
                  <div
                    className="bg-primary-500 h-1 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
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
