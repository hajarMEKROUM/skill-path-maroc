import api from './api';

export const fetchUserProfile = async () => {
  const response = await api.get('/user'); // Alias for /me
  return response.data;
};
