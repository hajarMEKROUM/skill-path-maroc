import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Clock, BookOpen, Briefcase, Activity, AlertTriangle } from 'lucide-react';
import useUsersStore from '../../store/usersStore';
import UserProfileSection from './UserProfileSection';
import UserPermissionsPanel from './UserPermissionsPanel';
import UserActivityTimeline from './UserActivityTimeline';
import BanUserDialog from './BanUserDialog';
import { usersService } from '../../services/users.service';

const UserDetailsModal = () => {
  const { modals, closeModal, selectedUser } = useUsersStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (modals.details && selectedUser) {
      // Reset tab and fetch deep data
      setActiveTab('overview');
      const fetchDetails = async () => {
        setIsLoading(true);
        try {
          // Assume the API merges LMS, Marketplace, and Activity data
          const data = await usersService.getUserDetails(selectedUser.id);
          setUserDetails(data);
        } catch (error) {
          console.error("Failed to load user details", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetails();
    }
  }, [modals.details, selectedUser]);

  if (!modals.details || !selectedUser) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'courses', label: 'LMS Data', icon: BookOpen },
    { id: 'marketplace', label: 'Marketplace', icon: Briefcase },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'security', label: 'Security & Roles', icon: AlertTriangle },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Glassmorphism Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => closeModal('details')}
          className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
          className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Sticky Header */}
          <div className="flex-shrink-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white font-bold text-xl">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  {selectedUser.name}
                  {selectedUser.status === 'banned' && (
                     <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700">BANNED</span>
                  )}
                </h2>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>
            </div>
            <button 
              onClick={() => closeModal('details')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex-shrink-0 border-b border-gray-100 px-6 overflow-x-auto">
            <nav className="flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
                      ${isActive 
                        ? 'border-primary-500 text-primary-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className={`mr-2 h-5 w-5 ${isActive ? 'text-primary-500' : 'text-gray-400'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'overview' && <UserProfileSection user={userDetails || selectedUser} />}
                {activeTab === 'activity' && <UserActivityTimeline activities={userDetails?.activities} />}
                {activeTab === 'security' && <UserPermissionsPanel user={userDetails || selectedUser} />}
                
                {/* Fallbacks for other tabs */}
                {(activeTab === 'courses' || activeTab === 'marketplace') && (
                  <div className="text-center py-20 text-gray-500">
                    Component implementation for {activeTab} goes here.
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Nested Dialogs */}
        <BanUserDialog />
      </div>
    </AnimatePresence>
  );
};

export default UserDetailsModal;
