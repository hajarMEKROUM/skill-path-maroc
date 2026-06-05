import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import useCoursesStore from '../../store/coursesStore';

export default function StudentCourses() {
  const { myCourses, fetchMyCourses } = useCoursesStore();

  useEffect(() => {
    fetchMyCourses();
  }, [fetchMyCourses]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <BookOpen className="text-primary-600" />
        Mes cours
      </h1>
      <p className="text-gray-500">
        Retrouvez ici vos cours en cours et terminés.
      </p>

      {myCourses.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-gray-500">
          <p className="mb-4">Vous n&apos;êtes inscrit à aucun cours pour le moment.</p>
          <Link to="/courses" className="inline-block btn-primary py-2 px-4 text-sm">
            Parcourir le catalogue
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {myCourses.map((course) => (
            <li key={course.id}>
              <Link
                to={`/courses/${course.slug || course.id}`}
                className="block rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
              >
                <h2 className="font-semibold text-gray-900">{course.title}</h2>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.description}</p>
                <p className="text-xs text-primary-600 mt-2 capitalize">{course.level}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
