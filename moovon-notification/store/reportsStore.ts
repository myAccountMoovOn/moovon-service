import { create } from 'zustand';
import { api } from '../api/axios';

interface RevenueData {
  totalRevenue: number;
  payments: any[];
}

interface ReportsState {
  revenueData: RevenueData | null;
  renewalsData: any[];
  isLoading: boolean;
  error: string | null;

  fetchRevenue: (from?: string, to?: string) => Promise<void>;
  fetchRenewals: (from?: string, to?: string) => Promise<void>;
}

export const useReportsStore = create<ReportsState>((set) => ({
  revenueData: null,
  renewalsData: [],
  isLoading: false,
  error: null,

  fetchRevenue: async (from, to) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (from) params.append('from', from);
      if (to) params.append('to', to);
      
      const response = await api.get(`/reports/revenue?${params.toString()}`);
      set({ revenueData: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch revenue report', isLoading: false });
    }
  },

  fetchRenewals: async (from, to) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (from) params.append('from', from);
      if (to) params.append('to', to);

      const response = await api.get(`/reports/renewals?${params.toString()}`);
      set({ renewalsData: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch renewals report', isLoading: false });
    }
  }
}));
