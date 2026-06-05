import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Star, Users, ArrowRight } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const CourseCard = ({ course }) => {
  // Mock data fallback if props are missing
  const {
    id = 1,
    slug,
    title = 'Course Title',
    instructor = { name: 'Instructor Name' },
    price = 0,
    level = 'beginner',
    thumbnail = null,
    rating = 4.5,
    students_count = 0,
    duration = '2h 30m'
  } = course || {};

  const levelColors = {
    beginner: 'bg-emerald-100 text-emerald-700',
    intermediate: 'bg-blue-100 text-blue-700',
    expert: 'bg-purple-100 text-purple-700'
  };

  return (
    <GlassCard hover className="flex flex-col h-full overflow-hidden p-0 border border-gray-100 shadow-sm transition-all duration-300">
      {/* Thumbnail */}
      <div className="relative h-48 bg-gray-200 overflow-hidden group">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-400 to-secondary-500 text-white font-bold text-xl">
            {title.substring(0, 2).toUpperCase()}
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${levelColors[level]}`}>
            {level}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-900 text-lg line-clamp-2 mb-2 leading-tight">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mb-4">By {instructor.name}</p>

        {/* Stats */}
        <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
          <div className="flex items-center space-x-1 text-amber-500">
            <Star size={16} className="fill-current" />
            <span className="font-medium text-gray-700">{rating}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users size={16} />
            <span>{students_count}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock size={16} />
            <span>{duration}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
          <span className="text-xl font-extrabold text-primary-600">
            {price > 0 ? `$${price}` : 'Free'}
          </span>
          
          <Link 
            to={`/courses/${slug || id}`}
            className="inline-flex items-center justify-center p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
          >
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </GlassCard>
  );
};

export default CourseCard;
