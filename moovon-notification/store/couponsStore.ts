import { create } from 'zustand';
import { api } from '../api/axios';

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

export interface Coupon {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  expiryDate: string | null;
  isActive: boolean;
  minPurchaseAmount: number;
  createdAt: string;
}

interface CouponsState {
  coupons: Coupon[];
  isLoading: boolean;
  error: string | null;
  fetchCoupons: () => Promise<void>;
  createCoupon: (data: Partial<Coupon>) => Promise<void>;
  updateCoupon: (id: string, data: Partial<Coupon>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
}

export const useCouponsStore = create<CouponsState>((set, get) => ({
  coupons: [],
  isLoading: false,
  error: null,

  fetchCoupons: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/coupons');
      set({ coupons: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch coupons', isLoading: false });
    }
  },

  createCoupon: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/coupons', data);
      await get().fetchCoupons();
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to create coupon', isLoading: false });
      throw error;
    }
  },

  updateCoupon: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await api.patch(`/coupons/${id}`, data);
      await get().fetchCoupons();
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update coupon', isLoading: false });
      throw error;
    }
  },

  deleteCoupon: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/coupons/${id}`);
      await get().fetchCoupons();
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete coupon', isLoading: false });
      throw error;
    }
  }
}));
