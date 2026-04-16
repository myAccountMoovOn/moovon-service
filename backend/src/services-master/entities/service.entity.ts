import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { Category } from '../../categories/entities/category.entity';
import { ManyToOne, JoinColumn } from 'typeorm';

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

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string;

  @Column({ name: 'category_id', type: 'uuid', nullable: true })
  categoryId: string;

  @ManyToOne(() => Category, (cat) => cat.services)
  @JoinColumn({ name: 'category_id' })
  categoryRef: Category;

  @Column({ name: 'pricing_type', type: 'enum', enum: PricingType, nullable: true })
  pricingType: PricingType;

  @Column({ name: 'duration_type', type: 'enum', enum: DurationType, nullable: true })
  durationType: DurationType;

  @Column({ name: 'base_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
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
