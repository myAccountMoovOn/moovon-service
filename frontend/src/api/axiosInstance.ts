import axios from 'axios';
import { supabase } from './supabaseClient';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '1',
  },
});

// Request interceptor: attach Supabase token
axiosInstance.interceptors.request.use(async (config) => {
  let token: string | undefined = undefined;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    token = session?.access_token;
  } catch (e) {}

  if (!token) {
    const storedSession = localStorage.getItem('moovon_session');
    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession);
        token = parsed.access_token || parsed.token;
      } catch (e) {}
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor: handle 401 with auto-refresh retry
axiosInstance.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  const originalRequest = error.config;
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      const { data: { session } } = await supabase.auth.refreshSession();
      if (session?.access_token) {
        localStorage.setItem('moovon_session', JSON.stringify(session));
        originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
        return axiosInstance(originalRequest);
      }
    } catch (e) {
      console.warn('Session auto-refresh failed:', e);
    }
  }
  return Promise.reject(error);
});

export default axiosInstance;
