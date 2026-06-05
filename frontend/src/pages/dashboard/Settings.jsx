import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Loader2, Save, Upload, Settings as SettingsIcon } from 'lucide-react';
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

export default function Settings() {
  const { user, checkAuth } = useAuthStore();
  const [form, setForm] = useState({ name: '', bio: '', password: '', password_confirmation: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        bio: user.bio || '',
        password: '',
        password_confirmation: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage(null);
    setError(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setMessage(null);
    try {
      const payload = { name: form.name, bio: form.bio };
      if (form.password) {
        payload.password = form.password;
        payload.password_confirmation = form.password_confirmation;
      }
      await api.put('/profile', payload);
      await checkAuth();
      setMessage('Profil mis à jour avec succès.');
      setForm((prev) => ({ ...prev, password: '', password_confirmation: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    e.preventDefault();
    if (!avatarFile) return;
    setIsUploading(true);
    setError(null);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      await api.post('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await checkAuth();
      setMessage('Photo de profil mise à jour.');
      setAvatarFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du téléversement.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-primary-600" size={40} />
      </div>
    );
  }

  const avatarUrl = getAvatarUrl(user.avatar);

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <SettingsIcon className="text-primary-600" />
          Paramètres
        </h1>
        <Link to="/profile" className="text-sm text-primary-600 hover:underline">
          ← Voir mon profil
        </Link>
      </div>

      <p className="text-gray-500">
        Gérez votre profil, votre mot de passe et vos préférences de compte.
      </p>

      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-soft">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="text-primary-600" size={36} />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{user.email}</p>
            <p className="text-sm text-gray-500 capitalize">Rôle : {user.role}</p>
          </div>
        </div>

        <form onSubmit={handleAvatarUpload} className="flex flex-wrap items-end gap-4 border-t border-gray-100 pt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo de profil</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              className="text-sm text-gray-600"
            />
          </div>
          <button
            type="submit"
            disabled={!avatarFile || isUploading}
            className="btn-secondary flex items-center gap-2 py-2 px-4 disabled:opacity-50"
          >
            <Upload size={16} />
            {isUploading ? 'Envoi...' : 'Téléverser'}
          </button>
        </form>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-soft space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Changer le mot de passe (optionnel)</p>
          <div className="space-y-3">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Nouveau mot de passe"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            <input
              type="password"
              name="password_confirmation"
              value={form.password_confirmation}
              onChange={handleChange}
              placeholder="Confirmer le mot de passe"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary flex items-center gap-2 py-2 px-6 disabled:opacity-50"
        >
          <Save size={18} />
          {isSaving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </div>
  );
}
