import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { useCourses } from '../../hooks/useCourses';
import CourseCard from '../../components/learning/CourseCard';
import SkeletonCard from '../../components/shared/SkeletonCard';
import EmptyState from '../../components/shared/EmptyState';
import ErrorState from '../../components/shared/ErrorState';

const CourseCatalog = () => {
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({ search: '', level: '' });
  const { data: courses, loading, error, refetch } = useCourses(filters);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleLevelFilter = (e) => {
    setFilters((prev) => ({ ...prev, level: e.target.value }));
  };

  const rawList = Array.isArray(courses?.data) ? courses.data : (Array.isArray(courses) ? courses : []);
  const courseList = rawList.filter((course) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchTitle = course.title?.toLowerCase().includes(q);
      const matchDesc = course.description?.toLowerCase().includes(q);
      const matchInstructor = course.instructor?.name?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchInstructor) return false;
    }
    if (filters.level && course.level !== filters.level) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 animate-fade-in">
      
      {/* Header & Search */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
          Maîtrisez de nouvelles compétences, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">accélérez votre carrière.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Explorez notre vaste catalogue de formations conçues par des experts de l'industrie.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-soft border border-gray-100 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
            placeholder="Rechercher des formations, compétences, ou instructeurs..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="flex items-center space-x-2 text-gray-500">
            <Filter size={20} />
            <span className="text-sm font-medium">Filtres :</span>
          </div>
          <select 
            className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-xl bg-gray-50 border cursor-pointer"
            value={filters.level}
            onChange={handleLevelFilter}
          >
            <option value="">Tous les niveaux</option>
            <option value="beginner">Débutant</option>
            <option value="intermediate">Intermédiaire</option>
            <option value="expert">Expert</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : courseList.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {courseList.map(course => (
            <motion.div 
              key={course.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState 
          message="Aucune formation disponible pour le moment." 
          icon={Search} 
        />
      )}
    </div>
  );
};

export default CourseCatalog;
