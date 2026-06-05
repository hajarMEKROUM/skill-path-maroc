import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Plus, Loader2 } from 'lucide-react';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';

const Forum = () => {
  const { isAuthenticated } = useAuthStore();
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', body: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTopics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/forum/topics');
      const data = response.data.data ?? response.data;
      setTopics(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Connectez-vous pour accéder au forum communautaire.');
      } else {
        setError(err.response?.data?.message || 'Impossible de charger les sujets.');
      }
      setTopics([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTopics();
    } else {
      setIsLoading(false);
      setError('Connectez-vous pour accéder au forum communautaire.');
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    setIsSubmitting(true);
    try {
      await api.post('/forum/topics', form);
      setForm({ title: '', body: '' });
      setShowForm(false);
      await fetchTopics();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création du sujet.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <MessageSquare className="text-primary-600" />
            Forum communautaire
          </h1>
          <p className="text-gray-500 mt-1">Entraide entre étudiants et développeurs</p>
        </div>
        {isAuthenticated && (
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center justify-center gap-2 py-2 px-4"
          >
            <Plus size={18} />
            Nouveau sujet
          </button>
        )}
      </div>

      {showForm && isAuthenticated && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 mb-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary py-2 px-6 disabled:opacity-50">
            {isSubmitting ? 'Publication...' : 'Publier'}
          </button>
        </form>
      )}

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg mb-6">
          {error}
          {!isAuthenticated && (
            <Link to="/login" className="block mt-2 font-medium text-primary-600 hover:underline">
              Se connecter
            </Link>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-primary-600" size={40} />
        </div>
      ) : topics.length === 0 && !error ? (
        <div className="text-center py-16 text-gray-500">
          <MessageSquare className="mx-auto mb-4 text-gray-300" size={48} />
          <p>Aucun sujet pour le moment. Soyez le premier à poster !</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {topics.map((topic) => (
            <li key={topic.id}>
              <Link
                to={`/community/${topic.id}`}
                className="block bg-white rounded-xl border border-gray-100 p-5 hover:border-primary-200 hover:shadow-soft transition-all"
              >
                <h2 className="font-semibold text-gray-900 text-lg">{topic.title}</h2>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{topic.body}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                  <span>{topic.author?.name ?? 'Anonyme'}</span>
                  <span>{topic.comments_count ?? 0} commentaire(s)</span>
                  {topic.created_at && (
                    <span>{new Date(topic.created_at).toLocaleDateString('fr-FR')}</span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Forum;
