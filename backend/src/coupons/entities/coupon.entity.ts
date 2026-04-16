import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column({
    type: 'enum',
    enum: DiscountType,
    default: DiscountType.PERCENTAGE,
  })
  type: DiscountType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({ name: 'expiry_date', type: 'timestamp', nullable: true })
  expiryDate: Date | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'min_purchase_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  minPurchaseAmount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
