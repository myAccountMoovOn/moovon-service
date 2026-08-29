import { create } from 'zustand';
import { api } from '../api/axios';

export interface Company {
  id: string;
  name: string;
  code: string;
  appName?: string | null;
  tagline?: string | null;
  logo: string | null;
  primaryColor?: string | null;
  accentColor?: string | null;
  favicon?: string | null;
  appIconUrl?: string | null;
  customDomain: string | null;
  smtpHost?: string | null;
  smtpPort?: string | null;
  smtpUser?: string | null;
  smtpPass?: string | null;
  smtpFromName?: string | null;
  smtpFromEmail?: string | null;
  emailHeaderLogo?: string | null;
  supportEmail?: string | null;
  supportPhone?: string | null;
  privacyPolicyUrl?: string | null;
  termsUrl?: string | null;
  footerText?: string | null;
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
