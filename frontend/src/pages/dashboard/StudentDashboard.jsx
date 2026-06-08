import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Award, TrendingUp, ClipboardList } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { useDashboard, useStudentInsights } from '../../hooks/useDashboard';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import DashboardStatsGrid from '../../components/dashboard/DashboardStatsGrid';
import DashboardError from '../../components/dashboard/DashboardError';
import DashboardSkeleton from '../../components/dashboard/DashboardSkeleton';
import CourseProgress from '../../components/dashboard/CourseProgress';
import ProgressCard from '../../components/dashboard/ProgressCard';
import StudentLearningInsights from '../../components/dashboard/StudentLearningInsights';
import EmptyState from '../../components/dashboard/EmptyState';
import MyCertifications from './MyCertifications';

const StudentDashboard = () => {
  const userId = useAuthStore((state) => state.user?.id);
  const userName = useAuthStore((state) => state.user?.name);

  const { data, isLoading, error, refetch } = useDashboard(userId);
  const {
    recommendations,
    placementProfile,
    isLoading: insightsLoading,
  } = useStudentInsights(userId);

  const stats = useMemo(() => {
    const enrolled = data?.totalCoursesEnrolled ?? 0;
    const certificates = data?.totalCertificates ?? 0;
    const active = data?.activeCourses ?? 0;
    const level = placementProfile?.niveau || placementProfile?.level;

    return [
      {
        key: 'enrolled',
        title: 'Enrolled Courses',
        value: enrolled,
        icon: BookOpen,
        colorClass: 'bg-primary-100 text-primary-600',
        subtitle: enrolled === 0 ? 'You are not enrolled in any courses yet' : `${active} active`,
      },
      {
        key: 'certificates',
        title: 'Certificates',
        value: certificates,
        icon: Award,
        colorClass: 'bg-emerald-100 text-emerald-600',
        subtitle: certificates === 0 ? 'Start learning to earn your first certificate' : 'Earned certifications',
      },
      {
        key: 'progress',
        title: 'Learning Progress',
        value: `${data?.overallProgress ?? 0}%`,
        icon: TrendingUp,
        colorClass: 'bg-purple-100 text-purple-600',
        subtitle: level ? `Level: ${level}` : 'Complete courses to track progress',
      },
    ];
  }, [data, placementProfile]);

  const activeCourses = useMemo(() => {
    if (!data?.learningProgress?.length) return [];
    return data.learningProgress.filter((course) => !course.completed);
  }, [data]);

  if (isLoading) {
    return <DashboardSkeleton statCount={3} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <DashboardHeader
        title={`Welcome back, ${userName || 'Student'}!`}
        subtitle="Here is your learning progress for today."
        action={
          <Link
            to="/placement-test"
            className="btn-primary flex items-center justify-center gap-2 py-2 px-4 text-sm"
          >
            <ClipboardList size={18} />
            Placement Test
          </Link>
        }
      />

      {error && <DashboardError message={error} onRetry={refetch} />}

      {!error && (
        <>
          <DashboardStatsGrid stats={stats} columns={3} />

          {(data?.totalCoursesEnrolled ?? 0) === 0 && (
            <EmptyState
              icon={BookOpen}
              title="Start your learning journey"
              description="You are not enrolled in any courses yet. Explore our catalog and pick a course that matches your goals."
              action={
                <Link to="/courses" className="btn-primary px-5 py-2.5 text-sm">
                  Browse Courses
                </Link>
              }
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CourseProgress courses={activeCourses} />
            </div>
            <div>
              <ProgressCard
                title="Overall Progress"
                description="Across all enrolled courses"
                progress={data?.overallProgress ?? 0}
                icon={TrendingUp}
              />
            </div>
          </div>

          <StudentLearningInsights
            placementProfile={placementProfile}
            recommendations={recommendations}
            isLoading={insightsLoading}
          />

          <MyCertifications compact />
        </>
      )}
    </div>
  );
};

export default StudentDashboard;
