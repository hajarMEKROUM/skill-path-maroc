import React, { useEffect, useState } from 'react';
import { MessagesSquare, Plus, Pencil, Trash2, X } from 'lucide-react';
import api from '../../services/api';

const AdminCommunity = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [form, setForm] = useState({ title: '', body: '' });

  const fetchTopics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/forum/topics', { params: { per_page: 50 } });
      const raw = response.data.data ?? response.data;
      setTopics(Array.isArray(raw) ? raw : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de charger les sujets.');
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const openCreate = () => {
    setEditingTopic(null);
    setForm({ title: '', body: '' });
    setShowForm(true);
  };

  const openEdit = (topic) => {
    setEditingTopic(topic);
    setForm({ title: topic.title, body: topic.body });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading('form');
    setError(null);
    try {
      if (editingTopic) {
        await api.put(`/admin/forum/topics/${editingTopic.id}`, form);
      } else {
        await api.post('/forum/topics', form);
      }
      setShowForm(false);
      setForm({ title: '', body: '' });
      await fetchTopics();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (topicId) => {
    if (!window.confirm('Supprimer ce sujet et tous ses commentaires ?')) return;
    setActionLoading(topicId);
    try {
      await api.delete(`/forum/topics/${topicId}`);
      await fetchTopics();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <MessagesSquare className="text-purple-600" />
            Gestion Communauté
          </h1>
          <p className="text-gray-500 mt-1">Gérez les sujets du forum communautaire.</p>
        </div>
        <button type="button" onClick={openCreate} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
          <Plus size={18} />
          Ajouter
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="page-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">
              {editingTopic ? 'Modifier le sujet' : 'Nouveau sujet'}
            </h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
            <textarea
              required
              rows={4}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button type="submit" disabled={actionLoading === 'form'} className="btn-primary py-2 px-6 text-sm disabled:opacity-50">
            {actionLoading === 'form' ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      )}

      <div className="page-card overflow-x-auto">
        {loading ? (
          <p className="text-gray-500 text-sm py-8 text-center">Chargement...</p>
        ) : topics.length === 0 ? (
          <p className="text-gray-500 text-sm py-8 text-center">Aucun sujet pour le moment.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="pb-3 pr-4 font-medium">Titre</th>
                <th className="pb-3 pr-4 font-medium hidden sm:table-cell">Auteur</th>
                <th className="pb-3 pr-4 font-medium hidden md:table-cell">Commentaires</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {topics.map((topic) => (
                <tr key={topic.id} className="hover:bg-gray-50">
                  <td className="py-3 pr-4">
                    <p className="font-medium text-gray-800 line-clamp-1">{topic.title}</p>
                  </td>
                  <td className="py-3 pr-4 text-gray-500 hidden sm:table-cell">
                    {topic.author?.name || '—'}
                  </td>
                  <td className="py-3 pr-4 text-gray-500 hidden md:table-cell">
                    {topic.comments_count ?? 0}
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(topic)}
                        disabled={actionLoading === topic.id}
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(topic.id)}
                        disabled={actionLoading === topic.id}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminCommunity;
