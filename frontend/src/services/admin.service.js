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

  banUser: async (userId, reason) => {
    const response = await api.patch(`/admin/users/${userId}/ban`, { reason });
    return response.data;
  },

  approveCourse: async (courseId) => {
    const response = await api.patch(`/admin/courses/${courseId}/approve`);
    return response.data;
  },
  
  getReports: async () => {
    const response = await api.get('/admin/reports');
    return response.data;
  }
};
