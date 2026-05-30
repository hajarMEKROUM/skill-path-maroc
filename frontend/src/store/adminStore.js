import { create } from 'zustand';
import { adminService } from '../services/admin.service';

const useAdminStore = create((set) => ({
  stats: null,
  recentActivity: [],
  isLoading: false,
  error: null,

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await adminService.getStats();
      set({ 
        stats: data.stats || data, 
        recentActivity: data.recent_activity || [],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to load admin stats', 
        isLoading: false 
      });
    }
  }
}));

export default useAdminStore;
