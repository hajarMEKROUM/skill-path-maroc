import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { dashboardPathForRole, normalizeRole } from '../utils/roles';

const ProtectedRoute = ({ children, allowedRoles = null, role = null }) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();
  const roles = allowedRoles?.map(normalizeRole) ?? (role ? [normalizeRole(role)] : null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const userRole = normalizeRole(user.role);

  if (roles && !roles.includes(userRole)) {
    return <Navigate to={dashboardPathForRole(userRole)} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
