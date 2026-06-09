import React, { useEffect, useMemo, useState } from 'react';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import { usersService } from '../../services/users.service';

const ROLES = ['user', 'entreprise', 'admin'];

const emptyForm = {
  name: '',
  email: '',
  password: '',
  role: 'user',
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ lastPage: 1, total: 0 });
  const [actionLoading, setActionLoading] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchUsers = async (pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const data = await usersService.getUsers({ page: pageNum, per_page: 15 });
      const list = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
      setUsers(list);
      setPagination({
        lastPage: data.last_page ?? 1,
        total: data.total ?? list.length,
      });
      setPage(data.current_page ?? pageNum);
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de charger les utilisateurs.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const openCreate = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (userItem) => {
    setEditingUser(userItem);
    setForm({
      name: userItem.name || '',
      email: userItem.email || '',
      password: '',
      role: userItem.role || 'user',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(editingUser ? editingUser.id : 'create');
    setError(null);

    try {
      if (!form.password && !editingUser) {
        throw new Error('Le mot de passe est requis pour créer un utilisateur.');
      }

      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      };

      if (editingUser) {
        await usersService.updateUser(editingUser.id, payload);
      } else {
        await usersService.createUser(payload);
      }

      setShowForm(false);
      setEditingUser(null);
      setForm(emptyForm);
      await fetchUsers(page);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erreur lors de l\'enregistrement.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Supprimer définitivement cet utilisateur ?')) return;
    setActionLoading(userId);
    try {
      await usersService.deleteUser(userId);
      await fetchUsers(page);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression.');
    } finally {
      setActionLoading(null);
    }
  };

  const columns = useMemo(() => ['Nom', 'Rôle', 'Statut', 'Photo', 'Actions'], []);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
          <p className="text-gray-500 text-sm mt-1">
            {pagination.total} utilisateur{pagination.total !== 1 ? 's' : ''} au total
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 inline-flex items-center gap-2"
        >
          <Plus size={16} />
          Ajouter un utilisateur
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingUser ? 'Modifier l’utilisateur' : 'Ajouter un utilisateur'}
            </h2>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nom"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
            <input
              type="password"
              placeholder={editingUser ? 'Mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe'}
              required={!editingUser}
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={actionLoading === 'create' || actionLoading === editingUser?.id}
            className="py-2 px-6 bg-emerald-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {editingUser ? 'Enregistrer les modifications' : 'Créer l’utilisateur'}
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
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                users.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.role || 'user'}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          item.status === 'banned'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {item.status === 'banned' ? 'Banni' : 'Actif'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500">
                          {item.name?.slice(0, 2)?.toUpperCase() || 'NA'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        type="button"
                        disabled={actionLoading === item.id}
                        onClick={() => openEdit(item)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 disabled:opacity-50 inline-flex items-center gap-1"
                      >
                        <Pencil size={14} />
                        Modifier
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading === item.id}
                        onClick={() => handleDelete(item.id)}
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

        {!loading && pagination.lastPage > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="text-sm px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Précédent
            </button>
            <span className="text-sm text-gray-500">
              Page {page} / {pagination.lastPage}
            </span>
            <button
              type="button"
              disabled={page >= pagination.lastPage}
              onClick={() => setPage((p) => p + 1)}
              className="text-sm px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
