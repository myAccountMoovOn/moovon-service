import { create } from 'zustand';
import { api } from '../api/axios';

export interface DashboardMetrics {
  totalCustomers: number;
  newCustomers: number;
  totalRevenue: number;
  newRevenue: number;
  expectedRevenue: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  upcomingRenewals: number;
}

interface DashboardState {
  metrics: DashboardMetrics | null;
  period: 'today' | 'week' | 'month' | 'all' | 'custom';
  customFrom: string | null;
  customTo: string | null;
  
  // Drill-down State
  activeMetric: string | null;
  searchQuery: string;
  drillDownData: any[];
  isDrillDownLoading: boolean;

  isLoading: boolean;
  error: string | null;

  setPeriod: (period: 'today' | 'week' | 'month' | 'all' | 'custom') => void;
  setCustomDates: (from: string | null, to: string | null) => void;
  setActiveMetric: (metric: string | null) => void;
  setSearchQuery: (query: string) => void;
  fetchDashboardMetrics: () => Promise<void>;
  fetchDrillDownData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  metrics: null,
  period: 'month',
  customFrom: null,
  customTo: null,
  
  activeMetric: null,
  searchQuery: '',
  drillDownData: [],
  isDrillDownLoading: false,

  isLoading: false,
  error: null,

  setPeriod: (period) => {
    set({ period });
    if (period !== 'custom') {
      get().fetchDashboardMetrics();
      if (get().activeMetric) get().fetchDrillDownData();
    }
  },

  setCustomDates: (from, to) => {
    set({ customFrom: from, customTo: to });
    get().fetchDashboardMetrics();
    if (get().activeMetric) get().fetchDrillDownData();
  },

  setActiveMetric: (metric) => {
    set({ activeMetric: metric, drillDownData: [] });
    if (metric) get().fetchDrillDownData();
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    if (get().activeMetric) get().fetchDrillDownData();
  },

  fetchDashboardMetrics: async () => {
    // Only fetch if not already loading to avoid spam
    if (get().isLoading) return;
    
    set({ isLoading: true, error: null });
    try {
      const period = get().period;
      let from: string | undefined;
      let to: string | undefined;
      
      const now = new Date();
      
      if (period === 'today') {
        from = new Date(now.setHours(0, 0, 0, 0)).toISOString();
        to = new Date(now.setHours(23, 59, 59, 999)).toISOString();
      } else if (period === 'week') {
        const firstDay = new Date(now.setDate(now.getDate() - now.getDay()));
        firstDay.setHours(0, 0, 0, 0);
        const lastDay = new Date(firstDay);
        lastDay.setDate(lastDay.getDate() + 6);
        lastDay.setHours(23, 59, 59, 999);
        from = firstDay.toISOString();
        to = lastDay.toISOString();
      } else if (period === 'month') {
        from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();
      } else if (period === 'custom') {
        const { customFrom, customTo } = get();
        if (customFrom) {
          const f = new Date(customFrom);
          f.setHours(0, 0, 0, 0);
          from = f.toISOString();
        }
        if (customTo) {
          const t = new Date(customTo);
          t.setHours(23, 59, 59, 999);
          to = t.toISOString();
        }
      }

      const params = new URLSearchParams();
      if (from) params.append('from', from);
      if (to) params.append('to', to);

      const url = `/reports/dashboard${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await api.get(url);
      set({ metrics: response.data.data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to load dashboard metrics.', 
        isLoading: false 
      });
      console.error('Failed to fetch dashboard metrics:', error);
    }
  },

  fetchDrillDownData: async () => {
    set({ isDrillDownLoading: true, error: null });
    try {
      const { activeMetric, period, searchQuery } = get();
      if (!activeMetric) return;

      let from: string | undefined;
      let to: string | undefined;
      const now = new Date();
      
      if (period === 'today') {
        from = new Date(now.setHours(0, 0, 0, 0)).toISOString();
        to = new Date(now.setHours(23, 59, 59, 999)).toISOString();
      } else if (period === 'week') {
        const firstDay = new Date(now.setDate(now.getDate() - now.getDay()));
        firstDay.setHours(0, 0, 0, 0);
        const lastDay = new Date(firstDay);
        lastDay.setDate(lastDay.getDate() + 6);
        lastDay.setHours(23, 59, 59, 999);
        from = firstDay.toISOString();
        to = lastDay.toISOString();
      } else if (period === 'month') {
        from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();
      } else if (period === 'custom') {
        const { customFrom, customTo } = get();
        if (customFrom) {
          const f = new Date(customFrom);
          f.setHours(0, 0, 0, 0);
          from = f.toISOString();
        }
        if (customTo) {
          const t = new Date(customTo);
          t.setHours(23, 59, 59, 999);
          to = t.toISOString();
        }
      }

      const params = new URLSearchParams();
      params.append('limit', '10');
      params.append('page', '1');
      if (searchQuery) params.append('search', searchQuery);

      let endpoint = '';

      switch (activeMetric) {
        case 'customers':
          params.append('hasSubscriptions', 'true');
          endpoint = '/customers';
          break;
        case 'new_customers':
          if (from) params.append('from', from);
          if (to) params.append('to', to);
          endpoint = '/customers';
          break;
        case 'active':
          params.append('status', 'active');
          endpoint = '/subscriptions';
          break;
        case 'expired':
          params.append('status', 'expired');
          endpoint = '/subscriptions';
          break;
        case 'upcoming':
          params.append('status', 'upcoming');
          endpoint = '/subscriptions';
          break;
        case 'expected':
          params.append('paymentStatus', 'pending');
          endpoint = '/subscriptions';
          break;
        case 'revenue':
          endpoint = '/payments';
          break;
        case 'new_revenue':
          if (from) params.append('from', from);
          if (to) params.append('to', to);
          endpoint = '/payments';
          break;
      }

      if (!endpoint) return;

      const url = `${endpoint}?${params.toString()}`;
      const response = await api.get(url);
      set({ drillDownData: response.data.data.data || [], isDrillDownLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to load details.', 
        isDrillDownLoading: false 
      });
      console.error('Failed to fetch drill down data:', error);
    }
  },
}));
