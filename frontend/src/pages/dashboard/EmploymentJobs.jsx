import React, { useEffect, useState } from 'react';
import { FileText, MapPin, Briefcase, Plus, X } from 'lucide-react';
import api from '../../services/api';
import ErrorState from '../../components/shared/ErrorState';
import SkeletonCard from '../../components/shared/SkeletonCard';

const CONTRACT_TYPES = ['CDI', 'CDD', 'Stage', 'Alternance', 'Freelance'];

const EmploymentJobCard = ({ job }) => (
  <div className="page-card">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="font-semibold text-gray-800 text-lg">{job.title}</h3>
        {(job.user?.name || job.client?.name) && (
          <p className="text-sm text-purple-600 mt-1">{job.user?.name || job.client?.name}</p>
        )}
      </div>
      {job.contract_type && (
        <span className="text-xs font-medium bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full flex-shrink-0">
          {job.contract_type}
        </span>
      )}
    </div>
    {job.location && (
      <p className="flex items-center gap-1 text-sm text-gray-500 mt-3">
        <MapPin size={14} className="text-purple-600" />
        {job.location}
      </p>
    )}
    {job.description && (
      <p className="mt-3 text-gray-600 text-sm leading-relaxed line-clamp-3">{job.description}</p>
    )}
  </div>
);

export default function EmploymentJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    contract_type: 'CDI',
  });

  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/employment');
      const raw = response.data.data ?? response.data;
      setJobs(Array.isArray(raw) ? raw : []);
    } catch {
      setError('Impossible de charger les offres d\'emploi.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post('/employment', {
        title: form.title,
        description: form.description,
        location: form.location,
        contract_type: form.contract_type,
      });
      setForm({ title: '', description: '', location: '', contract_type: 'CDI' });
      setShowForm(false);
      await fetchOffers();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la publication de l\'offre.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <FileText className="text-purple-600" />
            Offres d&apos;Emploi
          </h1>
          <p className="text-gray-500 mt-1">Consultez et publiez des offres d&apos;emploi.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2 py-2 px-4 text-sm"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Annuler' : 'Publier une offre'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="page-card space-y-4">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <Briefcase size={18} className="text-purple-600" />
            Nouvelle offre d&apos;emploi
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre du poste</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 text-sm"
              placeholder="Ex : Développeur Full Stack"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 text-sm"
              placeholder="Décrivez le poste, les missions et les compétences requises..."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
              <input
                type="text"
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 text-sm"
                placeholder="Ex : Casablanca, Maroc"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de contrat</label>
              <select
                value={form.contract_type}
                onChange={(e) => setForm({ ...form, contract_type: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 text-sm bg-white"
              >
                {CONTRACT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary py-2 px-6 text-sm disabled:opacity-50"
          >
            {submitting ? 'Publication...' : 'Publier l\'offre'}
          </button>
        </form>
      )}

      {error && !showForm && <ErrorState message={error} onRetry={fetchOffers} />}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!loading && jobs.length === 0 && !error && (
        <div className="page-card text-center py-10">
          <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-700 font-medium">Aucune offre d&apos;emploi pour le moment.</p>
          <p className="text-gray-500 text-sm mt-2">Soyez le premier à publier une offre !</p>
        </div>
      )}

      {!loading && jobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <EmploymentJobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
