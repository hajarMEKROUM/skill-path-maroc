import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Award, MessageSquare, Settings,
  Users, Briefcase, LogOut, ChevronLeft, ChevronRight,
  Home, User, GraduationCap, FileText, MessagesSquare
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { motion } from 'framer-motion';
import { normalizeRole, ROLES } from '../../utils/roles';

const getNavItems = (role) => {
  const normalized = normalizeRole(role);

  switch (normalized) {
    case ROLES.ADMIN:
      return [
        { name: 'Accueil', icon: Home, path: '/' },
        { name: 'Gestion Utilisateurs', icon: Users, path: '/dashboard/users' },
        { name: 'Gestion Cours', icon: BookOpen, path: '/dashboard/courses-admin' },
        { name: 'Gestion Freelance', icon: Briefcase, path: '/dashboard/marketplace' },
        { name: 'Gestion Communauté', icon: MessagesSquare, path: '/dashboard/community-admin' },
        { name: 'Tableau de Bord', icon: LayoutDashboard, path: '/dashboard/admin', end: true },
        { name: 'Profil', icon: User, path: '/dashboard/profile' },
      ];
    case ROLES.USER:
      return [
        { name: 'Accueil', icon: Home, path: '/' },
        { name: 'Cours', icon: BookOpen, path: '/courses' },
        { name: 'Mes Formations', icon: GraduationCap, path: '/dashboard/courses' },
        { name: 'Certificat', icon: Award, path: '/dashboard/certificates' },
        { name: 'Freelance', icon: Briefcase, path: '/dashboard/freelance' },
        { name: 'Offres d\'Emploi', icon: FileText, path: '/dashboard/employment' },
        { name: 'Communauté', icon: MessagesSquare, path: '/community' },
        { name: 'Messagerie', icon: MessageSquare, path: '/dashboard/messages' },
        { name: 'Tableau de Bord', icon: LayoutDashboard, path: '/dashboard/user', end: true },
        { name: 'Profil', icon: User, path: '/dashboard/profile' },
        { name: 'Paramètres', icon: Settings, path: '/dashboard/settings' },
      ];
    case ROLES.ENTREPRISE:
      return [
        { name: 'Accueil', icon: Home, path: '/' },
        { name: 'Tableau de Bord', icon: LayoutDashboard, path: '/dashboard/enterprise', end: true },
        { name: 'Offres d\'emploi', icon: Briefcase, path: '/dashboard/jobs' },
        { name: 'Messages', icon: MessageSquare, path: '/dashboard/messages' },
        { name: 'Paramètres', icon: Settings, path: '/dashboard/settings' },
      ];
    default:
      return [
        { name: 'Accueil', icon: Home, path: '/' },
        { name: 'Cours', icon: BookOpen, path: '/courses' },
        { name: 'Connexion', icon: User, path: '/login' },
      ];
  }
};

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const navItems = getNavItems(user?.role);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center px-3 py-2.5 rounded-lg text-sm transition-colors ${
      isActive
        ? 'bg-purple-50 text-purple-700 font-medium'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`;

  return (
    <motion.aside
      initial={{ width: 256 }}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white border-r border-gray-200 min-h-screen flex flex-col fixed z-20"
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!isCollapsed && (
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 truncate">
            SkillPath Maroc
          </span>
        )}
        {isCollapsed && (
          <span className="text-xl font-bold text-purple-600 mx-auto">SP</span>
        )}
        <button
          type="button"
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
              end={item.end}
              className={linkClass}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {isAuthenticated && (
        <div className="p-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <LogOut className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
            {!isCollapsed && <span>Déconnexion</span>}
          </button>
        </div>
      )}
    </motion.aside>
  );
};

export default Sidebar;
