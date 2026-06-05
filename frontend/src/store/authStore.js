import { create } from "zustand";
import api, { getCsrf } from "../services/api";
import { normalizeRole } from "../utils/roles";

const withNormalizedRole = (user) =>
  user ? { ...user, role: normalizeRole(user.role) } : user;

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // MUST BE TRUE to prevent premature redirect in ProtectedRoute
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });

    try {
      // ✅ CSRF (via getCsrf helper to ensure domain matches)
      await getCsrf();

      // ✅ LOGIN (API v1)
      const response = await api.post("/login", credentials);

      const user = withNormalizedRole(response.data.user);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      return user;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Login failed",
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });

    try {
      await getCsrf();

      const response = await api.post("/register", userData);

      const user = withNormalizedRole(response.data.user);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      return user;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Registration failed",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post("/logout");
    } finally {
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });

    try {
      const response = await api.get("/me");

      set({
        user: withNormalizedRole(response.data.data ?? response.data.user),
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));

export default useAuthStore;