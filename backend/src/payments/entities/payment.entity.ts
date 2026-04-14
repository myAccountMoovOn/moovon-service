import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Subscription } from '../../subscriptions/entities/subscription.entity';

export enum PaymentGateway {
  RAZORPAY = 'razorpay',
}

export enum PaymentRecordStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'subscription_id', type: 'uuid' })
  subscriptionId: string;

  @ManyToOne(() => Subscription, (sub) => sub.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subscription_id' })
  subscription?: Subscription;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    name: 'payment_gateway',
    type: 'varchar',
    length: 50,
    default: PaymentGateway.RAZORPAY,
  })
  paymentGateway: string;

  @Column({ name: 'transaction_id', type: 'varchar', length: 255, nullable: true })
  transactionId: string | null;

  @Column({ name: 'razorpay_order_id', type: 'varchar', length: 255, nullable: true })
  razorpayOrderId: string | null;

  @Column({ name: 'razorpay_payment_id', type: 'varchar', length: 255, nullable: true })
  razorpayPaymentId: string | null;

  @Column({ name: 'payment_link_id', type: 'varchar', length: 255, nullable: true })
  paymentLinkId: string | null;

  @Column({ name: 'payment_link_url', type: 'text', nullable: true })
  paymentLinkUrl: string | null;

  @Column({
    type: 'enum',
    enum: PaymentRecordStatus,
    default: PaymentRecordStatus.PENDING,
  })
  status: PaymentRecordStatus;

  @Column({ name: 'paid_at', type: 'timestamp', nullable: true })
  paidAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
