import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, FileSignature, Search } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { useDashboard } from '../../hooks/useDashboard';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import DashboardStatsGrid from '../../components/dashboard/DashboardStatsGrid';
import DashboardError from '../../components/dashboard/DashboardError';
import DashboardSkeleton from '../../components/dashboard/DashboardSkeleton';
import RecentActivity from '../../components/dashboard/RecentActivity';
import EmptyState from '../../components/dashboard/EmptyState';

const FreelancerDashboard = () => {
  const userId = useAuthStore((state) => state.user?.id);
  const { data, isLoading, error, refetch } = useDashboard(userId);

  const stats = useMemo(
    () => [
      {
        key: 'open-jobs',
        title: 'Open Jobs',
        value: data?.stats?.open_jobs ?? 0,
        icon: Briefcase,
        colorClass: 'bg-blue-100 text-blue-600',
      },
      {
        key: 'proposals',
        title: 'Proposals Sent',
        value: data?.stats?.proposals_sent ?? 0,
        icon: FileText,
        colorClass: 'bg-purple-100 text-purple-600',
      },
      {
        key: 'active-proposals',
        title: 'Active Proposals',
        value: data?.stats?.active_proposals ?? 0,
        icon: FileSignature,
        colorClass: 'bg-emerald-100 text-emerald-600',
      },
      {
        key: 'contracts',
        title: 'Active Contracts',
        value: data?.stats?.active_contracts ?? 0,
        icon: FileSignature,
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
        title="Freelancer Workspace"
        subtitle="Track your proposals, active contracts, and available opportunities."
        action={
          <Link
            to="/dashboard/jobs"
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Find Work
          </Link>
        }
      />

      {error && <DashboardError message={error} onRetry={refetch} />}

      {!error && (
        <>
          <DashboardStatsGrid stats={stats} columns={4} />

          {(data?.stats?.proposals_sent ?? 0) === 0 ? (
            <EmptyState
              icon={Search}
              title="No proposals yet"
              description="You have not submitted any proposals. Browse open jobs and apply to start freelancing."
              action={
                <Link to="/jobs" className="btn-primary px-4 py-2 text-sm">
                  Browse Jobs
                </Link>
              }
            />
          ) : (
            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Proposals</h3>
              <ul className="space-y-3">
                {(data?.recentProposals ?? []).map((proposal) => (
                  <li
                    key={proposal.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {proposal.job_title || `Proposal #${proposal.id}`}
                      </p>
                      <p className="text-xs text-gray-500 capitalize mt-1">
                        {proposal.status}
                        {proposal.bid_amount != null && ` · ${proposal.bid_amount} MAD`}
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

export default FreelancerDashboard;
