export const NOTIFICATION_QUEUE = 'notification-queue';

export enum NotificationJobType {
  SEND_SMS = 'SEND_SMS',
  SEND_EMAIL = 'SEND_EMAIL',
  SEND_WHATSAPP = 'SEND_WHATSAPP',
}

export interface NotificationJobPayload {
  subscriptionId: string | null;
  customerId: string;
  channel: 'sms' | 'email' | 'whatsapp';
  templateType: string;
  variables: Record<string, any>;
}
