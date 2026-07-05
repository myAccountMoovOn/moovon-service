import { create } from 'zustand';
import { api } from '../api/axios';

export interface ServiceItem {
  id: string;
  name: string;
  category?: string;
  pricingType: 'fixed' | 'custom';
  durationType: 'monthly' | 'quarterly' | 'yearly' | 'custom';
  basePrice: number;
  isActive: boolean;
  createdAt: string;
}

interface ServicesState {
  services: ServiceItem[];
  isLoading: boolean;
  error: string | null;

  fetchServices: () => Promise<void>;
  createService: (data: Partial<ServiceItem>) => Promise<void>;
  updateService: (id: string, data: Partial<ServiceItem>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
}

export const useServicesStore = create<ServicesState>((set, get) => ({
  services: [],
  isLoading: false,
  error: null,

  fetchServices: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/services?limit=100'); // Get up to 100 services for now
      const servicesArray = response.data?.data?.data || response.data?.data || [];
      set({ services: Array.isArray(servicesArray) ? servicesArray : [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch services', isLoading: false });
      console.error('Failed to fetch services:', error);
    }
  },

  createService: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/services', data);
      await get().fetchServices(); // Refresh list
    } catch (error: any) {
      set({ error: error.message || 'Failed to create service', isLoading: false });
      console.error('Failed to create service:', error);
      throw error;
    }
  },

  updateService: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await api.patch(`/services/${id}`, data);
      await get().fetchServices(); // Refresh list
    } catch (error: any) {
      set({ error: error.message || 'Failed to update service', isLoading: false });
      console.error('Failed to update service:', error);
      throw error;
    }
  },

  deleteService: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/services/${id}`);
      await get().fetchServices(); // Refresh list
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete service', isLoading: false });
      console.error('Failed to delete service:', error);
      throw error;
    }
  },
}));
