import { create } from 'zustand';
import { api } from '../api/axios';

interface Branding {
  id: string;
  name: string;
  logo: string | null;
  primaryColor: string | null;
  accentColor: string | null;
  fontFamily: string | null;
  favicon: string | null;
  appName: string | null;
  tagline: string | null;
  appIconUrl: string | null;
}

interface BrandingState {
  branding: Branding | null;
  isLoadingBranding: boolean;
  error: string | null;
  fetchBranding: () => Promise<void>;
  clearBranding: () => void;
}

export const useBrandingStore = create<BrandingState>((set) => ({
  branding: null,
  isLoadingBranding: false,
  error: null,

  fetchBranding: async () => {
    set({ isLoadingBranding: true, error: null });
    try {
      const response = await api.get('/companies/me');
      const company = response.data?.data ?? response.data;
      if (company) {
        set({ branding: company, isLoadingBranding: false });
      } else {
        set({ branding: null, isLoadingBranding: false });
      }
    } catch (error: any) {
      console.log('Failed to fetch branding:', error.message);
      set({ branding: null, isLoadingBranding: false, error: error.message });
    }
  },

  clearBranding: () => set({ branding: null, error: null }),
}));
