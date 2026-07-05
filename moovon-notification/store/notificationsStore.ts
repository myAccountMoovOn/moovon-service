import { create } from 'zustand';
import { api } from '../api/axios';

export interface NotificationLogItem {
  id: string;
  subscriptionId: string;
  customerId: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  channel: 'email' | 'sms' | 'whatsapp';
  templateType: string;
  status: 'pending' | 'sent' | 'failed';
  errorMessage: string | null;
  sentAt: string | null;
  createdAt: string;
}

interface FetchLogsParams {
  page?: number;
  limit?: number;
  channel?: string;
  status?: string;
  customerId?: string;
}

interface NotificationsState {
  logs: NotificationLogItem[];
  total: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;

  fetchLogs: (params?: FetchLogsParams) => Promise<void>;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  logs: [],
  total: 0,
  page: 1,
  totalPages: 1,
  isLoading: false,
  error: null,

  fetchLogs: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', String(params.page));
      if (params.limit) queryParams.append('limit', String(params.limit));
      if (params.channel) queryParams.append('channel', params.channel);
      if (params.status) queryParams.append('status', params.status);
      if (params.customerId) queryParams.append('customerId', params.customerId);

      const queryString = queryParams.toString();
      const response = await api.get(`/notifications/logs${queryString ? `?${queryString}` : ''}`);
      const payload = response.data?.data ? response.data : { data: response.data, total: response.data.length, page: 1, totalPages: 1 };
      
      set({
        logs: payload.data,
        total: payload.meta?.total || payload.total || 0,
        page: payload.meta?.page || payload.page || 1,
        totalPages: payload.meta?.totalPages || payload.totalPages || 1,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch notification logs', isLoading: false });
    }
  },
}));
