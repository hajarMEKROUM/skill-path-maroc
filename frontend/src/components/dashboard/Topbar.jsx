import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Menu, Settings } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Topbar = ({ toggleMobileMenu }) => {
  const { user } = useAuthStore();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0">
      <div className="flex items-center flex-1">
        <button
          type="button"
          onClick={toggleMobileMenu}
          className="mr-4 p-2 rounded-md text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        {user?.role === 'admin' && (
          <Link
            to="/dashboard/settings"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
          >
            <Settings className="h-4 w-4" />
            Paramètres
          </Link>
        )}
        <button
          type="button"
          className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>

        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          Bonjour, {user?.name?.split(' ')[0] || 'Utilisateur'}
        </span>
      </div>
    </header>
  );
};

export default Topbar;
