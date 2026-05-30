import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api, { setupCSRF } from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          await setupCSRF();
          const response = await api.post('/login', credentials);
          const { user, access_token } = response.data;
          
          localStorage.setItem('access_token', access_token);
          set({ user, token: access_token, isAuthenticated: true, isLoading: false });
          return user;
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Login failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          await setupCSRF();
          const response = await api.post('/register', userData);
          const { user, access_token } = response.data;
          
          localStorage.setItem('access_token', access_token);
          set({ user, token: access_token, isAuthenticated: true, isLoading: false });
          return user;
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Registration failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await api.post('/logout');
        } catch (error) {
          console.error('Logout error', error);
        } finally {
          localStorage.removeItem('access_token');
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        set({ isLoading: true });
        try {
          const response = await api.get('/me');
          set({ user: response.data, isAuthenticated: true, isLoading: false });
        } catch (error) {
          localStorage.removeItem('access_token');
          set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);

export default useAuthStore;
