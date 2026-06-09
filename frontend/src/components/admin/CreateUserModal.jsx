import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import api from '../../services/api';

export default function CreateUserModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    photo: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('password', formData.password);
      payload.append('role', formData.role);
      if (formData.photo) {
        payload.append('photo', formData.photo);
      }
      
      await api.post('/admin/users', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Ajouter un utilisateur</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input required type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input required type="email" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input required type="password" minLength={8} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
            <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
              <option value="user">Utilisateur (Étudiant)</option>
              <option value="admin">Administrateur</option>
              <option value="freelance">Freelance</option>
              <option value="entreprise">Entreprise</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo (Optionnel)</label>
            <input type="file" accept="image/*" onChange={(e) => setFormData({...formData, photo: e.target.files[0]})} className="w-full text-sm" />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50">Annuler</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
              <Save size={16} />
              {loading ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
