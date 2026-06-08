import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlayCircle, CheckCircle, BookOpen } from 'lucide-react';
import EmptyState from './EmptyState';

const CourseProgress = ({ courses = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 h-full animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-40 mb-6" />
        <div className="space-y-4">
          {[1, 2].map((item) => (
            <div key={item} className="h-16 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Active Courses</h3>
        {courses.length > 0 && (
          <Link to="/dashboard/courses" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            View All
          </Link>
        )}
      </div>

      {courses.length > 0 ? (
        <div className="space-y-4">
          {courses.map((course, index) => (
            <Link
              key={course.id || index}
              to={`/dashboard/learn/${course.id}`}
            >
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
            >
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600">
                    <PlayCircle className="w-6 h-6" />
                  </div>
                )}
              </div>
              
              <div className="ml-4 flex-1">
                <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{course.title}</h4>
                <div className="flex items-center mt-1 space-x-3 text-xs text-gray-500">
                  {course.level && (
                    <span className="capitalize">{course.level}</span>
                  )}
                  <span className="flex items-center text-primary-600 font-medium">
                    {(course.progress ?? 0) >= 100 || course.completed ? (
                      <><CheckCircle className="w-3 h-3 mr-1" /> Completed</>
                    ) : (
                      `${course.progress ?? 0}%`
                    )}
                  </span>
                </div>
                
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-primary-500 h-1.5 rounded-full"
                    style={{ width: `${course.progress ?? 0}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No active courses"
          description="You are not enrolled in any courses yet. Browse our catalog to start learning."
          action={
            <Link to="/courses" className="btn-primary px-4 py-2 text-sm">
              Browse Courses
            </Link>
          }
        />
      )}
    </div>
  );
};

export default CourseProgress;
