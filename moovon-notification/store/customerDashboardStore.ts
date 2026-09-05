import { create } from 'zustand';
import { api } from '../api/axios';

interface CustomerDashboardState {
  subscriptions: any[];
  isLoading: boolean;
  error: string | null;
  fetchCustomerData: () => Promise<void>;
}

export const useCustomerDashboardStore = create<CustomerDashboardState>((set) => ({
  subscriptions: [],
  isLoading: false,
  error: null,

  fetchCustomerData: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/subscriptions/my-subscriptions');
      const data = res.data?.data ?? res.data;
      set({ subscriptions: data || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch dashboard data', isLoading: false });
    }
  },
}));
