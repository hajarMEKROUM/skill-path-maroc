import { create } from 'zustand';
import { freelanceService } from '../services/freelance.service';
import useAuthStore from './authStore';

const useFreelanceStore = create((set, get) => ({
  missions: [],
  isLoadingMissions: false,
  errorMissions: null,

  isSubmittingProposal: false,
  proposalModalOpen: false,
  selectedMissionId: null,

  conversations: [],
  activeConversationId: null,
  messages: [],
  isLoadingChat: false,
  isSendingMessage: false,

  filters: {
    search: '',
    category: '',
    minBudget: '',
    maxBudget: '',
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().fetchMissions();
  },

  fetchMissions: async () => {
    set({ isLoadingMissions: true, errorMissions: null });
    try {
      const { filters } = get();
      const data = await freelanceService.getMissions(filters);
      const raw = data.data ?? data;
      const missions = Array.isArray(raw) ? raw : [];
      set({
        missions,
        isLoadingMissions: false,
      });
    } catch (error) {
      set({
        errorMissions: error.response?.data?.message || error.message,
        isLoadingMissions: false,
        missions: [],
      });
    }
  },

  openProposalModal: (missionId) => {
    set({ proposalModalOpen: true, selectedMissionId: missionId });
  },

  closeProposalModal: () => {
    set({ proposalModalOpen: false, selectedMissionId: null });
  },

  submitProposal: async (rawData) => {
    const { selectedMissionId } = get();
    if (!selectedMissionId) return;

    set({ isSubmittingProposal: true });
    try {
      const data = await freelanceService.submitProposal({
        mission_id: selectedMissionId,
        ...rawData,
      });
      set({ isSubmittingProposal: false, proposalModalOpen: false, selectedMissionId: null });
      return data;
    } catch (error) {
      set({ isSubmittingProposal: false });
      throw error;
    }
  },

  fetchConversations: async () => {
    set({ isLoadingChat: true });
    try {
      const data = await freelanceService.getConversations();
      const raw = data.data ?? data;
      set({
        conversations: Array.isArray(raw) ? raw : [],
        isLoadingChat: false,
      });
    } catch (error) {
      set({ isLoadingChat: false });
      console.error('Failed to load conversations', error);
    }
  },

  setActiveConversation: async (conversationId) => {
    set({ activeConversationId: conversationId, isLoadingChat: true });
    try {
      const data = await freelanceService.getMessages(conversationId);
      const raw = data.data ?? data;
      set({
        messages: Array.isArray(raw) ? raw : [],
        isLoadingChat: false,
      });
    } catch (error) {
      set({ isLoadingChat: false });
      console.error('Failed to load messages', error);
    }
  },

  sendMessage: async (msgData) => {
    const { activeConversationId, messages } = get();
    if (!activeConversationId) return;

    const tempId = Date.now();
    const currentUserId = useAuthStore.getState().user?.id || 'me';
    const optimisticMessage = {
      id: tempId,
      conversation_id: activeConversationId,
      content: msgData.content,
      sender_id: currentUserId,
      created_at: new Date().toISOString(),
      isPending: true,
    };

    set({ messages: [...messages, optimisticMessage], isSendingMessage: true });

    try {
      const response = await freelanceService.sendMessage(activeConversationId, msgData);
      const confirmedMsg = response.data ?? response;
      set((state) => ({
        messages: state.messages.map((m) => (m.id === tempId ? confirmedMsg : m)),
        isSendingMessage: false,
      }));
    } catch (error) {
      set((state) => ({
        messages: state.messages.filter((m) => m.id !== tempId),
        isSendingMessage: false,
      }));
      throw error;
    }
  },
}));

export default useFreelanceStore;
