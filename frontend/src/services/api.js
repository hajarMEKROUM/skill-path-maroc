import axios from "axios";

const apiOrigin = (
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"
).replace(/\/api\/v1\/?$/, "");

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? "";
    const isAuthCheck = url.endsWith("/me");
    const isPublicPage = [
      "/login",
      "/register",
      "/courses",
      "/jobs",
      "/community",
      "/",
    ].includes(window.location.pathname);
    if (error.response?.status === 401 && !isAuthCheck && !isPublicPage) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
