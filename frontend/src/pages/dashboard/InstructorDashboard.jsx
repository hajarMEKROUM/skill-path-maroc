import React from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import RevenueChart from '../../components/dashboard/charts/RevenueChart';
import RecentActivity from '../../components/dashboard/RecentActivity';
import { Users, DollarSign, BookOpen, Star } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const InstructorDashboard = () => {
  const { user } = useAuthStore();

  const stats = [
    { title: "Total Students", value: "2,451", icon: Users, trend: "up", trendValue: "12%", colorClass: "bg-blue-100 text-blue-600" },
    { title: "Total Revenue", value: "$12,450", icon: DollarSign, trend: "up", trendValue: "8%", colorClass: "bg-emerald-100 text-emerald-600" },
    { title: "Active Courses", value: "8", icon: BookOpen, colorClass: "bg-purple-100 text-purple-600" },
    { title: "Avg. Rating", value: "4.8", icon: Star, colorClass: "bg-orange-100 text-orange-600" }
  ];

  const revenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 4500 },
    { name: 'May', revenue: 6000 },
    { name: 'Jun', revenue: 5500 },
  ];

  const activities = [
    { id: 1, title: "New Enrollment", description: "Sarah joined Fullstack MERN", time: "10 mins ago", colorClass: "bg-blue-500" },
    { id: 2, title: "5 Star Review", description: "Great course, highly recommend!", time: "2 hours ago", colorClass: "bg-orange-500" },
    { id: 3, title: "Course Updated", description: "Published new lesson on React Hooks", time: "1 day ago", colorClass: "bg-emerald-500" }
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Instructor Dashboard" 
        subtitle="Manage your courses, students, and track your revenue."
        action={
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Create Course
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
          <RevenueChart data={revenueData} />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
