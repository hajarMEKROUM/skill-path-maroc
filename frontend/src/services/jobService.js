import api from './api';

export const fetchJobs = async (params = {}) => {
  const response = await api.get('/jobs', { params });
  return response.data;
};
