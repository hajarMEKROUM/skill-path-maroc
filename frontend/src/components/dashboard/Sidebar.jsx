import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Award, MessageSquare, Settings, 
  Users, DollarSign, Briefcase, FileText, FileSignature, 
  BarChart, LogOut, ChevronLeft, ChevronRight 
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { motion } from 'framer-motion';

const getNavItems = (role) => {
  switch (role) {
    case 'student':
      return [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'My Courses', icon: BookOpen, path: '/dashboard/courses' },
        { name: 'Certificates', icon: Award, path: '/dashboard/certificates' },
        { name: 'Messages', icon: MessageSquare, path: '/dashboard/messages' },
        { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
      ];
    case 'instructor':
      return [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'My Courses', icon: BookOpen, path: '/dashboard/courses' },
        { name: 'Students', icon: Users, path: '/dashboard/students' },
        { name: 'Revenue', icon: DollarSign, path: '/dashboard/revenue' },
        { name: 'Messages', icon: MessageSquare, path: '/dashboard/messages' },
      ];
    case 'freelancer':
      return [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Jobs', icon: Briefcase, path: '/dashboard/jobs' },
        { name: 'Proposals', icon: FileText, path: '/dashboard/proposals' },
        { name: 'Contracts', icon: FileSignature, path: '/dashboard/contracts' },
        { name: 'Messages', icon: MessageSquare, path: '/dashboard/messages' },
      ];
    case 'enterprise':
      return [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Talent Pool', icon: Users, path: '/dashboard/talent' },
        { name: 'Contracts', icon: FileSignature, path: '/dashboard/contracts' },
        { name: 'Messages', icon: MessageSquare, path: '/dashboard/messages' },
        { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
      ];
    case 'admin':
      return [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Users', icon: Users, path: '/dashboard/users' },
        { name: 'Courses', icon: BookOpen, path: '/dashboard/courses-admin' },
        { name: 'Marketplace', icon: Briefcase, path: '/dashboard/marketplace' },
        { name: 'Reports', icon: BarChart, path: '/dashboard/reports' },
        { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
      ];
    default:
      return [];
  }
};

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const navItems = getNavItems(user?.role || 'student');

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
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg transition-colors group relative ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className={`h-5 w-5 shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''} mb-4`}>
          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          {!isCollapsed && (
            <div className="ml-3 truncate">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 capitalize truncate">{user?.role || 'Student'}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={`flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
