// Shared types for Moovon Platform

export const UserRole = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];

export const PricingType = {
  FIXED: 'fixed',
  CUSTOM: 'custom',
} as const;
export type PricingType = typeof PricingType[keyof typeof PricingType];

export const DurationType = {
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly',
  CUSTOM: 'custom',
} as const;
export type DurationType = typeof DurationType[keyof typeof DurationType];

export const DiscountType = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
} as const;
export type DiscountType = typeof DiscountType[keyof typeof DiscountType];

export const PaymentStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  PARTIAL: 'partial',
  OVERDUE: 'overdue',
} as const;
export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

export const PaymentRecordStatus = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
} as const;
export type PaymentRecordStatus = typeof PaymentRecordStatus[keyof typeof PaymentRecordStatus];

export const NotificationChannel = {
  EMAIL: 'email',
  SMS: 'sms',
  WHATSAPP: 'whatsapp',
} as const;
export type NotificationChannel = typeof NotificationChannel[keyof typeof NotificationChannel];

export const NotificationStatus = {
  PENDING: 'pending',
  SENT: 'sent',
  FAILED: 'failed',
} as const;
export type NotificationStatus = typeof NotificationStatus[keyof typeof NotificationStatus];

export const NotificationTemplateType = {
  RENEWAL_REMINDER: 'renewal_reminder',
  PAYMENT_REMINDER: 'payment_reminder',
  EXPIRY_ALERT: 'expiry_alert',
  FOLLOW_UP: 'follow_up',
  WELCOME: 'welcome',
} as const;
export type NotificationTemplateType = typeof NotificationTemplateType[keyof typeof NotificationTemplateType];

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Customer {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  address?: string;
  gstNumber?: string;
  notes?: string;
  isActive: boolean;
  notificationEmail?: boolean;
  notificationSms?: boolean;
  notificationWhatsapp?: boolean;
  createdAt: string;
  subscriptionsCount?: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Package {
  id: string;
  services?: Service[];
  name: string;
  durationMonths: number;
  actualPrice: number;
  offerPrice: number;
  isActive: boolean;
  createdAt: string;
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

export interface Service {
  id: string;
  name: string;
  category?: string;
  categoryId?: string;
  categoryRef?: Category;
  pricingType: PricingType;
  durationType: DurationType;
  basePrice: number;
  isActive: boolean;
  createdAt: string;
}

export interface Subscription {
  id: string;
  customerId: string;
  customer?: Customer;
  serviceId: string;
  service?: Service;
  packageId?: string;
  package?: Package;
  startDate: string;
  endDate: string;
  amount: number;
  paymentStatus: PaymentStatus;
  autoRenewal: boolean;
  notes?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  subscriptionId: string;
  subscription?: Subscription;
  amount: number;
  paymentLinkId?: string;
  paymentLinkUrl?: string;
  status: PaymentRecordStatus;
  transactionId?: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  paidAt?: string;
  createdAt: string;
}

export interface NotificationLog {
  id: string;
  subscriptionId?: string;
  customerId: string;
  customer?: Customer;
  channel: NotificationChannel;
  templateType: NotificationTemplateType;
  status: NotificationStatus;
  errorMessage?: string;
  metadata?: any;
  createdAt: string;
}

export interface Template {
  id: string;
  name: string;
  type: NotificationTemplateType;
  channel: NotificationChannel;
  subject?: string;
  body: string;
  isActive: boolean;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
