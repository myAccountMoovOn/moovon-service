import { create } from 'zustand';
import { api } from '../api/axios';

export interface ServiceRef {
  id: string;
  name: string;
  basePrice: number;
  durationType: string;
}

export interface PackageItem {
  id: string;
  name: string;
  durationMonths: number;
  actualPrice: number;
  offerPrice: number;
  isActive: boolean;
  companyId?: string;
  services?: ServiceRef[];
  createdAt: string;
}

interface PackagesState {
  packages: PackageItem[];
  isLoading: boolean;
  error: string | null;

  fetchPackages: (serviceId?: string) => Promise<void>;
  createPackage: (data: Partial<PackageItem> & { serviceIds: string[] }) => Promise<void>;
  updatePackage: (id: string, data: Partial<PackageItem> & { serviceIds?: string[] }) => Promise<void>;
  deletePackage: (id: string) => Promise<void>;
}

export const usePackagesStore = create<PackagesState>((set, get) => ({
  packages: [],
  isLoading: false,
  error: null,

  fetchPackages: async (serviceId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const url = serviceId ? `/packages?serviceId=${serviceId}` : '/packages';
      const response = await api.get(url);
      const data = response.data?.data || response.data || [];
      set({ packages: Array.isArray(data) ? data : [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch packages', isLoading: false });
    }
  },

  createPackage: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/packages', data);
      await get().fetchPackages();
    } catch (error: any) {
      set({ error: error.message || 'Failed to create package', isLoading: false });
      throw error;
    }
  },

  updatePackage: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await api.patch(`/packages/${id}`, data);
      await get().fetchPackages();
    } catch (error: any) {
      set({ error: error.message || 'Failed to update package', isLoading: false });
      throw error;
    }
  },

  deletePackage: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/packages/${id}`);
      await get().fetchPackages();
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete package', isLoading: false });
      throw error;
    }
  },
}));
