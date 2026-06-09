import api from './api';

export const usersService = {
  // Fetch paginated users with filters and sorting
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  // Get single user details
  getUserDetails: async (id) => {
    const response = await api.get(`/admin/user/${id}`);
    return response.data;
  },

  createUser: async (payload) => {
    const response = await api.post('/admin/users', {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: payload.role,
    });
    return response.data;
  },

  updateUser: async (id, payload) => {
    const response = await api.put(`/admin/user/${id}`, payload);
    return response.data;
  },

  // Update user role (Spatie implementation in backend)
  updateRole: async (id, role) => {
    const response = await api.put(`/admin/user/${id}/role`, { role });
    return response.data;
  },

  // Ban or suspend user
  banUser: async (id, reason) => {
    const response = await api.put(`/admin/user/${id}/ban`, { reason });
    return response.data;
  },

  // Verify user manually
  verifyUser: async (id) => {
    const response = await api.put(`/admin/user/${id}/verify`);
    return response.data;
  },

  // Delete user (soft delete)
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/user/${id}`);
    return response.data;
  }
};
