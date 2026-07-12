import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Profile } from '../../auth/entities/profile.entity';
import { Customer } from '../../customers/entities/customer.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  logo: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  customDomain: string;

  @Column({ type: 'boolean', default: false })
  isReseller: boolean;

  @Column({ type: 'uuid', nullable: true })
  resellerId: string | null;

  @ManyToOne(() => Company, (company) => company.businesses, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'resellerId' })
  reseller: Company;

  @OneToMany(() => Company, (company) => company.reseller)
  businesses: Company[];

  // Visual Identity
  @Column({ type: 'varchar', length: 50, nullable: true })
  primaryColor: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  accentColor: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  fontFamily: string;

  @Column({ type: 'text', nullable: true })
  favicon: string;

  // App Identity
  @Column({ type: 'varchar', length: 255, nullable: true })
  appName: string;

  @Column({ type: 'text', nullable: true })
  tagline: string;

  @Column({ type: 'text', nullable: true })
  appIconUrl: string;

  // Custom SMTP
  @Column({ type: 'varchar', length: 255, nullable: true })
  smtpHost: string;

  @Column({ type: 'int', nullable: true })
  smtpPort: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  smtpUser: string;

  @Column({ type: 'text', nullable: true }) // Encrypted
  smtpPass: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  smtpFromName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  smtpFromEmail: string;

  // Communication
  @Column({ type: 'varchar', length: 255, nullable: true })
  supportEmail: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  supportPhone: string;

  @Column({ type: 'text', nullable: true })
  emailHeaderLogo: string;

  // Legal
  @Column({ type: 'text', nullable: true })
  privacyPolicyUrl: string;

  @Column({ type: 'text', nullable: true })
  termsUrl: string;

  @Column({ type: 'text', nullable: true })
  footerText: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Profile, (profile) => profile.company)
  profiles: Profile[];

  @OneToMany(() => Customer, (customer) => customer.company)
  customers: Customer[];
}
