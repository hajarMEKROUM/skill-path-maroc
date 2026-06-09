import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import HomeLayout from './components/layout/HomeLayout';
import SidebarLayout from './layouts/SidebarLayout';
import HomePage from './pages/HomePage';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import StudentCourses from './pages/dashboard/StudentCourses';
import MyCertifications from './pages/dashboard/MyCertifications';
import Messages from './pages/dashboard/Messages';
import Settings from './pages/dashboard/Settings';
import EnterpriseDashboard from './pages/dashboard/EnterpriseDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCourses from './pages/admin/AdminCourses';
import AdminMarketplace from './pages/admin/AdminMarketplace';
import AdminCommunity from './pages/admin/AdminCommunity';
import useAuthStore from './store/authStore';
import { dashboardPathForRole } from './utils/roles';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ProtectedRoute from './routes/ProtectedRoute';
import CourseCatalog from './pages/learning/CourseCatalog';
import CourseDetail from './pages/learning/CourseDetail';
import LearningPlayer from './pages/learning/LearningPlayer';
import PlacementTest from './pages/learning/PlacementTest';
import Forum from './pages/community/Forum';
import TopicDetail from './pages/community/TopicDetail';
import DashboardProfile from './pages/dashboard/Profile';
import FreelancePage from './pages/dashboard/FreelancePage';
import EmploymentJobs from './pages/dashboard/EmploymentJobs';
import Jobs from './pages/dashboard/Jobs';
import Marketplace from './pages/Marketplace';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Routes>
        {/* Accueil uniquement — navbar horizontale */}
        <Route element={<HomeLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        {/* Toutes les autres pages — sidebar verticale */}
        <Route element={<SidebarLayout />}>
          <Route path="/courses" element={<CourseCatalog />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/community" element={<Forum />} />
          <Route path="/community/:id" element={<TopicDetail />} />
          <Route path="/jobs" element={<Navigate to="/marketplace" replace />} />

          <Route
            path="/placement-test"
            element={
              <ProtectedRoute>
                <PlacementTest />
              </ProtectedRoute>
            }
          />

          <Route path="/profile" element={<Navigate to="/dashboard/profile" replace />} />
          <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
          <Route path="/certificates" element={<Navigate to="/dashboard/certificates" replace />} />

          <Route path="/dashboard" element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
            <Route index element={<DashboardRedirect />} />

            <Route element={<ProtectedRoute allowedRoles={['user']} />}>
              <Route path="user" element={<StudentDashboard />} />
              <Route path="courses" element={<StudentCourses />} />
              <Route path="certificates" element={<MyCertifications />} />
              <Route path="messages" element={<Messages />} />
              <Route path="settings" element={<Settings />} />
              <Route path="learning/:courseId" element={<LearningPlayer />} />
              <Route path="learn/:courseId" element={<LearningPlayer />} />
              <Route path="freelance" element={<FreelancePage />} />
              <Route path="employment" element={<EmploymentJobs />} />
              <Route path="profile" element={<DashboardProfile />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['entreprise']} />}>
              <Route path="enterprise" element={<EnterpriseDashboard />} />
              <Route path="messages" element={<Messages />} />
              <Route path="settings" element={<Settings />} />
              <Route path="jobs" element={<Jobs />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="courses-admin" element={<AdminCourses />} />
            <Route path="marketplace" element={<AdminMarketplace />} />
            <Route path="community-admin" element={<AdminCommunity />} />
            <Route path="profile" element={<DashboardProfile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

            <Route path="student" element={<Navigate to="/dashboard/user" replace />} />
            <Route path="instructor" element={<Navigate to="/dashboard/user" replace />} />
            <Route path="freelancer" element={<Navigate to="/dashboard/user" replace />} />
          </Route>
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

const DashboardRedirect = () => {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;

  return <Navigate to={dashboardPathForRole(user.role)} replace />;
};

export default App;
