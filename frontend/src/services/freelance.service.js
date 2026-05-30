import api from './api';

export const freelanceService = {
  // Fetch paginated freelance missions
  getMissions: async (params = {}) => {
    const response = await api.get('/freelance/missions', { params });
    return response.data;
  },

  // Submit a proposal for a specific mission
  submitProposal: async (missionId, data) => {
    const response = await api.post(`/freelance/missions/${missionId}/proposals`, data);
    return response.data;
  },

  // Get conversation messages
  getMessages: async (conversationId) => {
    const response = await api.get(`/chat/conversations/${conversationId}/messages`);
    return response.data;
  },

  // Send a new message
  sendMessage: async (conversationId, messageData) => {
    const response = await api.post(`/chat/conversations/${conversationId}/messages`, messageData);
    return response.data;
  },
  
  // Get active conversations for the user
  getConversations: async () => {
    const response = await api.get('/chat/conversations');
    return response.data;
  }
};
