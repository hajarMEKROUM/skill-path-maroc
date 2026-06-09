import { Link } from 'react-router-dom';
import { BookOpen, PlayCircle } from 'lucide-react';
import { useMyCourses } from '../../hooks/useMyCourses';
import ErrorState from '../../components/shared/ErrorState';
import SkeletonCard from '../../components/shared/SkeletonCard';

const levelLabels = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  expert: 'Expert',
};

export default function StudentCourses() {
  const { courses, loading, error, refetch } = useMyCourses();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <BookOpen className="text-purple-600" />
          Mes Formations
        </h1>
        <p className="text-gray-500 mt-1">
          Retrouvez ici vos formations en cours et terminées.
        </p>
      </div>

      {error && <ErrorState message={error} onRetry={refetch} />}

      {loading && (
        <div className="grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!loading && !error && courses.length === 0 && (
        <div className="page-card text-center py-10">
          <p className="text-gray-600 mb-4">Vous n&apos;êtes inscrit à aucune formation pour le moment.</p>
          <Link to="/courses" className="btn-primary py-2 px-6 inline-block">
            Parcourir le catalogue
          </Link>
        </div>
      )}

      {!loading && !error && courses.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {courses.map((course) => {
            const progress = course.enrollment?.progress ?? course.progress ?? 0;
            return (
              <div key={course.id} className="page-card">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="font-semibold text-gray-900 text-lg">{course.title}</h2>
                    {course.description && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">{course.description}</p>
                    )}
                    <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
                      {course.level && (
                        <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                          {levelLabels[course.level] || course.level}
                        </span>
                      )}
                      {course.instructor?.name && (
                        <span>Par {course.instructor.name}</span>
                      )}
                      {course.lessons_count != null && (
                        <span>{course.lessons_count} leçons</span>
                      )}
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Progression</span>
                        <span className="font-medium text-purple-600">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(100, progress)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/dashboard/learning/${course.id}`}
                    className="btn-primary flex items-center justify-center gap-2 py-2 px-4 text-sm flex-shrink-0"
                  >
                    <PlayCircle size={18} />
                    Accéder au parcours
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
