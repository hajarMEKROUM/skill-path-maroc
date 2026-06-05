import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import DashboardLayout from './layouts/DashboardLayout';
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
import AdminReports from './pages/admin/AdminReports';
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
import MissionsFeed from './pages/freelance/MissionsFeed';
import Forum from './pages/community/Forum';
import TopicDetail from './pages/community/TopicDetail';
import Profile from './pages/Profile';

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
          <Route path="/courses" element={<CourseCatalog />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/jobs" element={<MissionsFeed />} />
          <Route path="/community" element={<Forum />} />
          <Route path="/community/:id" element={<TopicDetail />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/placement-test"
          element={
            <ProtectedRoute>
              <PlacementTest />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardRedirect />} />

          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route path="user" element={<StudentDashboard />} />
            <Route path="courses" element={<StudentCourses />} />
            <Route path="certificates" element={<MyCertifications />} />
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<Settings />} />
            <Route path="learn/:courseId" element={<LearningPlayer />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['entreprise']} />}>
            <Route path="enterprise" element={<EnterpriseDashboard />} />
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="courses-admin" element={<AdminCourses />} />
            <Route path="marketplace" element={<AdminMarketplace />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>

          {/* Legacy redirects */}
          <Route path="student" element={<Navigate to="/dashboard/user" replace />} />
          <Route path="instructor" element={<Navigate to="/dashboard/user" replace />} />
          <Route path="freelancer" element={<Navigate to="/dashboard/user" replace />} />
        </Route>
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
