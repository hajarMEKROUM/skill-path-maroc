import React, { useEffect, useState } from 'react';
import { usersService } from '../../services/users.service';
import useAuthStore from '../../store/authStore';
import { isAdmin } from '../../utils/roles';

const ROLES = ['user', 'entreprise', 'admin'];

const AdminUsers = () => {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ lastPage: 1, total: 0 });
  const [actionLoading, setActionLoading] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

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

  const handleRoleChange = async (userId, role) => {
    setActionLoading(userId);
    try {
      await usersService.updateRole(userId, role);
      await fetchUsers(page);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du changement de rôle.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBan = async (userId) => {
    if (!window.confirm('Bannir cet utilisateur ?')) return;
    setActionLoading(userId);
    try {
      await usersService.banUser(userId, 'Admin action');
      await fetchUsers(page);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du bannissement.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setActionLoading('create');
    setError(null);
    console.log('Sending payload:', createForm);
    try {
      await usersService.createUser(createForm);
      setShowCreate(false);
      setCreateForm({ name: '', email: '', password: '', role: 'user' });
      await fetchUsers(page);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerify = async (userId) => {
    setActionLoading(userId);
    try {
      await usersService.verifyUser(userId);
      await fetchUsers(page);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la vérification.');
    } finally {
      setActionLoading(null);
    }
  };

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
          onClick={() => setShowCreate((v) => !v)}
          className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700"
        >
          {showCreate ? 'Annuler' : 'Ajouter un utilisateur'}
        </button>
      </div>

      {showCreate && (
        <form
          onSubmit={handleCreateUser}
          className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            placeholder="Nom"
            required
            value={createForm.name}
            onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={createForm.email}
            onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="password"
            placeholder="Mot de passe (min. 8)"
            required
            minLength={8}
            value={createForm.password}
            onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
          <select
            value={createForm.role}
            onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="user">Utilisateur</option>
            <option value="entreprise">Entreprise</option>
            {isAdmin(currentUser?.role) && <option value="admin">Administrateur</option>}
          </select>
          <button
            type="submit"
            disabled={actionLoading === 'create'}
            className="md:col-span-2 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
          >
            Créer l&apos;utilisateur
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Rôle</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
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
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role || 'user'}
                        disabled={actionLoading === user.id || user.id === currentUser?.id}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="text-sm border border-gray-200 rounded-lg px-2 py-1"
                      >
                        {ROLES.filter((r) => r !== 'admin' || isAdmin(currentUser?.role)).map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          user.status === 'banned'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {user.status === 'banned' ? 'Banni' : 'Actif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        type="button"
                        disabled={actionLoading === user.id || user.is_verified}
                        onClick={() => handleVerify(user.id)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 disabled:opacity-50"
                      >
                        Vérifier
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading === user.id}
                        onClick={() => handleBan(user.id)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50"
                      >
                        Bannir
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
