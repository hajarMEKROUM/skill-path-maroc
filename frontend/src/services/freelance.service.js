import api from './api';

const buildJobParams = (filters = {}) => {
  const params = {};
  if (filters.search?.trim()) {
    params.search = filters.search.trim();
  }
  if (filters.category) {
    params.category = filters.category;
  }
  if (filters.minBudget !== '' && filters.minBudget != null) {
    params.budget_min = filters.minBudget;
  }
  if (filters.maxBudget !== '' && filters.maxBudget != null) {
    params.budget_max = filters.maxBudget;
  }
  return params;
};

export const freelanceService = {
  getMissions: async (filters = {}) => {
    const params = buildJobParams(filters);
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  submitProposal: async (data) => {
    const response = await api.post('/proposals', data);
    return response.data;
  },

  getMessages: async (conversationId) => {
    const response = await api.get(`/chat/conversations/${conversationId}/messages`);
    return response.data;
  },

  sendMessage: async (conversationId, messageData) => {
    if (messageData.file) {
      const formData = new FormData();
      formData.append('attachment', messageData.file);
      if (messageData.content) {
        formData.append('content', messageData.content);
      }
      const response = await api.post(
        `/chat/conversations/${conversationId}/messages`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data;
    }
    const response = await api.post(
      `/chat/conversations/${conversationId}/messages`,
      messageData
    );
    return response.data;
  },

  getConversations: async () => {
    const response = await api.get('/chat/conversations');
    return response.data;
  },

  searchUsers: async (query) => {
    const response = await api.get('/users', { params: { search: query } });
    return response.data;
  },

  startConversation: async (recipientId) => {
    const response = await api.post('/chat/conversations', { recipient_id: recipientId });
    return response.data;
  },
};
