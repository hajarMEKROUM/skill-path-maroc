import { useCallback, useEffect, useState } from 'react';
import api from '../../services/api';
import { Pencil, Trash2, Plus, X } from 'lucide-react';

const emptyForm = {
  title: '',
  description: '',
  photo: '',
  price: 0,
  level: 'beginner',
  status: 'draft',
};

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/admin/courses', { params: { per_page: 50 } });
      const raw = response.data.data ?? response.data;
      setCourses(Array.isArray(raw) ? raw : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de charger les cours.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchCourses();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchCourses]);

  const openCreate = () => {
    setEditingCourse(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (course) => {
    setEditingCourse(course);
    setForm({
      title: course.title || '',
      description: course.description || '',
      photo: course.thumbnail || '',
      price: course.price ?? 0,
      level: course.level || 'beginner',
      status: course.status || 'draft',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(editingCourse ? editingCourse.id : 'create');
    setError(null);
    try {
      const data = new FormData();
      data.append('title', form.title);
      data.append('description', form.description);
      data.append('price', form.price);
      data.append('level', form.level);
      data.append('status', form.status);
      if (form.photo instanceof File) {
        data.append('photo', form.photo);
      }

      if (editingCourse) {
        data.append('_method', 'PUT');
        await api.post(`/admin/courses/${editingCourse.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/admin/courses', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setShowForm(false);
      setEditingCourse(null);
      setForm(emptyForm);
      await fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde du cours.');
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
          <p className="text-gray-500 text-sm mt-1">
            {courses.length} cours affiché{courses.length !== 1 ? 's' : ''}.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 inline-flex items-center gap-2"
        >
          <Plus size={16} />
          Ajouter un cours
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingCourse ? 'Modifier le cours' : 'Ajouter un cours'}
            </h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          <input
            type="text"
            placeholder="Titre"
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
          <div>
            <label htmlFor="course-photo">Photo du cours</label>
            <input
              id="course-photo"
              name="photo"
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, photo: e.target.files[0] })}
            />
            {form.photo && typeof form.photo === 'string' && (
              <img
                src={form.photo}
                alt="aperçu"
                style={{ width: 80, height: 80, objectFit: 'cover', marginTop: 8 }}
              />
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Prix (MAD)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
            <select
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="beginner">Débutant</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="expert">Expert</option>
            </select>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={actionLoading === 'create' || actionLoading === editingCourse?.id}
            className="py-2 px-6 bg-emerald-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {editingCourse ? 'Enregistrer les modifications' : 'Créer le cours'}
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded" />
                    </td>
                  </tr>
                ))
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
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
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {course.description}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        type="button"
                        disabled={actionLoading === course.id}
                        onClick={() => openEdit(course)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 disabled:opacity-50 inline-flex items-center gap-1"
                      >
                        <Pencil size={14} />
                        Modifier
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading === course.id}
                        onClick={() => handleDelete(course.id)}
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

export default AdminCourses;
