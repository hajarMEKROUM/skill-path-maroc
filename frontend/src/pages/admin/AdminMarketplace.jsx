import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { adminService } from '../../services/admin.service';

const AdminMarketplace = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    budget_min: '',
    budget_max: '',
    status: 'open',
  });

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const [allRes, pendingRes] = await Promise.allSettled([
        api.get('/jobs', { params: { per_page: 50 } }),
        api.get('/admin/jobs/pending'),
      ]);

      const allJobs =
        allRes.status === 'fulfilled'
          ? allRes.value.data?.data ?? allRes.value.data ?? []
          : [];
      const pendingJobs =
        pendingRes.status === 'fulfilled'
          ? pendingRes.value.data?.data ?? pendingRes.value.data ?? []
          : [];

      const merged = [...pendingJobs, ...allJobs];
      const unique = merged.filter(
        (job, index, arr) => arr.findIndex((j) => j.id === job.id) === index
      );
      setJobs(unique);
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de charger les offres.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setActionLoading('create');
    setError(null);
    try {
      await adminService.createJob({
        ...createForm,
        budget_min: createForm.budget_min || null,
        budget_max: createForm.budget_max || null,
      });
      setShowCreate(false);
      setCreateForm({ title: '', description: '', budget_min: '', budget_max: '', status: 'open' });
      await fetchJobs();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création de l\'offre.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleApprove = async (jobId) => {
    setActionLoading(jobId);
    try {
      await api.put(`/admin/jobs/${jobId}/approve`);
      await fetchJobs();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'approbation.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (jobId) => {
    if (!window.confirm('Rejeter cette offre ?')) return;
    setActionLoading(jobId);
    try {
      await api.put(`/admin/jobs/${jobId}/reject`);
      await fetchJobs();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du rejet.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marketplace / Jobs</h1>
          <p className="text-gray-500 text-sm mt-1">Modérer les offres freelance publiées sur la plateforme.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate((v) => !v)}
          className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700"
        >
          {showCreate ? 'Annuler' : 'Ajouter une offre'}
        </button>
      </div>

      {showCreate && (
        <form
          onSubmit={handleCreateJob}
          className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 space-y-4"
        >
          <input
            type="text"
            placeholder="Titre de l&apos;offre"
            required
            value={createForm.title}
            onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Description"
            required
            rows={4}
            value={createForm.description}
            onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="number"
              min="0"
              placeholder="Budget min (MAD)"
              value={createForm.budget_min}
              onChange={(e) => setCreateForm({ ...createForm, budget_min: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
            <input
              type="number"
              min="0"
              placeholder="Budget max (MAD)"
              value={createForm.budget_max}
              onChange={(e) => setCreateForm({ ...createForm, budget_max: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={actionLoading === 'create'}
            className="py-2 px-6 bg-emerald-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
          >
            Créer l&apos;offre
          </button>
        </form>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Titre</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Entreprise</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading
                ? [...Array(5)].map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td colSpan={4} className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded" />
                      </td>
                    </tr>
                  ))
                : jobs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Aucune offre trouvée.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {job.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {job.client?.name ?? job.company_name ?? '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700 capitalize">
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        type="button"
                        disabled={actionLoading === job.id}
                        onClick={() => handleApprove(job.id)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                      >
                        Approuver
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading === job.id}
                        onClick={() => handleReject(job.id)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50"
                      >
                        Rejeter
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminMarketplace;
