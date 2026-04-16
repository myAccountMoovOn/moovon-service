import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import type { PaginatedResponse, Category, Package, Customer, Service, Subscription, Payment, NotificationLog, Template, Coupon } from '../types';

// Generic fetcher
const fetcher = async (url: string, params?: any) => {
  const { data } = await axiosInstance.get(url, { params });
  return data.data; // Our backend returns { success, data, message }
};

// Categories
export const useCategories = (params?: { isActive?: boolean }) => {
  return useQuery<Category[]>({
    queryKey: ['categories', params],
    queryFn: () => axiosInstance.get('categories', { params }).then(res => res.data.data),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Category>) => axiosInstance.post('categories', data).then(res => res.data.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) => 
      axiosInstance.patch(`categories/${id}`, data).then(res => res.data.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`categories/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });
};

// Customers
export const useCustomers = (params: { 
  page: number; 
  limit: number; 
  search?: string;
  isActive?: boolean;
  from?: string;
  to?: string;
  hasSubscriptions?: boolean;
}) => {
  return useQuery<PaginatedResponse<Customer>>({
    queryKey: ['customers', params],
    queryFn: () => fetcher('customers', params),
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => axiosInstance.post('customers', data).then(res => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    },
  });
};

export const useCustomer = (id: string | undefined) => {
  return useQuery<Customer>({
    queryKey: ['customers', id],
    queryFn: () => axiosInstance.get(`customers/${id}`).then((res) => res.data.data),
    enabled: !!id,
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) => 
      axiosInstance.patch(`customers/${id}`, data).then(res => res.data.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customers', variables.id] });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`customers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    },
  });
};


// Services
export const useServices = (params: { 
  page: number; 
  limit: number; 
  search?: string;
  isActive?: boolean;
  pricingType?: string;
  durationType?: string;
  category?: string;
  from?: string;
  to?: string;
  categoryId?: string;
}) => {
  return useQuery<PaginatedResponse<Service>>({
    queryKey: ['services', params],
    queryFn: () => fetcher('services', params),
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`services/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['services'] }),
  });
};


// Packages
export const usePackages = (params?: { serviceId?: string }) => {
  return useQuery<Package[]>({
    queryKey: ['packages', params],
    queryFn: () => axiosInstance.get('packages', { params }).then(res => res.data.data),
  });
};

export const useCreatePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => axiosInstance.post('packages', data).then(res => res.data.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['packages'] }),
  });
};

export const useUpdatePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      axiosInstance.patch(`packages/${id}`, data).then(res => res.data.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['packages'] }),
  });
};

export const useDeletePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`packages/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['packages'] }),
  });
};

// Coupons
export const useCoupons = () => {
  return useQuery<Coupon[]>({
    queryKey: ['coupons'],
    queryFn: () => axiosInstance.get('coupons').then(res => res.data.data),
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => axiosInstance.post('coupons', data).then(res => res.data.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coupons'] }),
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      axiosInstance.patch(`coupons/${id}`, data).then(res => res.data.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coupons'] }),
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`coupons/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coupons'] }),
  });
};

export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: (data: { code: string; amount: number }) => 
      axiosInstance.post('coupons/validate', data).then(res => res.data.data),
  });
};


// Subscriptions
export const useSubscriptions = (params: { 
  page: number; 
  limit: number; 
  status?: string; 
  customerId?: string;
  serviceId?: string;
  search?: string;
  paymentStatus?: string;
  from?: string;
  to?: string;
}) => {
  return useQuery<PaginatedResponse<Subscription>>({
    queryKey: ['subscriptions', params],
    queryFn: () => fetcher('subscriptions', params),
  });
};

export const useUpcomingSubscriptions = (days: number = 30) => {
  return useQuery<Subscription[]>({
    queryKey: ['subscriptions', 'upcoming', days],
    queryFn: () => axiosInstance.get('subscriptions/upcoming', { params: { days } }).then(res => res.data.data),
  });
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => axiosInstance.post('subscriptions', data).then(res => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    },
  });
};

export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`subscriptions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    },
  });
};


// Payments
export const useAllPayments = (params?: { page: number; limit: number; search?: string; from?: string; to?: string }) => {
  return useQuery({
    queryKey: ['all-payments', params],
    queryFn: () => fetcher('/payments', params),
  });
};

export const usePaymentHistory = (subscriptionId?: string) => {
  return useQuery<Payment[]>({
    queryKey: ['payments', subscriptionId],
    queryFn: () => fetcher(`payments/${subscriptionId}`),
    enabled: !!subscriptionId,
  });
};

export const useDeletePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`payments/${id}`),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['payments'] });
        queryClient.invalidateQueries({ queryKey: ['reports'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    },
  });
};


// Reports
export const useReports = (type: 'revenue' | 'customers' | 'services' | 'payment-status' | 'renewals', params?: any) => {
  return useQuery({
    queryKey: ['reports', type, params],
    queryFn: () => fetcher(`reports/${type}`, params),
  });
};

export const useRevenue = (from?: string, to?: string) => useReports('revenue', { from, to });
export const useRenewals = (from?: string, to?: string) => useReports('renewals', { from, to });

// Notifications
export const useNotificationLogs = (params: any) => {
  return useQuery<PaginatedResponse<NotificationLog>>({
    queryKey: ['notifications', params],
    queryFn: () => fetcher('notifications/logs', params),
  });
};

// Templates
export const useTemplates = () => {
  return useQuery<Template[]>({
    queryKey: ['templates'],
    queryFn: () => fetcher('templates'),
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`templates/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['templates'] }),
  });
};

export const useDashboardSummary = (params?: { from?: string; to?: string }) => {
  return useQuery({
    queryKey: ['dashboard-summary', params],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/reports/dashboard', { params });
      return data.data; // Backend returns { success, data, message }
    },
  });
};

