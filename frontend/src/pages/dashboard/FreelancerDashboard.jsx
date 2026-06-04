import React from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import RevenueChart from '../../components/dashboard/charts/RevenueChart';
import RecentActivity from '../../components/dashboard/RecentActivity';
import { Briefcase, FileText, FileSignature, DollarSign } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const FreelancerDashboard = () => {
  const { user } = useAuthStore();

  const stats = [
    { title: "Active Jobs", value: "3", icon: Briefcase, colorClass: "bg-blue-100 text-blue-600" },
    { title: "Proposals Sent", value: "12", icon: FileText, colorClass: "bg-purple-100 text-purple-600" },
    { title: "Active Contracts", value: "2", icon: FileSignature, colorClass: "bg-emerald-100 text-emerald-600" },
    { title: "Total Earnings", value: "$4,250", icon: DollarSign, trend: "up", trendValue: "15%", colorClass: "bg-orange-100 text-orange-600" }
  ];

  const earningsData = [
    { name: 'Jan', revenue: 1000 },
    { name: 'Feb', revenue: 800 },
    { name: 'Mar', revenue: 1500 },
    { name: 'Apr', revenue: 2000 },
    { name: 'May', revenue: 1800 },
    { name: 'Jun', revenue: 2500 },
  ];

  const activities = [
    { id: 1, title: "Proposal Accepted", description: "UI Design for E-commerce", time: "2 hours ago", colorClass: "bg-emerald-500" },
    { id: 2, title: "Payment Received", description: "$800 for Landing Page", time: "1 day ago", colorClass: "bg-blue-500" },
    { id: 3, title: "New Job Match", description: "Looking for React Developer", time: "2 days ago", colorClass: "bg-purple-500" }
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Freelancer Workspace" 
        subtitle="Track your proposals, active contracts, and earnings."
        action={
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Find Work
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
          <RevenueChart data={earningsData} title="Earnings Overview" />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
