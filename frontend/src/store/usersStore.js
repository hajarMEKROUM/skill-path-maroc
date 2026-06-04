import { create } from 'zustand';
import { usersService } from '../services/users.service';

const useUsersStore = create((set, get) => ({
  users: [],
  selectedUser: null,
  isLoading: false,
  isModifying: false,
  error: null,
  
  // Pagination & Filtering state
  filters: {
    search: '',
    role: '',
    status: '',
    sortBy: 'created_at',
    sortDesc: true,
  },
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 15,
  },
  
  // UI States
  modals: {
    details: false,
    ban: false,
  },

  setFilters: (newFilters) => {
    set((state) => ({ 
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, currentPage: 1 } // reset page when filtering
    }));
    get().fetchUsers();
  },

  setPage: (page) => {
    set((state) => ({ pagination: { ...state.pagination, currentPage: page } }));
    get().fetchUsers();
  },

  openModal: (modalName, user = null) => {
    set((state) => ({ 
      selectedUser: user,
      modals: { ...state.modals, [modalName]: true }
    }));
  },

  closeModal: (modalName) => {
    set((state) => ({ 
      modals: { ...state.modals, [modalName]: false }
    }));
  },

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters, pagination } = get();
      const params = {
        ...filters,
        page: pagination.currentPage,
        per_page: pagination.perPage
      };
      
      const data = await usersService.getUsers(params);
      
      set({ 
        users: data.data || data, 
        isLoading: false,
        pagination: {
          currentPage: data.current_page || 1,
          lastPage: data.last_page || 1,
          total: data.total || (data.data ? data.data.length : data.length),
          perPage: data.per_page || 15
        }
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateUserRole: async (userId, role) => {
    set({ isModifying: true });
    try {
      await usersService.updateRole(userId, role);
      // Optimistic update
      set((state) => ({
        users: state.users.map(u => u.id === userId ? { ...u, role: role } : u),
        isModifying: false
      }));
    } catch (error) {
      set({ error: error.message, isModifying: false });
    }
  },

  banUser: async (userId, reason) => {
    set({ isModifying: true });
    try {
      await usersService.banUser(userId, reason);
      // Optimistic update
      set((state) => ({
        users: state.users.map(u => u.id === userId ? { ...u, status: 'banned' } : u),
        isModifying: false,
        modals: { ...state.modals, ban: false }
      }));
    } catch (error) {
      set({ error: error.message, isModifying: false });
    }
  }
}));

export default useUsersStore;
