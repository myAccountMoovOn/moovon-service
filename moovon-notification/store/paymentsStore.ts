import { create } from 'zustand';
import { api } from '../api/axios';
import { SubscriptionItem } from './subscriptionsStore';
import * as Linking from 'expo-linking';

export interface PaymentItem {
  id: string;
  subscriptionId: string;
  subscription?: SubscriptionItem;
  amount: number;
  paymentGateway: string;
  transactionId: string | null;
  status: 'pending' | 'success' | 'failed' | 'expired';
  paymentLinkId: string | null;
  paymentLinkUrl: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface FetchPaymentsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  from?: string;
  to?: string;
}

interface PaymentsState {
  payments: PaymentItem[];
  total: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;

  fetchPayments: (params?: FetchPaymentsParams) => Promise<void>;
  markAsPaid: (subscriptionId: string) => Promise<void>;
  fetchInvoice: (paymentId: string) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
}

export const usePaymentsStore = create<PaymentsState>((set, get) => ({
  payments: [],
  total: 0,
  page: 1,
  totalPages: 1,
  isLoading: false,
  error: null,

  fetchPayments: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', String(params.page));
      if (params.limit) queryParams.append('limit', String(params.limit));
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.from) queryParams.append('from', params.from);
      if (params.to) queryParams.append('to', params.to);

      const queryString = queryParams.toString();
      const response = await api.get(`/payments${queryString ? `?${queryString}` : ''}`);
      const payload = response.data?.data ? response.data : { data: response.data, total: response.data.length, page: 1, totalPages: 1 };
      
      set({
        payments: payload.data,
        total: payload.meta?.total || payload.total || 0,
        page: payload.meta?.page || payload.page || 1,
        totalPages: payload.meta?.totalPages || payload.totalPages || 1,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch payments', isLoading: false });
    }
  },

  markAsPaid: async (subscriptionId) => {
    set({ isLoading: true, error: null });
    try {
      await api.post(`/payments/simulate-mock-success/${subscriptionId}`);
      await get().fetchPayments();
    } catch (error: any) {
      set({ error: error.message || 'Failed to mark as paid', isLoading: false });
      throw error;
    }
  },

  fetchInvoice: async (paymentId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get(`/payments/invoice/${paymentId}`);
      if (res.data && res.data.url) {
        Linking.openURL(res.data.url);
      }
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch invoice. Ensure payment is successful.', isLoading: false });
      throw error;
    }
  },

  deletePayment: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/payments/${id}`);
      await get().fetchPayments();
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete payment', isLoading: false });
      throw error;
    }
  }
}));
