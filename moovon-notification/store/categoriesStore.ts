import { create } from 'zustand';
import { api } from '../api/axios';

export interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  createCategory: (data: Partial<Category>) => Promise<void>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/categories');
      set({ categories: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch categories', isLoading: false });
    }
  },

  createCategory: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/categories', data);
      await get().fetchCategories();
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to create category', isLoading: false });
      throw error;
    }
  },

  updateCategory: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await api.patch(`/categories/${id}`, data);
      await get().fetchCategories();
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update category', isLoading: false });
      throw error;
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/categories/${id}`);
      await get().fetchCategories();
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete category', isLoading: false });
      throw error;
    }
  }
}));
