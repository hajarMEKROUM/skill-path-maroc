import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { adminService } from '../../services/admin.service';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    price: 0,
    level: 'beginner',
    status: 'draft',
  });

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/admin/courses', { params: { per_page: 50 } });
      const raw = response.data.data ?? response.data;
      const list = Array.isArray(raw) ? raw : [];
      setCourses(list);
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de charger les cours.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setActionLoading('create');
    setError(null);
    try {
      await adminService.createCourse(createForm);
      setShowCreate(false);
      setCreateForm({ title: '', description: '', price: 0, level: 'beginner', status: 'draft' });
      await fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création du cours.');
    } finally {
      setActionLoading(null);
    }
  };

  const togglePublish = async (course) => {
    const nextStatus = course.status === 'published' ? 'draft' : 'published';
    setActionLoading(course.id);
    try {
      await api.put(`/admin/courses/${course.id}`, { status: nextStatus });
      await fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du statut.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Supprimer ce cours ?')) return;
    setActionLoading(courseId);
    try {
      await api.delete(`/admin/courses/${courseId}`);
      await fetchCourses();
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des cours</h1>
          <p className="text-gray-500 text-sm mt-1">Publier, dépublier ou supprimer les cours de la plateforme.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate((v) => !v)}
          className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700"
        >
          {showCreate ? 'Annuler' : 'Ajouter un cours'}
        </button>
      </div>

      {showCreate && (
        <form
          onSubmit={handleCreateCourse}
          className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 space-y-4"
        >
          <input
            type="text"
            placeholder="Titre"
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Prix (MAD)"
              value={createForm.price}
              onChange={(e) => setCreateForm({ ...createForm, price: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
            <select
              value={createForm.level}
              onChange={(e) => setCreateForm({ ...createForm, level: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="beginner">Débutant</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="expert">Expert</option>
            </select>
            <select
              value={createForm.status}
              onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={actionLoading === 'create'}
            className="py-2 px-6 bg-emerald-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
          >
            Créer le cours
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Instructeur</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Prix</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded" />
                    </td>
                  </tr>
                ))
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Aucun cours trouvé.
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{course.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {course.instructor?.name ?? course.instructor?.data?.name ?? '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                          course.status === 'published'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {parseFloat(course.price) > 0 ? `${course.price} MAD` : 'Gratuit'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        type="button"
                        disabled={actionLoading === course.id}
                        onClick={() => togglePublish(course)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 disabled:opacity-50"
                      >
                        {course.status === 'published' ? 'Dépublier' : 'Publier'}
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading === course.id}
                        onClick={() => handleDelete(course.id)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50"
                      >
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

export default AdminCourses;
