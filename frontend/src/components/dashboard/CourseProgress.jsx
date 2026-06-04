import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, CheckCircle, Clock } from 'lucide-react';

const CourseProgress = ({ courses = [] }) => {
  return (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Current Courses</h3>
        <button className="text-sm font-medium text-primary-600 hover:text-primary-700">View All</button>
      </div>

      {courses.length > 0 ? (
        <div className="space-y-4">
          {courses.map((course, index) => (
            <motion.div 
              key={course.id || index}
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
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {course.timeLeft} left
                  </span>
                  <span className="flex items-center text-primary-600 font-medium">
                    {course.progress === 100 ? (
                      <><CheckCircle className="w-3 h-3 mr-1" /> Completed</>
                    ) : (
                      `${course.progress}%`
                    )}
                  </span>
                </div>
                
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-primary-500 h-1.5 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 text-sm">
          You are not enrolled in any courses yet.
        </div>
      )}
    </div>
  );
};

export default CourseProgress;
