import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ children, allowedRoles = null, role = null }) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();
  const roles = allowedRoles ?? (role ? [role] : null);

  // loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  // not logged in
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // role check
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard/student" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;