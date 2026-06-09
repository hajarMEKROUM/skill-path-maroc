import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import useLearningStore from '../../store/learningStore';
import VideoPlayer from '../../components/learning/VideoPlayer';
import LessonSidebar from '../../components/learning/LessonSidebar';
import LessonContent from '../../components/learning/LessonContent';
import CourseCertificateBanner from '../../components/learning/CourseCertificateBanner';

const LearningPlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const {
    initPlayer,
    currentLesson,
    courseTitle,
    certificate,
    courseCompleted,
    completedLessonIds,
    isLoading,
    error,
    selectLesson,
    markLessonComplete,
    getNextLessonId,
    getPreviousLessonId,
  } = useLearningStore();

  useEffect(() => {
    if (courseId) {
      initPlayer(courseId);
    }
  }, [courseId, initPlayer]);

  const nextLessonId = getNextLessonId();
  const previousLessonId = getPreviousLessonId();
  const isCurrentComplete = currentLesson && completedLessonIds.includes(currentLesson.id);

  if (isLoading && !currentLesson) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">Erreur de chargement</h2>
          <p>{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="h-14 bg-slate-900 flex items-center px-4 lg:px-6 sticky top-0 z-40 border-b border-slate-800">
        <button
          onClick={() => navigate('/dashboard/courses')}
          className="flex items-center text-slate-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={18} className="mr-2" />
          <span className="hidden sm:inline">Retour aux cours</span>
        </button>
        <div className="mx-4 flex-1 min-w-0 text-center">
          <p className="text-xs text-slate-500 truncate">{courseTitle}</p>
          <p className="text-sm font-medium text-white truncate">
            {currentLesson?.title ?? 'Chargement...'}
          </p>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        <main className="flex-1 min-w-0 p-4 lg:p-6 lg:pr-4 space-y-5 max-w-5xl">
          {courseCompleted && certificate && (
            <CourseCertificateBanner certificate={certificate} />
          )}

          {currentLesson?.video_url && (
            <VideoPlayer url={currentLesson.video_url} />
          )}

          <LessonContent />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <button
              type="button"
              onClick={() => previousLessonId && selectLesson(previousLessonId)}
              disabled={!previousLessonId}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
              Leçon précédente
            </button>

            {!isCurrentComplete && currentLesson && (
              <button
                type="button"
                onClick={() => markLessonComplete(currentLesson.id)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-600 bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
              >
                <CheckCircle size={16} />
                Marquer comme terminée
              </button>
            )}

            <button
              type="button"
              onClick={() => nextLessonId && selectLesson(nextLessonId)}
              disabled={!nextLessonId}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary-600 bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Leçon suivante
              <ChevronRight size={16} />
            </button>
          </div>
        </main>

        <aside className="w-full lg:w-[340px] xl:w-[380px] shrink-0 lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] border-t lg:border-t-0 lg:border-l border-slate-200 bg-white">
          <LessonSidebar />
        </aside>
      </div>
    </div>
  );
};

export default LearningPlayer;
