import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Save, Settings as SettingsIcon, Eye, EyeOff, LogOut, Trash2, Upload } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';

const apiOrigin = (
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
).replace(/\/api\/v1\/?$/, '');

const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith('http')) return avatar;
  const path = avatar.startsWith('/') ? avatar : `/${avatar}`;
  return `${apiOrigin}${path}`;
};

const Feedback = ({ success, error }) => (
  <>
    {success && (
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-sm">
        {success}
      </div>
    )}
    {error && (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
        {error}
      </div>
    )}
  </>
);

export default function Settings() {
  const { user, checkAuth, logout } = useAuthStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    bio: '',
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm((state) => ({
        ...state,
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
      }));
    }
  }, [user]);

  const clearStatus = () => {
    setSuccess('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearStatus();

    if (form.password || form.current_password || form.password_confirmation) {
      if (!form.current_password || !form.password || !form.password_confirmation) {
        setError('Renseignez le mot de passe actuel, le nouveau mot de passe et sa confirmation.');
        return;
      }
      if (form.password !== form.password_confirmation) {
        setError('Les mots de passe ne correspondent pas.');
        return;
      }
    }

    setLoading(true);

    try {
      if (avatarFile) {
        const avatarData = new FormData();
        avatarData.append('avatar', avatarFile);
        await api.post('/profile/avatar', avatarData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      await api.put('/user/profile', {
        name: form.name,
        email: form.email,
        bio: form.bio,
      });

      if (form.password || form.current_password || form.password_confirmation) {
        await api.put('/user/password', {
          current_password: form.current_password,
          password: form.password,
          password_confirmation: form.password_confirmation,
        });
      }

      await checkAuth();
      setAvatarFile(null);
      setForm((state) => ({
        ...state,
        current_password: '',
        password: '',
        password_confirmation: '',
      }));
      setSuccess('Profil mis à jour avec succès.');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Impossible de mettre à jour le profil.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    clearStatus();
    if (!window.confirm('Supprimer définitivement votre compte ? Cette action est irréversible.')) return;

    setLoading(true);
    try {
      await api.delete('/user');
      await logout().catch(() => {});
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de supprimer le compte.');
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <SettingsIcon className="text-purple-600" />
          Paramètres
        </h1>
        <p className="text-gray-500 mt-1">
          Modifiez vos informations sur un seul formulaire.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="page-card space-y-6">
        <Feedback success={success} error={error} />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Photo</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">
              {user.avatar ? (
                <img src={getAvatarUrl(user.avatar)} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-sm font-semibold">
                  {user.name?.slice(0, 2)?.toUpperCase() || 'SP'}
                </span>
              )}
            </div>
            <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
              <Upload size={16} />
              Choisir une photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  setAvatarFile(e.target.files?.[0] || null);
                  clearStatus();
                }}
              />
            </label>
            {avatarFile && <span className="text-sm text-gray-500 truncate">{avatarFile.name}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => { setForm({ ...form, name: e.target.value }); clearStatus(); }}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => { setForm({ ...form, email: e.target.value }); clearStatus(); }}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              rows={4}
              value={form.bio}
              onChange={(e) => { setForm({ ...form, bio: e.target.value }); clearStatus(); }}
              className="input-field"
              placeholder="Parlez un peu de vous..."
            />
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h2 className="text-lg font-semibold text-gray-800">Mot de passe</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.current_password}
                onChange={(e) => { setForm({ ...form, current_password: e.target.value }); clearStatus(); }}
                className="input-field pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => { setForm({ ...form, password: e.target.value }); clearStatus(); }}
              className="input-field"
              minLength={8}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmation du nouveau mot de passe</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password_confirmation}
              onChange={(e) => { setForm({ ...form, password_confirmation: e.target.value }); clearStatus(); }}
              className="input-field"
              minLength={8}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>

          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <Trash2 size={18} />
            Supprimer mon compte
          </button>

          <button
            type="button"
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </form>
    </div>
  );
}
