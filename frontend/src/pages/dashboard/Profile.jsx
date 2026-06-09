import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Calendar, Pencil, Image, BadgeCheck, Hash, CircleDot } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import ErrorState from '../../components/shared/ErrorState';
import { normalizeRole, ROLES } from '../../utils/roles';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';

const apiOrigin = (
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
).replace(/\/api\/v1\/?$/, '');

const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith('http')) return avatar;
  const path = avatar.startsWith('/') ? avatar : `/${avatar}`;
  return `${apiOrigin}${path}`;
};

const roleLabels = {
  [ROLES.USER]: 'Étudiant',
  [ROLES.ENTREPRISE]: 'Entreprise',
  [ROLES.ADMIN]: 'Administrateur',
  student: 'Étudiant',
  instructor: 'Instructeur',
  freelancer: 'Freelance',
  enterprise: 'Entreprise',
  company: 'Entreprise',
  admin: 'Administrateur',
  user: 'Étudiant',
};

const getRoleLabel = (role) => {
  const normalized = normalizeRole(role);
  return roleLabels[normalized] || roleLabels[role] || 'Étudiant';
};

const ProfileSkeleton = () => (
  <div className="page-card animate-pulse space-y-4">
    <div className="flex items-center gap-6">
      <div className="w-20 h-20 rounded-full bg-gray-200" />
      <div className="space-y-2 flex-1">
        <div className="h-6 bg-gray-200 rounded w-48" />
        <div className="h-4 bg-gray-200 rounded w-56" />
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div key={i} className="h-10 bg-gray-200 rounded" />
      ))}
    </div>
  </div>
);

export default function Profile() {
  const { data, loading, error, refetch } = useProfile();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="page-title">Mon profil</h1>
        <ErrorState message={error} onRetry={refetch} />
      </div>
    );
  }

  const avatarUrl = getAvatarUrl(data?.avatar);
  const initials = data?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer votre compte ?\nCette action est irréversible."
    );

    if (!confirmed) return;

    try {
      await api.delete('/user');
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="page-title">Mon profil</h1>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/settings')}
            className="flex items-center gap-2 py-2 px-4 text-sm rounded-lg bg-[#7c3aed] text-white"
          >
            <Pencil size={16} />
            Modifier
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 py-2 px-4 text-sm rounded-lg bg-gray-200 text-gray-700"
          >
            Déconnexion
          </button>
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="flex items-center gap-2 py-2 px-4 text-sm rounded-lg bg-[#dc2626] text-white"
          >
            Supprimer mon compte
          </button>
        </div>
      </div>

      {loading ? (
        <ProfileSkeleton />
      ) : (
        <div className="page-card">
          <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-100">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={data?.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-purple-100"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-semibold">
                {initials || <User size={32} />}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-800">{data?.name}</h2>
              <p className="text-gray-500 text-sm mt-1">{data?.email}</p>
            </div>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Hash className="text-purple-600 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <dt className="text-sm text-gray-500">Identifiant</dt>
                <dd className="font-medium text-gray-800">{data?.id || '—'}</dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="text-purple-600 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <dt className="text-sm text-gray-500">Nom complet</dt>
                <dd className="font-medium text-gray-800">{data?.name || '—'}</dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="text-purple-600 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <dt className="text-sm text-gray-500">Email</dt>
                <dd className="font-medium text-gray-800">{data?.email || '—'}</dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="text-purple-600 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <dt className="text-sm text-gray-500">Rôle</dt>
                <dd className="font-medium text-gray-800">{getRoleLabel(data?.role)}</dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CircleDot className="text-purple-600 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <dt className="text-sm text-gray-500">Statut</dt>
                <dd className="font-medium text-gray-800">{data?.status || '—'}</dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <BadgeCheck className="text-purple-600 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <dt className="text-sm text-gray-500">Vérification</dt>
                <dd className="font-medium text-gray-800">{data?.is_verified ? 'Vérifié' : 'Non vérifié'}</dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Image className="text-purple-600 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <dt className="text-sm text-gray-500">Photo</dt>
                <dd className="font-medium text-gray-800">{data?.avatar ? 'Disponible' : 'Aucune photo'}</dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="text-purple-600 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <dt className="text-sm text-gray-500">Date d&apos;inscription</dt>
                <dd className="font-medium text-gray-800">
                  {data?.created_at
                    ? new Date(data.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : '—'}
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="text-purple-600 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <dt className="text-sm text-gray-500">Dernière mise à jour</dt>
                <dd className="font-medium text-gray-800">
                  {data?.updated_at
                    ? new Date(data.updated_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : '—'}
                </dd>
              </div>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
