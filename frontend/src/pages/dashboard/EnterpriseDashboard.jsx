import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FileSignature, CheckCircle, Inbox } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { useDashboard } from '../../hooks/useDashboard';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import DashboardStatsGrid from '../../components/dashboard/DashboardStatsGrid';
import DashboardError from '../../components/dashboard/DashboardError';
import DashboardSkeleton from '../../components/dashboard/DashboardSkeleton';
import RecentActivity from '../../components/dashboard/RecentActivity';
import EmptyState from '../../components/dashboard/EmptyState';

const EnterpriseDashboard = () => {
  const userId = useAuthStore((state) => state.user?.id);
  const { data, isLoading, error, refetch } = useDashboard(userId);

  const stats = useMemo(
    () => [
      {
        key: 'open-jobs',
        title: 'Open Jobs',
        value: data?.stats?.open_jobs ?? 0,
        icon: Briefcase,
        colorClass: 'bg-purple-100 text-purple-600',
      },
      {
        key: 'contracts',
        title: 'Active Contracts',
        value: data?.stats?.active_contracts ?? 0,
        icon: FileSignature,
        colorClass: 'bg-emerald-100 text-emerald-600',
      },
      {
        key: 'completed',
        title: 'Completed Projects',
        value: data?.stats?.completed_projects ?? 0,
        icon: CheckCircle,
        colorClass: 'bg-orange-100 text-orange-600',
      },
      {
        key: 'proposals',
        title: 'Proposals Received',
        value: data?.stats?.proposals_received ?? 0,
        icon: Inbox,
        colorClass: 'bg-blue-100 text-blue-600',
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
        title="Enterprise Dashboard"
        subtitle="Manage your talent acquisition and active projects."
        action={
          <Link
            to="/dashboard/jobs"
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Post a Job
          </Link>
        }
      />

      {error && <DashboardError message={error} onRetry={refetch} />}

      {!error && (
        <>
          <DashboardStatsGrid stats={stats} columns={4} />

          {(data?.stats?.open_jobs ?? 0) === 0 &&
          (data?.stats?.completed_projects ?? 0) === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No jobs posted yet"
              description="You have not posted any jobs. Create your first listing to start hiring talent."
              action={
                <Link to="/dashboard/jobs" className="btn-primary px-4 py-2 text-sm">
                  Post a Job
                </Link>
              }
            />
          ) : (
            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Jobs</h3>
              <ul className="space-y-3">
                {(data?.recentJobs ?? []).map((job) => (
                  <li
                    key={job.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{job.title}</p>
                      <p className="text-xs text-gray-500 capitalize mt-1">
                        {job.status} · {job.proposals_count ?? 0} proposals
                      </p>
                    </div>
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

export default EnterpriseDashboard;
