import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useMyCourses } from '../../hooks/useCourses';
import MyCourseCard from '../../components/learning/MyCourseCard';
import { MyCoursesSkeleton } from '../../components/learning/CourseCardSkeleton';
import CoursesErrorState from '../../components/learning/CoursesErrorState';
import CoursesEmptyState from '../../components/learning/CoursesEmptyState';

export default function StudentCourses() {
  const { courses, activeCourses, completedCourses, isLoading, error, refetch } = useMyCourses();

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="text-primary-600 flex-shrink-0" />
          My Courses
        </h1>
        <p className="text-gray-500 mt-1">
          Your enrolled courses — continue learning or review completed ones.
        </p>
      </div>

      {error && <CoursesErrorState message={error} onRetry={refetch} />}

      {isLoading && !error && <MyCoursesSkeleton count={3} />}

      {!isLoading && !error && courses.length === 0 && (
        <CoursesEmptyState
          title="No enrolled courses"
          description="You are not enrolled in any courses yet. Browse the catalog to start learning."
          action={
            <Link to="/courses" className="btn-primary px-5 py-2.5 text-sm">
              Browse Courses
            </Link>
          }
        />
      )}

      {!isLoading && !error && courses.length > 0 && (
        <div className="space-y-8">
          {activeCourses.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                In Progress ({activeCourses.length})
              </h2>
              <div className="space-y-4">
                {activeCourses.map((course) => (
                  <MyCourseCard key={course.enrollmentId || course.id} course={course} />
                ))}
              </div>
            </section>
          )}

          {completedCourses.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Completed ({completedCourses.length})
              </h2>
              <div className="space-y-4">
                {completedCourses.map((course) => (
                  <MyCourseCard key={course.enrollmentId || course.id} course={course} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
