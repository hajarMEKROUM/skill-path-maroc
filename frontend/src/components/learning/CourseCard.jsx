import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, BookOpen, Tag } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const levelColors = {
  beginner: 'bg-emerald-100 text-emerald-700',
  intermediate: 'bg-blue-100 text-blue-700',
  expert: 'bg-purple-100 text-purple-700',
};

const CourseCard = ({ course }) => {
  if (!course?.id) return null;

  const {
    id,
    slug,
    title,
    description,
    instructorName,
    price,
    level,
    category,
    thumbnail,
    durationLabel,
    lessonsCount,
  } = course;

  const levelClass = levelColors[level] || 'bg-gray-100 text-gray-700';

  return (
    <GlassCard
      hover
      className="flex flex-col h-full overflow-hidden p-0 border border-gray-100 shadow-sm transition-all duration-300"
    >
      <div className="relative h-44 bg-gray-200 overflow-hidden group">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-500 text-white font-bold text-2xl">
            {title.substring(0, 2).toUpperCase()}
          </div>
        )}

        {level && (
          <div className="absolute top-3 left-3">
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${levelClass}`}>
              {level}
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-900 text-lg line-clamp-2 mb-2 leading-tight">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{description}</p>
        )}

        {instructorName && (
          <p className="text-xs text-gray-400 mb-3">By {instructorName}</p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
          {category && (
            <span className="inline-flex items-center gap-1 capitalize">
              <Tag size={14} />
              {category}
            </span>
          )}
          {durationLabel && (
            <span className="inline-flex items-center gap-1">
              <Clock size={14} />
              {durationLabel}
            </span>
          )}
          {lessonsCount != null && lessonsCount > 0 && (
            <span className="inline-flex items-center gap-1">
              <BookOpen size={14} />
              {lessonsCount} {lessonsCount === 1 ? 'lesson' : 'lessons'}
            </span>
          )}
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
          <span className="text-lg font-extrabold text-primary-600">
            {price > 0 ? `${price} MAD` : 'Free'}
          </span>

          <Link
            to={`/courses/${slug || id}`}
            className="inline-flex items-center justify-center p-2.5 rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
            aria-label={`View ${title}`}
          >
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </GlassCard>
  );
};

export default CourseCard;
