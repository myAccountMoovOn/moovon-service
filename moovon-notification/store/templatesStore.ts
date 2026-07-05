import { create } from 'zustand';
import { api } from '../api/axios';

export interface TemplateItem {
  id: string;
  name: string;
  type: string;
  channel: 'email' | 'sms' | 'whatsapp';
  subject: string | null;
  body: string;
  isActive: boolean;
  createdAt: string;
}

interface CreateTemplatePayload {
  name: string;
  type: string;
  channel: string;
  subject?: string;
  body: string;
  isActive?: boolean;
}

interface TemplatesState {
  templates: TemplateItem[];
  isLoading: boolean;
  error: string | null;

  fetchTemplates: () => Promise<void>;
  createTemplate: (payload: CreateTemplatePayload) => Promise<boolean>;
  updateTemplate: (id: string, payload: Partial<CreateTemplatePayload>) => Promise<boolean>;
  deleteTemplate: (id: string) => Promise<boolean>;
}

export const useTemplatesStore = create<TemplatesState>((set, get) => ({
  templates: [],
  isLoading: false,
  error: null,

  fetchTemplates: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/templates');
      set({ templates: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch templates', isLoading: false });
    }
  },

  createTemplate: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/templates', payload);
      await get().fetchTemplates();
      return true;
    } catch (error: any) {
      set({ error: error.message || 'Failed to create template', isLoading: false });
      return false;
    }
  },

  updateTemplate: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      await api.patch(`/templates/${id}`, payload);
      await get().fetchTemplates();
      return true;
    } catch (error: any) {
      set({ error: error.message || 'Failed to update template', isLoading: false });
      return false;
    }
  },

  deleteTemplate: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/templates/${id}`);
      await get().fetchTemplates();
      return true;
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete template', isLoading: false });
      return false;
    }
  }
}));
