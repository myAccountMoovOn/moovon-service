import { create } from 'zustand';
import { api } from '../api/axios';

export interface CustomerItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  address?: string;
  gstNumber?: string;
  notes?: string;
  isActive: boolean;
  notificationEmail: boolean;
  notificationSms: boolean;
  notificationWhatsapp: boolean;
  createdAt: string;
  subscriptionsCount?: number;
}

export interface CustomerCreateResult {
  customer: CustomerItem;
  email: string;
  password: string;
}

interface CustomersState {
  customers: CustomerItem[];
  total: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;

  fetchCustomers: (opts?: {
    page?: number;
    search?: string;
    isActive?: boolean | undefined;
    from?: string;
    to?: string;
  }) => Promise<void>;
  createCustomer: (data: Partial<CustomerItem>) => Promise<CustomerCreateResult>;
  updateCustomer: (id: string, data: Partial<CustomerItem>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
}

export const useCustomersStore = create<CustomersState>((set, get) => ({
  customers: [],
  total: 0,
  totalPages: 1,
  isLoading: false,
  error: null,

  fetchCustomers: async (opts = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      params.append('page', String(opts.page || 1));
      params.append('limit', '20');
      if (opts.search) params.append('search', opts.search);
      if (opts.isActive !== undefined) params.append('isActive', String(opts.isActive));
      if (opts.from) params.append('from', opts.from);
      if (opts.to) params.append('to', opts.to);

      const response = await api.get(`/customers?${params.toString()}`);
      const payload = response.data?.data;
      const dataArray = payload?.data || payload || [];
      set({
        customers: Array.isArray(dataArray) ? dataArray : [],
        total: payload?.total || 0,
        totalPages: payload?.totalPages || 1,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch customers', isLoading: false });
    }
  },

  createCustomer: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/customers', data);
      await get().fetchCustomers();
      return response.data?.data as CustomerCreateResult;
    } catch (error: any) {
      set({ error: error.message || 'Failed to create customer', isLoading: false });
      throw error;
    }
  },

  updateCustomer: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await api.patch(`/customers/${id}`, data);
      await get().fetchCustomers();
    } catch (error: any) {
      set({ error: error.message || 'Failed to update customer', isLoading: false });
      throw error;
    }
  },

  deleteCustomer: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/customers/${id}`);
      await get().fetchCustomers();
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete customer', isLoading: false });
      throw error;
    }
  },
}));
