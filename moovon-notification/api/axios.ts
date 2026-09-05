import axios from 'axios';

export const api = axios.create({
  // Use EXPO_PUBLIC_ prefix to access variables in Expo
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 second timeout — prevents infinite spinner while waiting for slow SMTP
});

// Interceptor to inject Authorization token
api.interceptors.request.use(
  (config) => {
    const { useAuthStore } = require('../store/authStore');
    const session = useAuthStore.getState().session;
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Automatically log out if the backend rejects the token
    if (error.response?.status === 401) {
      const { useAuthStore } = require('../store/authStore');
      useAuthStore.getState().logout();
    }
    return Promise.reject(error.response?.data || error);
  }
);
