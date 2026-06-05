import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/courses', { params: { admin: 1, per_page: 50 } });
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

  const togglePublish = async (course) => {
    const nextStatus = course.status === 'published' ? 'draft' : 'published';
    setActionLoading(course.id);
    try {
      await api.put(`/courses/${course.id}`, { status: nextStatus });
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
      await api.delete(`/courses/${courseId}`);
      await fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestion des cours</h1>
        <p className="text-gray-500 text-sm mt-1">Publier, dépublier ou supprimer les cours de la plateforme.</p>
      </div>

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
