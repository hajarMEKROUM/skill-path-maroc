import React from 'react';
import GlassCard from '../ui/GlassCard';
import { AlertCircle, ShieldOff, Save } from 'lucide-react';
import useUsersStore from '../../store/usersStore';

const UserPermissionsPanel = ({ user }) => {
  const { updateUserRole, openModal, isModifying } = useUsersStore();

  const handleRoleChange = (e) => {
    updateUserRole(user.id, e.target.value);
  };

  return (
    <div className="space-y-6">
      
      {/* Role Management */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Access Roles</h3>
            <p className="text-sm text-gray-500">Manage Spatie permissions and platform access level.</p>
          </div>
          {isModifying && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>}
        </div>
        
        <div className="max-w-xs">
          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Role</label>
          <select 
            value={user.role || 'student'}
            onChange={handleRoleChange}
            disabled={isModifying}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg bg-gray-50 border shadow-sm cursor-pointer disabled:opacity-50"
          >
            <option value="admin">Administrator</option>
            <option value="instructor">Instructor</option>
            <option value="freelancer">Freelancer</option>
            <option value="enterprise">Enterprise</option>
            <option value="student">Student</option>
          </select>
        </div>
      </GlassCard>

      {/* Danger Zone */}
      <GlassCard className="p-6 border border-red-100 bg-red-50/20">
        <h3 className="text-lg font-bold text-red-700 mb-4 border-b border-red-100 pb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          Danger Zone
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-red-100 shadow-sm">
            <div>
              <p className="text-sm font-bold text-gray-900">Suspend / Ban User</p>
              <p className="text-sm text-gray-500">Instantly revoke access to the entire platform. The user will be logged out.</p>
            </div>
            <button 
              onClick={() => openModal('ban', user)}
              className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center shadow-sm"
            >
              <ShieldOff className="w-4 h-4 mr-2" />
              {user.status === 'banned' ? 'Edit Ban' : 'Ban User'}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-red-100 shadow-sm">
            <div>
              <p className="text-sm font-bold text-gray-900">Force Password Reset</p>
              <p className="text-sm text-gray-500">Require the user to change their password on next login.</p>
            </div>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors">
              Reset Password
            </button>
          </div>
        </div>
      </GlassCard>

    </div>
  );
};

export default UserPermissionsPanel;
