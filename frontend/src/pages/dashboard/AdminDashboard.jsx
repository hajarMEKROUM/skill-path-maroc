import React from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import RevenueChart from '../../components/dashboard/charts/RevenueChart';
import ActivityChart from '../../components/dashboard/charts/ActivityChart';
import RecentActivity from '../../components/dashboard/RecentActivity';
import { Users, BookOpen, Briefcase, DollarSign } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const AdminDashboard = () => {
  const { user } = useAuthStore();

  const stats = [
    { title: "Total Users", value: "12,450", icon: Users, trend: "up", trendValue: "18%", colorClass: "bg-blue-100 text-blue-600" },
    { title: "Total Courses", value: "342", icon: BookOpen, trend: "up", trendValue: "5%", colorClass: "bg-purple-100 text-purple-600" },
    { title: "Active Freelancers", value: "1,205", icon: Briefcase, colorClass: "bg-emerald-100 text-emerald-600" },
    { title: "Platform Revenue", value: "$124,500", icon: DollarSign, trend: "up", trendValue: "22%", colorClass: "bg-orange-100 text-orange-600" }
  ];

  const revenueData = [
    { name: 'Jan', revenue: 8000 },
    { name: 'Feb', revenue: 9500 },
    { name: 'Mar', revenue: 11000 },
    { name: 'Apr', revenue: 10500 },
    { name: 'May', revenue: 14000 },
    { name: 'Jun', revenue: 16500 },
  ];

  const activityData = [
    { name: 'Mon', students: 120, courses: 45 },
    { name: 'Tue', students: 150, courses: 55 },
    { name: 'Wed', students: 180, courses: 60 },
    { name: 'Thu', students: 140, courses: 50 },
    { name: 'Fri', students: 200, courses: 70 },
  ];

  const activities = [
    { id: 1, title: "New Instructor Application", description: "Mark Johnson applied to teach", time: "10 mins ago", colorClass: "bg-purple-500" },
    { id: 2, title: "Course Reported", description: "UI Design Basics reported for quality", time: "1 hour ago", colorClass: "bg-red-500" },
    { id: 3, title: "Payout Processed", description: "$4,500 paid to 12 instructors", time: "3 hours ago", colorClass: "bg-emerald-500" }
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Admin Control Panel" 
        subtitle="Platform overview, metrics, and recent administrative activities."
        action={
          <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors">
            Generate Report
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={revenueData} title="Platform Revenue" />
        <ActivityChart data={activityData} title="User Growth" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-soft border border-gray-100 p-6 flex items-center justify-center">
           <div className="text-center">
             <h3 className="text-lg font-medium text-gray-900 mb-2">System Health</h3>
             <p className="text-gray-500 text-sm">All systems are running smoothly.</p>
           </div>
        </div>
        <div className="lg:col-span-1">
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
