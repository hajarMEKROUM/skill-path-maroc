import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import useUsersStore from '../../store/usersStore';

const BanUserDialog = () => {
  const { modals, closeModal, selectedUser, banUser, isModifying } = useUsersStore();
  const [reason, setReason] = useState('');

  if (!modals.ban || !selectedUser) return null;

  const handleBan = async () => {
    if (!reason.trim()) return;
    await banUser(selectedUser.id, reason);
    setReason('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/* Darker overlay specifically for the nested dialog */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => closeModal('ban')}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <AlertTriangle className="text-red-600 w-6 h-6" />
            </div>
            
            <h3 className="text-lg font-bold text-center text-gray-900 mb-2">
              Ban {selectedUser.name}?
            </h3>
            <p className="text-sm text-center text-gray-500 mb-6">
              This action will immediately terminate all active sessions for this user. They will not be able to log in.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Ban (Audit Log)</label>
                <textarea
                  rows={3}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm p-3 border"
                  placeholder="Violation of TOS..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={isModifying}
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => closeModal('ban')}
                  disabled={isModifying}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBan}
                  disabled={isModifying || !reason.trim()}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                >
                  {isModifying ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : null}
                  Confirm Ban
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BanUserDialog;
