import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Award, TrendingUp, Pencil } from 'lucide-react';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import GlassCard from '../components/ui/GlassCard';

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
    admin: { bg: '#fee2e2', color: '#b91c1c', label: 'Admin' },
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

const formatLevel = (level) => {
  if (!level || level === '—') return '—';
  const labels = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    expert: 'Expert',
  };
  return labels[level.toLowerCase()] || level;
};

const ProfileSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="bg-white rounded-2xl p-8 flex flex-col items-center">
      <div className="w-24 h-24 rounded-full bg-gray-200 mb-4" />
      <div className="h-7 bg-gray-200 rounded w-48 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-56 mb-3" />
      <div className="h-6 bg-gray-200 rounded-full w-24" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-6 h-28" />
      ))}
    </div>
    <div className="bg-white rounded-2xl p-6 h-32" />
  </div>
);

const Profile = () => {
  const navigate = useNavigate();
  const storeUser = useAuthStore((state) => state.user);
  const userId = useAuthStore((state) => state.user?.id);
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState({ courses: 0, certs: 0, level: '—' });
  const [loading, setLoading] = useState(true);
  const fetchedForUserRef = useRef(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    if (fetchedForUserRef.current === userId) {
      return;
    }
    fetchedForUserRef.current = userId;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [meRes, coursesRes, certsRes, placementRes] = await Promise.allSettled([
          api.get('/me'),
          api.get('/my-courses'),
          api.get('/certifications'),
          api.get('/placement-test/result'),
        ]);

        const meUser =
          meRes.status === 'fulfilled'
            ? meRes.value.data?.data ?? meRes.value.data
            : null;

        if (meUser) {
          setProfileData(meUser);
        } else {
          const fallback = useAuthStore.getState().user;
          if (fallback) {
            setProfileData(fallback);
          }
        }

        const coursesList =
          coursesRes.status === 'fulfilled'
            ? coursesRes.value.data?.data ?? coursesRes.value.data ?? []
            : [];
        const certsList =
          certsRes.status === 'fulfilled'
            ? certsRes.value.data?.data ?? certsRes.value.data ?? []
            : [];

        let level = '—';
        if (placementRes.status === 'fulfilled') {
          const placement = placementRes.value.data?.data;
          if (placement?.level || placement?.niveau) {
            level = placement.level || placement.niveau;
          }
        }

        setStats({
          courses: Array.isArray(coursesList) ? coursesList.length : 0,
          certs: Array.isArray(certsList) ? certsList.length : 0,
          level,
        });
      } catch {
        const fallback = useAuthStore.getState().user;
        if (fallback) {
          setProfileData(fallback);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [userId]);

  const user = profileData ?? storeUser;

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <GlassCard className="text-center max-w-md">
          <p className="text-gray-600 mb-4">Connectez-vous pour voir votre profil.</p>
          <Link to="/login" className="btn-primary py-2 px-4 text-sm inline-block">
            Se connecter
          </Link>
        </GlassCard>
      </div>
    );
  }

  const avatarSrc = getAvatarUrl(user?.avatar);
  const bio = user?.bio?.trim();

  return (
    <div className="min-h-screen bg-gray-950 py-10 px-4 sm:px-6">
      <div className="max-w-[800px] mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white mb-2">Mon profil</h1>

        {loading ? (
          <ProfileSkeleton />
        ) : (
          <>
            <GlassCard className="!bg-white text-center flex flex-col items-center shadow-soft border-gray-100">
              <Avatar src={avatarSrc} name={user?.name} size={96} />
              <h2 className="text-2xl font-bold text-gray-900 mt-5">{user?.name}</h2>
              <p className="text-gray-500 mt-1">{user?.email}</p>
              <div className="mt-3">
                <RoleBadge role={user?.role} />
              </div>
              <button
                type="button"
                onClick={() => navigate('/dashboard/settings')}
                className="btn-primary mt-6 inline-flex items-center gap-2 py-2.5 px-5 text-sm"
              >
                <Pencil size={16} />
                Modifier mon profil
              </button>
            </GlassCard>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <GlassCard hover className="!bg-white flex items-center gap-4 shadow-soft">
                <div className="p-3 bg-primary-100 text-primary-600 rounded-lg">
                  <BookOpen size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Cours inscrits</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.courses}</h3>
                </div>
              </GlassCard>

              <GlassCard hover className="!bg-white flex items-center gap-4 shadow-soft">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                  <Award size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Certifications obtenues</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.certs}</h3>
                </div>
              </GlassCard>

              <GlassCard hover className="!bg-white flex items-center gap-4 shadow-soft">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Niveau actuel</p>
                  <h3 className="text-2xl font-bold text-gray-900 capitalize">
                    {formatLevel(stats.level)}
                  </h3>
                </div>
              </GlassCard>
            </div>

            <GlassCard className="!bg-white shadow-soft border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">À propos</h3>
              {bio ? (
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{bio}</p>
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
