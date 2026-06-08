import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { useCourseCatalog } from '../../hooks/useCourses';
import CourseCard from '../../components/learning/CourseCard';
import { CourseCatalogSkeleton } from '../../components/learning/CourseCardSkeleton';
import CoursesErrorState from '../../components/learning/CoursesErrorState';
import CoursesEmptyState from '../../components/learning/CoursesEmptyState';

const CourseCatalog = () => {
  const {
    courses,
    filters,
    pagination,
    isLoading,
    error,
    hasActiveFilters,
    setFilters,
    refetch,
    goToPage,
  } = useCourseCatalog();

  const handleSearch = (event) => {
    setFilters({ search: event.target.value }, { debounce: true });
  };

  const handleLevelFilter = (event) => {
    setFilters({ level: event.target.value });
  };

  const showEmptyCatalog = !isLoading && !error && courses.length === 0 && !hasActiveFilters;
  const showEmptySearch = !isLoading && !error && courses.length === 0 && hasActiveFilters;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 animate-fade-in">
      <div className="mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          Master new skills,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">
            accelerate your career.
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto">
          Explore our catalog of courses designed by industry experts.
        </p>
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-soft border border-gray-100 mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="relative w-full lg:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
            placeholder="Search courses, skills, or instructors..."
            value={filters.search}
            onChange={handleSearch}
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 text-gray-500 flex-shrink-0">
            <Filter size={18} />
            <span className="text-sm font-medium">Level</span>
          </div>
          <select
            className="block w-full lg:w-48 pl-3 pr-10 py-2.5 text-sm border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-xl bg-gray-50 border cursor-pointer"
            value={filters.level}
            onChange={handleLevelFilter}
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
        </div>
      </div>

      {error && <CoursesErrorState message={error} onRetry={refetch} />}

      {isLoading && !error && <CourseCatalogSkeleton count={8} />}

      {!isLoading && !error && courses.length > 0 && (
        <>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.06 },
              },
            }}
          >
            {courses.map((course) => (
              <motion.div
                key={course.id}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </motion.div>

          {pagination.lastPage > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={pagination.currentPage <= 1}
                onClick={() => goToPage(pagination.currentPage - 1)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {pagination.currentPage} of {pagination.lastPage}
              </span>
              <button
                type="button"
                disabled={pagination.currentPage >= pagination.lastPage}
                onClick={() => goToPage(pagination.currentPage + 1)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showEmptyCatalog && (
        <CoursesEmptyState
          title="No courses available yet"
          description="No courses available yet. Please check later."
        />
      )}

      {showEmptySearch && (
        <CoursesEmptyState
          variant="search"
          title="No courses found"
          description="Try adjusting your search or filters to find what you're looking for."
        />
      )}
    </div>
  );
};

export default CourseCatalog;
