import React from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import ActivityChart from '../../components/dashboard/charts/ActivityChart';
import RecentActivity from '../../components/dashboard/RecentActivity';
import { Users, Briefcase, FileSignature, CheckCircle } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const EnterpriseDashboard = () => {
  const { user } = useAuthStore();

  const stats = [
    { title: "Hired Talent", value: "18", icon: Users, colorClass: "bg-blue-100 text-blue-600" },
    { title: "Open Jobs", value: "5", icon: Briefcase, colorClass: "bg-purple-100 text-purple-600" },
    { title: "Active Contracts", value: "12", icon: FileSignature, colorClass: "bg-emerald-100 text-emerald-600" },
    { title: "Completed Projects", value: "34", icon: CheckCircle, colorClass: "bg-orange-100 text-orange-600" }
  ];

  const hiringData = [
    { name: 'Mon', students: 1, courses: 2 },
    { name: 'Tue', students: 2, courses: 1 },
    { name: 'Wed', students: 0, courses: 3 },
    { name: 'Thu', students: 4, courses: 2 },
    { name: 'Fri', students: 1, courses: 4 },
  ];

  const activities = [
    { id: 1, title: "Contract Signed", description: "John Doe for Frontend Dev", time: "1 hour ago", colorClass: "bg-emerald-500" },
    { id: 2, title: "New Proposal", description: "Sarah Smith for UI/UX", time: "3 hours ago", colorClass: "bg-blue-500" },
    { id: 3, title: "Milestone Approved", description: "Mobile App MVP", time: "1 day ago", colorClass: "bg-purple-500" }
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Enterprise Dashboard" 
        subtitle="Manage your talent acquisition and active projects."
        action={
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Post a Job
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityChart data={hiringData} title="Hiring Pipeline" />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
};

export default EnterpriseDashboard;
