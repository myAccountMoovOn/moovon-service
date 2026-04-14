import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { Customer } from '../../customers/entities/customer.entity';

export enum NotificationChannel {
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
  EMAIL = 'email',
}

export enum NotificationTemplateType {
  RENEWAL_REMINDER = 'renewal_reminder',
  PAYMENT_REMINDER = 'payment_reminder',
  EXPIRY_ALERT = 'expiry_alert',
  WELCOME = 'welcome',
  FOLLOW_UP = 'follow_up',
  PAYMENT_SUCCESS = 'payment_success',
  CUSTOMER_CREDENTIALS = 'customer_credentials',
  LOGIN_OTP = 'login_otp',
  NEW_SUBSCRIPTION = 'new_subscription',
}

export enum NotificationStatus {
  SENT = 'sent',
  FAILED = 'failed',
  PENDING = 'pending',
}

@Entity('notification_logs')
export class NotificationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'subscription_id', type: 'uuid', nullable: true })
  subscriptionId: string | null;

  @ManyToOne(() => Subscription, (sub) => sub.notificationLogs, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subscription_id' })
  subscription?: Subscription;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId: string;

  @ManyToOne(() => Customer, (customer) => customer.notificationLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer?: Customer;

  @Column({ type: 'enum', enum: NotificationChannel })
  channel: NotificationChannel;

  @Column({ name: 'template_type', type: 'enum', enum: NotificationTemplateType })
  templateType: NotificationTemplateType;

  @Column({ type: 'enum', enum: NotificationStatus, default: NotificationStatus.PENDING })
  status: NotificationStatus;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string | null;

  @Column({ name: 'sent_at', type: 'timestamp', nullable: true })
  sentAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
