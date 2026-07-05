import { create } from 'zustand';
import { api } from '../api/axios';
import { CustomerItem } from './customersStore';
import { ServiceItem } from './servicesStore';

export interface SubscriptionItem {
  id: string;
  companyId?: string;
  customerId: string;
  customer?: CustomerItem;
  serviceId?: string;
  service?: ServiceItem;
  packageId?: string;
  startDate: string;
  endDate: string | null;
  amount: number;
  paymentStatus: 'paid' | 'pending' | 'partial';
  autoRenewal: boolean;
  notes: string | null;
  couponId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface FetchSubscriptionsParams {
  page?: number;
  limit?: number;
  status?: 'active' | 'expired' | 'upcoming';
  customerId?: string;
  serviceId?: string;
  search?: string;
  paymentStatus?: 'paid' | 'pending' | 'partial';
  from?: string;
  to?: string;
}

interface SubscriptionsState {
  subscriptions: SubscriptionItem[];
  total: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;

  fetchSubscriptions: (params?: FetchSubscriptionsParams) => Promise<void>;
  createSubscription: (data: Partial<SubscriptionItem>) => Promise<void>;
  updateSubscription: (id: string, data: Partial<SubscriptionItem>) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
  notifySubscription: (id: string, channels: string[]) => Promise<void>;
}

export const useSubscriptionsStore = create<SubscriptionsState>((set, get) => ({
  subscriptions: [],
  total: 0,
  page: 1,
  totalPages: 1,
  isLoading: false,
  error: null,

  fetchSubscriptions: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', String(params.page));
      if (params.limit) queryParams.append('limit', String(params.limit));
      if (params.status) queryParams.append('status', params.status);
      if (params.search) queryParams.append('search', params.search);
      if (params.customerId) queryParams.append('customerId', params.customerId);
      if (params.serviceId) queryParams.append('serviceId', params.serviceId);
      if (params.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus);
      if (params.from) queryParams.append('from', params.from);
      if (params.to) queryParams.append('to', params.to);

      const queryString = queryParams.toString();
      const response = await api.get(`/subscriptions${queryString ? `?${queryString}` : ''}`);
      const payload = response.data?.data ? response.data : { data: response.data, total: response.data.length, page: 1, totalPages: 1 };
      
      set({
        subscriptions: payload.data,
        total: payload.total || 0,
        page: payload.page || 1,
        totalPages: payload.totalPages || 1,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch subscriptions', isLoading: false });
    }
  },

  createSubscription: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/subscriptions', data);
      await get().fetchSubscriptions();
    } catch (error: any) {
      set({ error: error.message || 'Failed to create subscription', isLoading: false });
      throw error;
    }
  },

  updateSubscription: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await api.patch(`/subscriptions/${id}`, data);
      await get().fetchSubscriptions();
    } catch (error: any) {
      set({ error: error.message || 'Failed to update subscription', isLoading: false });
      throw error;
    }
  },

  deleteSubscription: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/subscriptions/${id}`);
      await get().fetchSubscriptions();
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete subscription', isLoading: false });
      throw error;
    }
  },

  notifySubscription: async (id, channels) => {
    set({ isLoading: true, error: null });
    try {
      await api.post(`/subscriptions/${id}/notify`, { channels });
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to send notification', isLoading: false });
      throw error;
    }
  }
}));
