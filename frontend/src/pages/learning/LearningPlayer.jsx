import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import useLearningStore from '../../store/learningStore';
import VideoPlayer from '../../components/learning/VideoPlayer';
import LessonSidebar from '../../components/learning/LessonSidebar';
import LessonContent from '../../components/learning/LessonContent';

const LearningPlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const {
    initPlayer,
    currentLesson,
    isLoading,
    error,
    selectLesson,
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

  if (isLoading && !currentLesson) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">Error loading course</h2>
          <p>{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-16 bg-gray-900 flex items-center px-6 sticky top-0 z-30">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span className="font-medium hidden sm:inline">Back to Dashboard</span>
        </button>

        <div className="ml-auto text-white font-medium truncate px-4">
          {currentLesson ? currentLesson.title : 'Loading...'}
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
          <div className="space-y-6">
            <VideoPlayer
              url={currentLesson?.video_url}
              lessonId={currentLesson?.id}
            />
            <LessonContent />

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => previousLessonId && selectLesson(previousLessonId)}
                disabled={!previousLessonId}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
                Previous lesson
              </button>

              <button
                type="button"
                onClick={() => nextLessonId && selectLesson(nextLessonId)}
                disabled={!nextLessonId}
                className="inline-flex items-center gap-2 rounded-lg border border-primary-600 bg-primary-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next lesson
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="xl:sticky xl:top-20">
            <LessonSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPlayer;
