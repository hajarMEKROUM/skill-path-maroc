import api from './api';

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  createUser: async (payload) => {
    console.log('payload', payload);
    const response = await api.post('/admin/users', payload);
    return response.data;
  },

  createCourse: async (payload) => {
    const response = await api.post('/admin/courses', payload);
    return response.data;
  },

  createJob: async (payload) => {
    const response = await api.post('/admin/jobs', payload);
    return response.data;
  },

  banUser: async (userId, reason) => {
    const response = await api.put(`/admin/user/${userId}/ban`, { reason });
    return response.data;
  },
};
