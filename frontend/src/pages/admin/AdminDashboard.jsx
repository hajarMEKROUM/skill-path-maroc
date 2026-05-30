import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, BookOpen, Briefcase, Activity } from 'lucide-react';
import useAdminStore from '../../store/adminStore';
import StatsCard from '../../components/admin/StatsCard';
import RevenueChart from '../../components/admin/RevenueChart';
import GlassCard from '../../components/ui/GlassCard';

const AdminDashboard = () => {
  const { fetchStats, isLoading } = useAdminStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Platform Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor the pulse of SkillPath Maroc ecosystem.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-sm text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            System Operational
          </div>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 font-medium text-sm transition-colors">
            Download Report
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Active Users" 
          value="24,592" 
          icon={Users} 
          trend="up" 
          trendValue="12.5" 
          colorClass="bg-blue-500 text-blue-600" 
        />
        <StatsCard 
          title="Monthly Revenue" 
          value="$142,300" 
          icon={DollarSign} 
          trend="up" 
          trendValue="8.2" 
          colorClass="bg-emerald-500 text-emerald-600" 
        />
        <StatsCard 
          title="Active Courses" 
          value="1,240" 
          icon={BookOpen} 
          trend="up" 
          trendValue="3.1" 
          colorClass="bg-purple-500 text-purple-600" 
        />
        <StatsCard 
          title="Freelance Jobs" 
          value="892" 
          icon={Briefcase} 
          trend="down" 
          trendValue="1.4" 
          colorClass="bg-amber-500 text-amber-600" 
        />
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <RevenueChart />

        {/* Real-time Activity Feed */}
        <GlassCard className="col-span-1 p-0 overflow-hidden flex flex-col h-96">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-primary-600" />
              Live Activity
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Mocked Feed Items */}
            {[
              { id: 1, action: "New course published", target: "Advanced Laravel 12", user: "Youssef A.", time: "2 min ago", color: "bg-blue-100 text-blue-600" },
              { id: 2, action: "New enterprise joined", target: "TechCorp Maroc", user: "Admin", time: "15 min ago", color: "bg-emerald-100 text-emerald-600" },
              { id: 3, action: "High value job posted", target: "$5000 React Project", user: "Sarah M.", time: "1 hour ago", color: "bg-purple-100 text-purple-600" },
              { id: 4, action: "User reported", target: "Spam comment on Course #12", user: "System", time: "2 hours ago", color: "bg-red-100 text-red-600" },
            ].map((activity) => (
              <div key={activity.id} className="flex space-x-4">
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${activity.color}`}>
                  {activity.user.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.target} • <span className="font-semibold">{activity.user}</span></p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

    </div>
  );
};

export default AdminDashboard;
