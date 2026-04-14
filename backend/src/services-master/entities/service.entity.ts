import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Subscription } from '../../subscriptions/entities/subscription.entity';

export enum PricingType {
  FIXED = 'fixed',
  CUSTOM = 'custom',
}

export enum DurationType {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  CUSTOM = 'custom',
}

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ name: 'pricing_type', type: 'enum', enum: PricingType })
  pricingType: PricingType;

  @Column({ name: 'duration_type', type: 'enum', enum: DurationType })
  durationType: DurationType;

  @Column({ name: 'base_price', type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Subscription, (sub) => sub.service)
  subscriptions?: Subscription[];

  subscriptionsCount?: number;
}
