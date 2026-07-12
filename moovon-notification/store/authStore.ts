import { create } from 'zustand';
import { api } from '../api/axios';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  session: any | null;
  isLoading: boolean;
  error: string | null;

  login: (data: any) => Promise<void>;
  requestOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, token: string) => Promise<void>;
  registerProviderStep1: (data: any) => Promise<any>;
  registerCustomerStep1: (data: any) => Promise<any>;
  registerResellerStep1: (data: any) => Promise<any>;
  verifySignup: (email: string, token: string) => Promise<void>;
  clearError: () => void;
  logout: () => void;
}

import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ... 

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isLoading: false,
      error: null,

      login: async (data: any) => {
        set({ isLoading: true, error: null });
        try {
          await api.post('/auth/login', data);
          set({ isLoading: false });
        } catch (error: any) {
          const msg = error?.message || error?.error || 'Login failed. Please check your credentials.';
          set({ error: msg, isLoading: false });
          throw error;
        }
      },

      requestOtp: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          await api.post('/auth/request-otp', { email });
          set({ isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to send OTP. Please try again.', 
            isLoading: false 
          });
          throw error;
        }
      },

      verifyOtp: async (email: string, token: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/verify-otp', { email, token });
          set({ 
            user: response.data.data.user, 
            session: response.data.data.session,
            isLoading: false 
          });
        } catch (error: any) {
          const msg = error?.message || error?.error || 'Invalid or expired OTP.';
          set({ error: msg, isLoading: false });
          throw error;
        }
      },

      registerProviderStep1: async (data: any) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/register-provider-step1', data);
          set({ isLoading: false });
          return response.data.data;
        } catch (error: any) {
          set({ 
            error: error.message || 'Registration failed.', 
            isLoading: false 
          });
          throw error;
        }
      },

      registerCustomerStep1: async (data: any) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/register-customer-step1', data);
          set({ isLoading: false });
          return response.data.data;
        } catch (error: any) {
          set({ 
            error: error.message || 'Registration failed. Please check the company code.', 
            isLoading: false 
          });
          throw error;
        }
      },

      registerResellerStep1: async (data: any) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/register-reseller-step1', data);
          set({ isLoading: false });
          return response.data.data;
        } catch (error: any) {
          set({ 
            error: error.message || 'Registration failed.', 
            isLoading: false 
          });
          throw error;
        }
      },

      verifySignup: async (email: string, token: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/register-verify', { email, token });
          set({ 
            user: response.data.data.user, 
            session: response.data.data.session,
            isLoading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.message || 'Invalid or expired OTP.', 
            isLoading: false 
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
      
      logout: () => {
        set({ user: null, session: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Never persist loading/error states — they should always reset on app open
      partialize: (state) => ({ user: state.user, session: state.session }),
    }
  )
);
