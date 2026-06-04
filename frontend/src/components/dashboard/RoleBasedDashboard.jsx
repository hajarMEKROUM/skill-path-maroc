import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import StudentDashboard from '../pages/dashboard/StudentDashboard';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import InstructorDashboard from '../pages/dashboard/InstructorDashboard';
import FreelancerDashboard from '../pages/dashboard/FreelancerDashboard';
import EnterpriseDashboard from '../pages/dashboard/EnterpriseDashboard';

const RoleBasedDashboard = () => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Spatie roles are usually an array of objects
  const roleName = user.roles?.[0]?.name || user.role;

  switch (roleName) {
    case 'admin':
      return <AdminDashboard />;
    case 'instructor':
      return <InstructorDashboard />;
    case 'freelancer':
      return <FreelancerDashboard />;
    case 'enterprise':
      return <EnterpriseDashboard />;
    case 'student':
    default:
      return <StudentDashboard />;
  }
};

export default RoleBasedDashboard;
