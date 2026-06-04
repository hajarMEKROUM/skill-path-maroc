import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import DashboardLayout from './layouts/DashboardLayout';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import InstructorDashboard from './pages/dashboard/InstructorDashboard';
import FreelancerDashboard from './pages/dashboard/FreelancerDashboard';
import EnterpriseDashboard from './pages/dashboard/EnterpriseDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import useAuthStore from './store/authStore';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Private Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          
          <Route index element={<DashboardRedirect />} />
          
          <Route element={<ProtectedRoute allowedRoles={['instructor']} />}>
            <Route path="instructor" element={<InstructorDashboard />} />
          </Route>
          
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="student" element={<StudentDashboard />} />
          </Route>
          
          <Route element={<ProtectedRoute allowedRoles={['freelancer']} />}>
            <Route path="freelancer" element={<FreelancerDashboard />} />
          </Route>
          
          <Route element={<ProtectedRoute allowedRoles={['company', 'enterprise']} />}>
            <Route path="enterprise" element={<EnterpriseDashboard />} />
          </Route>
          
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

const DashboardRedirect = () => {
  const { user } = useAuthStore();
  
  if (!user) return <Navigate to="/login" replace />;

  const roleMap = {
    instructor: '/dashboard/instructor',
    freelancer: '/dashboard/freelancer',
    company: '/dashboard/enterprise',
    enterprise: '/dashboard/enterprise',
    admin: '/dashboard/admin',
    student: '/dashboard/student'
  };

  return <Navigate to={roleMap[user.role] || '/dashboard/student'} replace />;
};

export default App;
