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
        {/* Public Routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/courses" element={<CoursesPage />} /> */}
          {/* <Route path="/marketplace" element={<MarketplacePage />} /> */}
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Private Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                {/* Dynamically render dashboard based on role or create a switcher component */}
                <RoleBasedDashboardSwitcher />
              </ProtectedRoute>
            } 
          />
          {/* Add more nested routes for specific dashboard pages as needed */}
        </Route>
      </Routes>
    </Router>
  );
}

const RoleBasedDashboardSwitcher = () => {
  const { user } = useAuthStore();
  
  switch(user?.role) {
    case 'instructor': return <InstructorDashboard />;
    case 'freelancer': return <FreelancerDashboard />;
    case 'enterprise': return <EnterpriseDashboard />;
    case 'admin': return <AdminDashboard />;
    default: return <StudentDashboard />;
  }
};

export default App;
