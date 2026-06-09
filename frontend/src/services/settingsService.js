import api from './api';

export const updateProfileInfo = async (data) => {
  const response = await api.put('/user/profile', data);
  return response.data;
};

export const updatePasswordInfo = async (data) => {
  const response = await api.put('/user/password', data);
  return response.data;
};
