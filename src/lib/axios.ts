import axios from "axios";
import { API_BASE_URL, ADMIN_TOKEN_KEY } from "./utils/constants";
import { logError } from "./utils/errorHandler";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the admin bearer token (if present) to every outgoing request.
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem(ADMIN_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Centralized response handling: log the raw error once here, and force a
// clean logout if an authenticated admin request comes back unauthorized.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    logError("apiClient", error);

    if (
      typeof window !== "undefined" &&
      axios.isAxiosError(error) &&
      error.response?.status === 401
    ) {
      const path = window.location.pathname;
      const isAdminRoute = path.startsWith("/admin");
      const isLoginRoute = path.startsWith("/admin/login");
      if (isAdminRoute && !isLoginRoute) {
        window.localStorage.removeItem(ADMIN_TOKEN_KEY);
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);
