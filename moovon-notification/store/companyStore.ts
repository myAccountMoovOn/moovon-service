import { create } from 'zustand';
import { api } from '../api/axios';

export interface Company {
  id: string;
  name: string;
  code: string;
  logo: string | null;
  customDomain: string | null;
  createdAt: string;
}

interface CompanyState {
  company: Company | null;
  isLoading: boolean;
  error: string | null;
  fetchMyCompany: () => Promise<void>;
  updateMyCompany: (data: Partial<Company>) => Promise<void>;
}

export const useCompanyStore = create<CompanyState>((set) => ({
  company: null,
  isLoading: false,
  error: null,

  fetchMyCompany: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/companies/me');
      set({ company: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch company', isLoading: false });
    }
  },

  updateMyCompany: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch('/companies/me', data);
      set({ company: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update company', isLoading: false });
      throw error;
    }
  }
}));
