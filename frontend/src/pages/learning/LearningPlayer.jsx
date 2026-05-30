import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useLearningStore from '../../store/learningStore';
import VideoPlayer from '../../components/learning/VideoPlayer';
import LessonSidebar from '../../components/learning/LessonSidebar';
import LessonContent from '../../components/learning/LessonContent';
import { ArrowLeft } from 'lucide-react';

const LearningPlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { initPlayer, currentLesson, isLoading, error } = useLearningStore();

  useEffect(() => {
    if (courseId) {
      initPlayer(courseId);
    }
    
    // Cleanup on unmount can be added here if needed
  }, [courseId, initPlayer]);

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
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* Top Navbar specifically for player */}
        <div className="h-16 bg-gray-900 flex items-center px-6 flex-shrink-0 sticky top-0 z-20">
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

        {/* Player & Content Container */}
        <div className="flex-1 p-4 lg:p-8 max-w-6xl mx-auto w-full">
          <VideoPlayer 
            url={currentLesson?.video_url} 
            lessonId={currentLesson?.id} 
          />
          <LessonContent />
        </div>
      </div>

      {/* Curriculum Sidebar */}
      <LessonSidebar />
      
    </div>
  );
};

export default LearningPlayer;
