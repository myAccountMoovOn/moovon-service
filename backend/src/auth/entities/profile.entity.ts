import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';
import { Company } from '../../companies/entities/company.entity';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  PROVIDER = 'provider',
  CUSTOMER = 'customer',
}

@Entity('profiles')
export class Profile {
  @PrimaryColumn('uuid')
  id: string; // FK to Supabase auth.users.id

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ name: 'company_id', type: 'uuid', nullable: true })
  companyId: string | null;

  @ManyToOne(() => Company, (company) => company.profiles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company?: Company;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Customer, (customer) => customer.profile)
  customer?: Customer;
}
