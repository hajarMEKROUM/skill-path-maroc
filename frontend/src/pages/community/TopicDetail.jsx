import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Send, UserPlus, MessageSquare } from 'lucide-react';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';

const TopicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [topic, setTopic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentBody, setCommentBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchTopic = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/forum/topics/${id}`);
      setTopic(response.data.data ?? response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Sujet introuvable.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTopic();
    } else {
      setIsLoading(false);
      setError('Connectez-vous pour voir ce sujet.');
    }
  }, [id, isAuthenticated]);

  const handleConnect = () => {
    setConnected(true);
  };

  const handleSendMessage = async () => {
    const authorId = topic?.author?.id;
    if (!authorId || authorId === user?.id) return;
    setActionLoading('message');
    try {
      await api.post('/chat/conversations', {
        recipient_id: authorId,
        content: `Bonjour, je souhaite échanger à propos de votre sujet : "${topic.title}"`,
      });
      navigate('/dashboard/messages');
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de démarrer la conversation.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentBody.trim()) return;
    setIsSubmitting(true);
    try {
      await api.post(`/forum/topics/${id}/comments`, { body: commentBody });
      setCommentBody('');
      await fetchTopic();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi du commentaire.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-primary-600" size={40} />
      </div>
    );
  }

  if (error && !topic) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link to="/community" className="text-primary-600 flex items-center gap-2 mb-6">
          <ArrowLeft size={18} /> Retour au forum
        </Link>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      </div>
    );
  }

  const comments = topic?.comments ?? [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link to="/community" className="text-primary-600 flex items-center gap-2 mb-6 hover:underline">
        <ArrowLeft size={18} /> Retour au forum
      </Link>

      <article className="bg-white rounded-2xl border border-gray-100 p-6 shadow-soft mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{topic.title}</h1>
        <p className="text-sm text-gray-500 mt-2">
          Par {topic.author?.name ?? 'Anonyme'}
          {topic.created_at && ` · ${new Date(topic.created_at).toLocaleString('fr-FR')}`}
        </p>
        <div className="mt-6 text-gray-700 whitespace-pre-wrap">{topic.body}</div>
        {isAuthenticated && topic.author?.id && topic.author.id !== user?.id && (
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handleConnect}
              disabled={connected}
              className="btn-secondary flex items-center gap-2 py-2 px-4 text-sm disabled:opacity-60"
            >
              <UserPlus size={16} />
              {connected ? 'Connecté' : 'Se connecter'}
            </button>
            <button
              type="button"
              onClick={handleSendMessage}
              disabled={actionLoading === 'message'}
              className="btn-primary flex items-center gap-2 py-2 px-4 text-sm disabled:opacity-50"
            >
              <MessageSquare size={16} />
              {actionLoading === 'message' ? 'Ouverture...' : 'Envoyer un message'}
            </button>
          </div>
        )}
      </article>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Commentaires ({comments.length})
        </h2>
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucun commentaire pour l&apos;instant.</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li key={comment.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-sm font-medium text-gray-800">{comment.author?.name ?? 'Utilisateur'}</p>
                <p className="text-gray-700 mt-2 whitespace-pre-wrap">{comment.body}</p>
                {comment.created_at && (
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(comment.created_at).toLocaleString('fr-FR')}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {isAuthenticated && (
        <form onSubmit={handleComment} className="bg-white rounded-xl border border-gray-100 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Ajouter un commentaire</label>
          <textarea
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Votre message..."
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex items-center gap-2 py-2 px-4 disabled:opacity-50"
          >
            <Send size={16} />
            {isSubmitting ? 'Envoi...' : 'Publier'}
          </button>
        </form>
      )}
    </div>
  );
};

export default TopicDetail;
