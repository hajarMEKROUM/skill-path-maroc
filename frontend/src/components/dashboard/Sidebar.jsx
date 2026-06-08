import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Award, MessageSquare, Settings,
  Users, Briefcase, BarChart, LogOut, ChevronLeft, ChevronRight, Home, User
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { motion } from 'framer-motion';
import { normalizeRole, ROLES } from '../../utils/roles';

const getNavItems = (role) => {
  const normalized = normalizeRole(role);

  switch (normalized) {
    case ROLES.USER:
      return [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/user' },
        { name: 'My Courses', icon: BookOpen, path: '/dashboard/courses' },
        { name: 'Certificates', icon: Award, path: '/dashboard/certificates' },
        { name: 'Messages', icon: MessageSquare, path: '/dashboard/messages' },
        { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
      ];
    case ROLES.ENTREPRISE:
      return [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/enterprise' },
        { name: 'Jobs', icon: Briefcase, path: '/jobs' },
        { name: 'Messages', icon: MessageSquare, path: '/dashboard/messages' },
        { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
      ];
    case ROLES.ADMIN:
      return [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/admin', end: false },
        { name: 'Utilisateurs', icon: Users, path: '/dashboard/users' },
        { name: 'Cours', icon: BookOpen, path: '/dashboard/courses-admin' },
        { name: 'Marketplace', icon: Briefcase, path: '/dashboard/marketplace' },
        { name: 'Rapports', icon: BarChart, path: '/dashboard/reports' },
      ];
    default:
      return [];
  }
};

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const navItems = getNavItems(user?.role);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      initial={{ width: 256 }}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white border-r border-gray-200 min-h-screen flex flex-col fixed z-20"
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!isCollapsed && (
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 truncate">
            SkillPath Maroc
          </span>
        )}
        {isCollapsed && (
          <span className="text-xl font-bold text-primary-600 mx-auto">SP</span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-500 absolute -right-3 top-5 bg-white border border-gray-200 shadow-sm"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end !== false && (item.path === '/dashboard/user' || item.path === '/dashboard/admin')}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg transition-colors group relative ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-lg transition-colors group relative anti-gravity-btn-1 ${
                isActive
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Home className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
            {!isCollapsed && <span>Accueil</span>}
          </NavLink>
          <NavLink
            to="/dashboard/jobs"
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-lg transition-colors group relative anti-gravity-btn-2 ${
                isActive
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Briefcase className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
            {!isCollapsed && <span>Freelance</span>}
          </NavLink>
          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-lg transition-colors group relative anti-gravity-btn-3 ${
                isActive
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <User className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
            {!isCollapsed && <span>Profil</span>}
          </NavLink>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2.5 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
        >
          <LogOut className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
