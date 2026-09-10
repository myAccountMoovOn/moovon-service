import axios from 'axios';
import { getStorageKey } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '1',
  },
});

let csrfToken: string | null = null;

// Request interceptor: fetch and attach CSRF token for mutations
axiosInstance.interceptors.request.use(async (config) => {
  const method = config.method?.toUpperCase();
  if (method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    if (!csrfToken) {
      try {
        const res = await axios.get(`${API_BASE}/auth/csrf-token`, { withCredentials: true });
        csrfToken = res.data.csrfToken;
      } catch (e) {
        console.warn('Failed to fetch CSRF token:', e);
      }
    }
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
      config.headers['CSRF-Token'] = csrfToken;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor: handle 401
axiosInstance.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  const originalRequest = error.config;
  // Prevent infinite loops by not retrying if the request was to /auth/refresh itself
  if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
    originalRequest._retry = true;
    
    try {
      // Auto-refresh the session using the HttpOnly refresh_token cookie
      await axios.post(`${API_BASE}/auth/refresh`, {}, { withCredentials: true });
      
      // If successful, the new access_token cookie is automatically set by the backend.
      // Retry the original request
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // If refresh fails (e.g., refresh_token expired), session is dead.
      // Clear localStorage state and kick to login.
      localStorage.removeItem(getStorageKey('user'));
      localStorage.removeItem(getStorageKey('role'));
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
});

export default axiosInstance;
