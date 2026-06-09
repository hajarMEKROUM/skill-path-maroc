import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Users, BookOpen, Briefcase, DollarSign } from 'lucide-react';
import { adminService } from '../../services/admin.service';

const chartData = [
  { name: 'Jan', users: 120, courses: 12 },
  { name: 'Fév', users: 180, courses: 18 },
  { name: 'Mar', users: 240, courses: 22 },
  { name: 'Avr', users: 310, courses: 28 },
  { name: 'Mai', users: 390, courses: 32 },
  { name: 'Juin', users: 450, courses: 34 },
];

const safeData = chartData ?? [];

const chartSkeletonStyle = {
  height: 300,
  background: 'var(--color-background-secondary, #f3f4f6)',
  borderRadius: 8,
  animation: 'pulse 2s infinite',
};

const emptyChartStyle = {
  height: 300,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#9ca3af',
  fontSize: 14,
};

const AdminReports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await adminService.getStats();
        setStats(data.stats ?? data);
      } catch (err) {
        setError(err.response?.data?.message || 'Impossible de charger les statistiques.');
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const totalUsers = stats?.users ?? 0;
  const totalCourses = stats?.courses ?? stats?.published_courses ?? 0;
  const totalJobs = stats?.jobs ?? 0;
  const totalRevenue = stats?.revenue ?? totalCourses * 150;

  const statCards = [
    { label: 'Utilisateurs', value: totalUsers, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Cours', value: totalCourses, icon: BookOpen, color: 'bg-purple-100 text-purple-600' },
    { label: 'Offres jobs', value: totalJobs, icon: Briefcase, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Revenus estimés', value: `${totalRevenue} MAD`, icon: DollarSign, color: 'bg-orange-100 text-orange-600' },
  ];

  const renderUsersChart = () => {
    if (loading) {
      return <div style={chartSkeletonStyle} className="animate-pulse" />;
    }
    if (safeData.length === 0) {
      return <div style={emptyChartStyle}>Aucune donnée disponible</div>;
    }
    const data = safeData;
    if (!data || data.length === 0) return null;
    return (
      <div style={{ width: '100%', minHeight: 300 }}>
        {isMounted ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={safeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#7c3aed" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={chartSkeletonStyle} />
        )}
      </div>
    );
  };

  const renderCoursesChart = () => {
    if (loading) {
      return <div style={chartSkeletonStyle} className="animate-pulse" />;
    }
    if (safeData.length === 0) {
      return <div style={emptyChartStyle}>Aucune donnée disponible</div>;
    }
    const data = safeData;
    if (!data || data.length === 0) return null;
    return (
      <div style={{ width: '100%', minHeight: 300 }}>
        {isMounted ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={safeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="courses" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={chartSkeletonStyle} />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rapports & Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Vue d&apos;ensemble de la plateforme Skill Path Maroc.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? [...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border animate-pulse h-28" />
            ))
          : statCards.map((card) => (
              <div
                key={card.label}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-soft flex items-center gap-4"
              >
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <card.icon size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-soft">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Croissance utilisateurs</h3>
          {renderUsersChart()}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-soft">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cours publiés</h3>
          {renderCoursesChart()}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
