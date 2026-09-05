import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';
import { Service } from '../../services-master/entities/service.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { NotificationLog } from '../../notifications/entities/notification-log.entity';
import { Package } from '../../packages/entities/package.entity';

export enum PaymentStatus {
  PAID = 'paid',
  PENDING = 'pending',
  PARTIAL = 'partial',
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id', type: 'uuid', nullable: true })
  companyId: string | null;

  @ManyToOne('Company', 'subscriptions', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company?: any;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId: string;

  @ManyToOne(() => Customer, (customer) => customer.subscriptions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer?: Customer;

  @Column({ name: 'service_id', type: 'uuid', nullable: true })
  serviceId: string | null;

  @ManyToOne(() => Service, (service) => service.subscriptions)
  @JoinColumn({ name: 'service_id' })
  service?: Service;

  @Column({ name: 'start_date', type: 'date' })
  startDate: string;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    name: 'payment_status',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({ name: 'auto_renewal', type: 'boolean', default: false })
  autoRenewal: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'package_id', type: 'uuid', nullable: true })
  packageId: string | null;

  @ManyToOne(() => Package, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'package_id' })
  package?: Package;

  @Column({ name: 'coupon_id', type: 'uuid', nullable: true })
  couponId: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Payment, (payment) => payment.subscription, { cascade: true })
  payments?: Payment[];

  @OneToMany(() => NotificationLog, (log) => log.subscription)
  notificationLogs?: NotificationLog[];
}
