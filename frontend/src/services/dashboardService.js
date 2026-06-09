import api from './api';

export const fetchDashboardData = async () => {
  const response = await api.get('/dashboard');
  return response.data;
};
