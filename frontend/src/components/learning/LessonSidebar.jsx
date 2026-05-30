import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, PlayCircle, Lock } from 'lucide-react';
import useLearningStore from '../../store/learningStore';

const LessonSidebar = () => {
  const { lessons, currentLesson, completedLessonIds, selectLesson } = useLearningStore();

  // Calculate total progress
  const progressPercent = lessons.length > 0 
    ? Math.round((completedLessonIds.length / lessons.length) * 100) 
    : 0;

  return (
    <div className="w-full lg:w-80 flex-shrink-0 bg-white border-l border-gray-200 h-[calc(100vh-4rem)] flex flex-col shadow-soft z-10">
      
      {/* Sidebar Header & Progress */}
      <div className="p-6 border-b border-gray-100 bg-gray-50">
        <h3 className="font-bold text-gray-900 mb-4">Course Curriculum</h3>
        
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600 font-medium">Your Progress</span>
          <span className="font-bold text-primary-600">{progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <motion.div 
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2 text-right">
          {completedLessonIds.length} of {lessons.length} complete
        </p>
      </div>

      {/* Lesson List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {lessons.map((lesson, index) => {
          const isComplete = completedLessonIds.includes(lesson.id);
          const isActive = currentLesson?.id === lesson.id;
          
          return (
            <button
              key={lesson.id}
              onClick={() => selectLesson(lesson.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-start space-x-3 group ${
                isActive 
                  ? 'bg-primary-50 border border-primary-200 shadow-sm' 
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {isComplete ? (
                  <CheckCircle className="text-emerald-500 w-5 h-5" />
                ) : isActive ? (
                  <PlayCircle className="text-primary-600 w-5 h-5 animate-pulse" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-primary-400 transition-colors" />
                )}
              </div>
              
              <div className="flex-1">
                <p className={`text-sm font-medium leading-tight ${isActive ? 'text-primary-900' : 'text-gray-700'}`}>
                  {index + 1}. {lesson.title}
                </p>
                <div className="flex items-center mt-1 space-x-2 text-xs text-gray-500">
                  <span>{lesson.duration || '10:00'}</span>
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
