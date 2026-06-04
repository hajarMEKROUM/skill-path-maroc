import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Topbar = ({ isCollapsed, setIsCollapsed, toggleMobileMenu }) => {
  const { user } = useAuthStore();

  return (
    <header className={`bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0 transition-all duration-300`}>
      <div className="flex items-center flex-1">
        <button 
          onClick={toggleMobileMenu}
          className="mr-4 p-2 rounded-md text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:flex items-center max-w-md w-full relative">
          <Search className="h-4 w-4 absolute left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
        </button>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            Hello, {user?.name?.split(' ')[0] || 'User'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
