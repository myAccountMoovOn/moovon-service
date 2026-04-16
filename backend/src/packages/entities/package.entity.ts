import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { Service } from '../../services-master/entities/service.entity';

@Entity('packages')
export class Package {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => Service, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'package_services_junction',
    joinColumn: { name: 'package_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'service_id', referencedColumnName: 'id' },
  })
  services?: Service[];

  @Column()
  name: string;

  @Column({ name: 'duration_months', type: 'integer' })
  durationMonths: number;

  @Column({ name: 'actual_price', type: 'decimal', precision: 10, scale: 2 })
  actualPrice: number;

  @Column({ name: 'offer_price', type: 'decimal', precision: 10, scale: 2 })
  offerPrice: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
