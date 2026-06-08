import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, CheckCircle, Layers } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { useDashboard } from '../../hooks/useDashboard';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import DashboardStatsGrid from '../../components/dashboard/DashboardStatsGrid';
import DashboardError from '../../components/dashboard/DashboardError';
import DashboardSkeleton from '../../components/dashboard/DashboardSkeleton';
import RecentActivity from '../../components/dashboard/RecentActivity';
import EmptyState from '../../components/dashboard/EmptyState';

const InstructorDashboard = () => {
  const userId = useAuthStore((state) => state.user?.id);
  const { data, isLoading, error, refetch } = useDashboard(userId);

  const stats = useMemo(
    () => [
      {
        key: 'students',
        title: 'Total Students',
        value: data?.stats?.total_students ?? 0,
        icon: Users,
        colorClass: 'bg-blue-100 text-blue-600',
      },
      {
        key: 'courses',
        title: 'My Courses',
        value: data?.stats?.total_courses ?? 0,
        icon: BookOpen,
        colorClass: 'bg-purple-100 text-purple-600',
      },
      {
        key: 'published',
        title: 'Published Courses',
        value: data?.stats?.published_courses ?? 0,
        icon: CheckCircle,
        colorClass: 'bg-emerald-100 text-emerald-600',
      },
      {
        key: 'active',
        title: 'Active Courses',
        value: data?.stats?.active_courses ?? 0,
        icon: Layers,
        colorClass: 'bg-orange-100 text-orange-600',
      },
    ],
    [data]
  );

  if (isLoading) {
    return <DashboardSkeleton statCount={4} />;
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Instructor Dashboard"
        subtitle="Manage your courses, students, and track your impact."
        action={
          <Link
            to="/dashboard/courses-admin"
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Manage Courses
          </Link>
        }
      />

      {error && <DashboardError message={error} onRetry={refetch} />}

      {!error && (
        <>
          <DashboardStatsGrid stats={stats} columns={4} />

          {(data?.stats?.total_courses ?? 0) === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No courses yet"
              description="You have not created any courses. Start by adding your first course to the platform."
              action={
                <Link to="/dashboard/courses-admin" className="btn-primary px-4 py-2 text-sm">
                  Create Course
                </Link>
              }
            />
          ) : (
            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Courses</h3>
              <ul className="space-y-3">
                {(data?.courses ?? []).map((course) => (
                  <li
                    key={course.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{course.title}</p>
                      <p className="text-xs text-gray-500 capitalize mt-1">
                        {course.status} · {course.enrollments_count ?? 0} students
                      </p>
                    </div>
                    <Link
                      to={`/courses/${course.slug || course.id}`}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <RecentActivity activities={data?.recentActivity ?? []} />
        </>
      )}
    </div>
  );
};

export default InstructorDashboard;
