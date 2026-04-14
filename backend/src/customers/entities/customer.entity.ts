import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Profile } from '../../auth/entities/profile.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { NotificationLog } from '../../notifications/entities/notification-log.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null;

  @OneToOne(() => Profile, (profile) => profile.customer)
  @JoinColumn({ name: 'user_id' })
  profile?: Profile;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'company_name', type: 'varchar', length: 255, nullable: true })
  companyName: string | null;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ name: 'gst_number', type: 'varchar', length: 50, nullable: true })
  gstNumber: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Subscription, (sub) => sub.customer)
  subscriptions?: Subscription[];

  @OneToMany(() => NotificationLog, (log) => log.customer)
  notificationLogs?: NotificationLog[];

  subscriptionsCount?: number;
}
