import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Award, Pencil } from 'lucide-react';
import useAuthStore from '../store/authStore';
import GlassCard from '../components/ui/GlassCard';
import { useProfile } from '../hooks/useProfile';
import { useDashboard } from '../hooks/useDashboard';

const apiOrigin = (
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
).replace(/\/api\/v1\/?$/, '');

const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith('http')) return avatar;
  const path = avatar.startsWith('/') ? avatar : `/${avatar}`;
  return `${apiOrigin}${path}`;
};

const Avatar = ({ src, name, size = 96 }) => {
  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizeClass =
    size >= 96 ? 'w-24 h-24 text-3xl' : `w-[${size}px] h-[${size}px]`;

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${size >= 96 ? 'w-24 h-24' : ''} rounded-full object-cover border-4 border-white shadow-md`}
        style={size < 96 ? { width: size, height: size } : undefined}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center text-white font-semibold shadow-md border-4 border-white bg-gradient-to-br from-violet-600 to-indigo-600`}
      style={size < 96 ? { width: size, height: size, fontSize: size * 0.35 } : undefined}
    >
      {initials || '?'}
    </div>
  );
};

const RoleBadge = ({ role }) => {
  const styles = {
    student: { bg: '#ede9fe', color: '#6d28d9', label: 'Étudiant' },
    instructor: { bg: '#ccfbf1', color: '#0f766e', label: 'Instructeur' },
    admin: { bg: '#fee2e2', color: '#b91c1c', label: 'Administrateur' },
    freelancer: { bg: '#dbeafe', color: '#1d4ed8', label: 'Freelance' },
    company: { bg: '#fef3c7', color: '#b45309', label: 'Entreprise' },
    enterprise: { bg: '#fef3c7', color: '#b45309', label: 'Entreprise' },
  };
  const key = role?.toLowerCase() || 'student';
  const s = styles[key] ?? styles.student;

  return (
    <span
      className="inline-block px-3 py-1 rounded-full text-sm font-medium"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
};

const ProfileSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="bg-white rounded-2xl p-8 flex flex-col items-center border border-gray-100 shadow-soft">
      <div className="w-24 h-24 rounded-full bg-gray-200 mb-4" />
      <div className="h-7 bg-gray-200 rounded w-48 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-56 mb-3" />
      <div className="h-6 bg-gray-200 rounded-full w-24" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-6 h-28 border border-gray-100 shadow-soft" />
      ))}
    </div>
    <div className="bg-white rounded-2xl p-6 h-32 border border-gray-100 shadow-soft" />
  </div>
);

const Profile = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const { data: profileData, loading: profileLoading } = useProfile();
  const { data: dashboardData, loading: dashboardLoading } = useDashboard();

  if (!isAuthenticated && !profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <GlassCard className="text-center max-w-md border-gray-100 shadow-soft">
          <p className="text-gray-600 mb-4">Connectez-vous pour voir votre profil.</p>
          <Link to="/login" className="btn-primary py-2 px-4 text-sm inline-block rounded-lg">
            Se connecter
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-[800px] mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mon profil</h1>

        {profileLoading ? (
          <ProfileSkeleton />
        ) : (
          <>
            <GlassCard className="!bg-white text-center flex flex-col items-center shadow-soft border border-gray-100">
              <Avatar src={getAvatarUrl(profileData?.avatar)} name={profileData?.name} size={96} />
              <h2 className="text-2xl font-bold text-gray-900 mt-5">{profileData?.name}</h2>
              <p className="text-gray-500 mt-1">{profileData?.email}</p>
              {profileData?.created_at && (
                <p className="text-xs text-gray-400 mt-1">Inscrit depuis le {new Date(profileData.created_at).toLocaleDateString('fr-FR')}</p>
              )}
              <div className="mt-3">
                <RoleBadge role={profileData?.role} />
              </div>
              <button
                type="button"
                onClick={() => navigate('/dashboard/settings')}
                className="btn-primary mt-6 inline-flex items-center gap-2 py-2.5 px-5 text-sm rounded-lg"
              >
                <Pencil size={16} />
                Modifier mon profil
              </button>
            </GlassCard>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <GlassCard hover className="!bg-white flex items-center gap-4 shadow-soft border border-gray-100">
                <div className="p-3 bg-primary-100 text-primary-600 rounded-lg">
                  <BookOpen size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Formations inscrites</p>
                  {dashboardLoading ? (
                    <div className="h-8 bg-gray-200 rounded w-16 animate-pulse mt-1" />
                  ) : (
                    <h3 className="text-2xl font-bold text-gray-900">{dashboardData?.total_courses_enrolled ?? 0}</h3>
                  )}
                </div>
              </GlassCard>

              <GlassCard hover className="!bg-white flex items-center gap-4 shadow-soft border border-gray-100">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                  <Award size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Certifications obtenues</p>
                  {dashboardLoading ? (
                    <div className="h-8 bg-gray-200 rounded w-16 animate-pulse mt-1" />
                  ) : (
                    <h3 className="text-2xl font-bold text-gray-900">{dashboardData?.total_certificates ?? 0}</h3>
                  )}
                </div>
              </GlassCard>
            </div>

            <GlassCard className="!bg-white shadow-soft border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">À propos</h3>
              {profileData?.bio?.trim() ? (
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{profileData.bio}</p>
              ) : (
                <p className="text-gray-500 text-sm">
                  Aucune bio renseignée. Ajoutez-en une dans les{' '}
                  <Link
                    to="/dashboard/settings"
                    className="text-primary-600 hover:underline font-medium"
                  >
                    paramètres
                  </Link>
                  .
                </p>
              )}
            </GlassCard>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
