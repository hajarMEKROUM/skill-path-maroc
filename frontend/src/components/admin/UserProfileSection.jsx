import React from 'react';
import GlassCard from '../ui/GlassCard';
import { Mail, Clock, Calendar, CheckCircle, MapPin, Hash } from 'lucide-react';

const UserProfileSection = ({ user }) => {
  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Identity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Identity & Contact</h3>
          <div className="space-y-4">
            <div className="flex items-center text-sm">
              <Hash className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-gray-500 font-medium">User ID</p>
                <p className="text-gray-900 font-mono">{user.id || 'UUID-XYZ'}</p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <Mail className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-gray-500 font-medium">Email Address</p>
                <p className="text-gray-900">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-gray-500 font-medium">Location</p>
                <p className="text-gray-900">{user.location || 'Morocco'}</p>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Account Health</h3>
          <div className="space-y-4">
            <div className="flex items-center text-sm">
              <CheckCircle className={`w-5 h-5 mr-3 ${user.is_verified ? 'text-emerald-500' : 'text-gray-400'}`} />
              <div>
                <p className="text-gray-500 font-medium">Verification Status</p>
                <p className={`font-medium ${user.is_verified ? 'text-emerald-600' : 'text-gray-600'}`}>
                  {user.is_verified ? 'Verified Identity' : 'Unverified'}
                </p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-gray-500 font-medium">Joined Platform</p>
                <p className="text-gray-900">{new Date(user.created_at || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-gray-500 font-medium">Last Login</p>
                <p className="text-gray-900">{user.last_login_at || 'Just now'}</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Bio / About */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Biography</h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          {user.bio || 'This user has not provided a biography yet.'}
        </p>
      </GlassCard>
    </div>
  );
};

export default UserProfileSection;
