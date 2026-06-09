import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { adminService } from '../../services/admin.service';
import { Pencil, Trash2, Plus, X } from 'lucide-react';

const emptyForm = {
  title: '',
  description: '',
  budget: '',
  status: 'open',
};

const AdminMarketplace = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/admin/freelance');
      setJobs(response.data);
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

  const openCreate = () => {
    setEditingJob(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (job) => {
    const budget = job.budget_min ?? job.budget_max ?? '';
    setEditingJob(job);
    setForm({
      title: job.title || '',
      description: job.description || '',
      budget: budget === '' ? '' : String(budget),
      status: job.status || 'open',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(editingJob ? editingJob.id : 'create');
    setError(null);

    try {
      const payload = {
        title: form.title,
        description: form.description,
        budget_min: form.budget,
        budget_max: form.budget,
        status: form.status,
      };

      if (editingJob) {
        await api.put(`/jobs/${editingJob.id}`, payload);
      } else {
        await adminService.createJob(payload);
      }

      setShowForm(false);
      setEditingJob(null);
      setForm(emptyForm);
      await fetchJobs();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde de l\'offre.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Supprimer cette offre ?')) return;
    setActionLoading(jobId);
    try {
      await api.delete(`/jobs/${jobId}`);
      await fetchJobs();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion Freelance</h1>
          <p className="text-gray-500 text-sm mt-1">
            {jobs.length} offre{jobs.length !== 1 ? 's' : ''} affichée{jobs.length !== 1 ? 's' : ''}.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 inline-flex items-center gap-2"
        >
          <Plus size={16} />
          Ajouter une offre
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingJob ? 'Modifier l’offre' : 'Ajouter une offre'}
            </h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          <input
            type="text"
            placeholder="Titre de l'offre"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Description"
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="number"
            min="0"
            required
            placeholder="Budget (DH)"
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="open">Open</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            type="submit"
            disabled={actionLoading === 'create' || actionLoading === editingJob?.id}
            className="py-2 px-6 bg-emerald-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {editingJob ? 'Enregistrer les modifications' : 'Créer l’offre'}
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Auteur</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Localisation</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type de contrat</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading
                ? [...Array(5)].map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded" />
                      </td>
                    </tr>
                  ))
                : jobs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Aucune offre trouvée.
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{job.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {job.client?.name ?? job.company_name ?? '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700 capitalize">
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {job.budget_min != null && job.budget_max != null
                          ? `${job.budget_min} - ${job.budget_max} MAD`
                          : job.budget_min != null
                            ? `${job.budget_min} MAD`
                            : '—'}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          type="button"
                          disabled={actionLoading === job.id}
                          onClick={() => openEdit(job)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 disabled:opacity-50 inline-flex items-center gap-1"
                        >
                          <Pencil size={14} />
                          Modifier
                        </button>
                        <button
                          type="button"
                          disabled={actionLoading === job.id}
                          onClick={() => handleDelete(job.id)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50 inline-flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          Supprimer
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
