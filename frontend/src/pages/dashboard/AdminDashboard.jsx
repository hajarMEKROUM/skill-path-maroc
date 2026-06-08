import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Briefcase, CheckCircle } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { useDashboard } from '../../hooks/useDashboard';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import DashboardStatsGrid from '../../components/dashboard/DashboardStatsGrid';
import DashboardError from '../../components/dashboard/DashboardError';
import DashboardSkeleton from '../../components/dashboard/DashboardSkeleton';
import RecentActivity from '../../components/dashboard/RecentActivity';

const AdminDashboard = () => {
  const userId = useAuthStore((state) => state.user?.id);
  const { data, isLoading, error, refetch } = useDashboard(userId);

  const stats = useMemo(
    () => [
      {
        key: 'users',
        title: 'Total Users',
        value: data?.stats?.total_users ?? 0,
        icon: Users,
        colorClass: 'bg-blue-100 text-blue-600',
      },
      {
        key: 'courses',
        title: 'Total Courses',
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
        key: 'jobs',
        title: 'Active Jobs',
        value: data?.stats?.active_jobs ?? 0,
        icon: Briefcase,
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
        title="Admin Control Panel"
        subtitle="Platform overview, metrics, and recent administrative activities."
        action={
          <Link
            to="/dashboard/reports"
            className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            View Reports
          </Link>
        }
      />

      {error && <DashboardError message={error} onRetry={refetch} />}

      {!error && (
        <>
          <DashboardStatsGrid stats={stats} columns={4} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-soft border border-gray-100 p-6 flex items-center justify-center min-h-[200px]">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Platform Health</h3>
                <p className="text-gray-500 text-sm">
                  {(data?.stats?.total_users ?? 0) === 0
                    ? 'No users registered yet.'
                    : 'All systems are running smoothly.'}
                </p>
              </div>
            </div>
            <div className="lg:col-span-1">
              <RecentActivity activities={data?.recentActivity ?? []} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
