import axios from "axios";

const apiOrigin = (
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"
).replace(/\/api\/v1\/?$/, "");

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

export const getCsrf = () => {
  return axios.get(`${apiOrigin}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
};

// Request interceptor — attaches Bearer token if one is stored (token-auth fallback)
api.interceptors.request.use(async (config) => {
  if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
    try {
      await getCsrf();
    } catch (e) {
      // Ignorer si ça échoue, pour laisser la requête continuer
    }
  }
  const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handles 401 gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? "";
    const is401 = error.response?.status === 401;
    // /me is checked on every page load — a 401 here just means "not logged in", not an error
    const isMeCheck = url.endsWith("/me");
    const wasAuthenticated = localStorage.getItem("authed") === "1";
    const isPublicPage = [
      "/login",
      "/register",
      "/courses",
      "/jobs",
      "/community",
      "/",
    ].includes(window.location.pathname);

    if (is401) {
      localStorage.removeItem("token");
      // Only redirect if user was previously authenticated and this is NOT the initial auth check
      if (wasAuthenticated && !isMeCheck && !isPublicPage) {
        localStorage.removeItem("authed");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

