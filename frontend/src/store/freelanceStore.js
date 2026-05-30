import { create } from 'zustand';
import { freelanceService } from '../services/freelance.service';

const useFreelanceStore = create((set, get) => ({
  missions: [],
  isLoadingMissions: false,
  errorMissions: null,
  
  // Proposal State
  isSubmittingProposal: false,
  proposalModalOpen: false,
  selectedMissionId: null,

  // Chat State
  conversations: [],
  activeConversationId: null,
  messages: [],
  isLoadingChat: false,
  isSendingMessage: false,

  // Filters State
  filters: {
    search: '',
    category: '',
    minBudget: '',
    maxBudget: '',
  },

  setFilters: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }));
    get().fetchMissions();
  },

  fetchMissions: async () => {
    set({ isLoadingMissions: true, errorMissions: null });
    try {
      const { filters } = get();
      const data = await freelanceService.getMissions(filters);
      set({ 
        missions: data.data || data, 
        isLoadingMissions: false 
      });
    } catch (error) {
      set({ errorMissions: error.message, isLoadingMissions: false });
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
      await freelanceService.submitProposal(selectedMissionId, rawData);
      set({ isSubmittingProposal: false, proposalModalOpen: false, selectedMissionId: null });
      // Could also add a success toast here
    } catch (error) {
      set({ isSubmittingProposal: false });
      throw error;
    }
  },

  fetchConversations: async () => {
    set({ isLoadingChat: true });
    try {
      const data = await freelanceService.getConversations();
      set({ conversations: data.data || data, isLoadingChat: false });
    } catch (error) {
      set({ isLoadingChat: false });
      console.error('Failed to load conversations', error);
    }
  },

  setActiveConversation: async (conversationId) => {
    set({ activeConversationId: conversationId, isLoadingChat: true });
    try {
      const data = await freelanceService.getMessages(conversationId);
      set({ messages: data.data || data, isLoadingChat: false });
    } catch (error) {
      set({ isLoadingChat: false });
      console.error('Failed to load messages', error);
    }
  },

  sendMessage: async (msgData) => {
    const { activeConversationId, messages } = get();
    if (!activeConversationId) return;

    // Optimistic UI update
    const tempId = Date.now();
    const optimisticMessage = {
      id: tempId,
      conversation_id: activeConversationId,
      content: msgData.content,
      sender_id: 'me', // handled by auth normally
      created_at: new Date().toISOString(),
      isPending: true
    };

    set({ messages: [...messages, optimisticMessage], isSendingMessage: true });

    try {
      const confirmedMsg = await freelanceService.sendMessage(activeConversationId, msgData);
      set((state) => ({
        messages: state.messages.map(m => m.id === tempId ? confirmedMsg : m),
        isSendingMessage: false
      }));
    } catch (error) {
      // Revert optimistic update on failure
      set((state) => ({
        messages: state.messages.filter(m => m.id !== tempId),
        isSendingMessage: false
      }));
      throw error;
    }
  }
}));

export default useFreelanceStore;
