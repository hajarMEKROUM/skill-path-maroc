import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlayCircle, CheckCircle, Clock, Tag } from 'lucide-react';

const MyCourseCard = ({ course }) => {
  if (!course?.id) return null;

  const progress = course.progress ?? 0;
  const isCompleted = progress >= 100 || Boolean(course.completedAt);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-48 h-36 sm:h-auto bg-gray-100 flex-shrink-0 relative">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full min-h-[144px] flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-500 text-white font-bold text-xl">
              {course.title?.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 p-5 flex flex-col">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {course.level && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 capitalize">
                {course.level}
              </span>
            )}
            {course.category && course.category !== course.level && (
              <span className="text-xs text-gray-500 inline-flex items-center gap-1 capitalize">
                <Tag size={12} />
                {course.category}
              </span>
            )}
            {isCompleted ? (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 inline-flex items-center gap-1">
                <CheckCircle size={12} />
                Completed
              </span>
            ) : (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                In progress
              </span>
            )}
          </div>

          <h2 className="text-lg font-bold text-gray-900 line-clamp-1">{course.title}</h2>

          {course.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500">
            {course.durationLabel && (
              <span className="inline-flex items-center gap-1">
                <Clock size={13} />
                {course.durationLabel}
              </span>
            )}
            {course.enrolledAt && (
              <span>
                Enrolled {new Date(course.enrolledAt).toLocaleDateString('en-US')}
              </span>
            )}
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  isCompleted ? 'bg-emerald-500' : 'bg-primary-500'
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
            <Link
              to={`/dashboard/learn/${course.id}`}
              className="btn-primary inline-flex items-center gap-2 py-2 px-4 text-sm"
            >
              <PlayCircle size={16} />
              {isCompleted ? 'Review course' : 'Continue learning'}
            </Link>
            <Link
              to={`/courses/${course.slug || course.id}`}
              className="inline-flex items-center py-2 px-4 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
            >
              View details
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MyCourseCard;
