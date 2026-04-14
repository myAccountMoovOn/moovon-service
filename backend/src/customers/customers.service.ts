import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { Payment } from '../payments/entities/payment.entity';
import { NotificationLog } from '../notifications/entities/notification-log.entity';
import { Profile } from '../auth/entities/profile.entity';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { AuthService } from '../auth/auth.service';
import { UserRole } from '../auth/entities/profile.entity';
import { NOTIFICATION_QUEUE, NotificationJobPayload, NotificationJobType } from '../queues/notification.queue';
import { NotificationTemplateType, NotificationChannel } from '../notifications/entities/notification-log.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import * as crypto from 'crypto';
import * as xlsx from 'xlsx';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    private readonly authService: AuthService,
    private readonly dataSource: DataSource,
    @InjectQueue(NOTIFICATION_QUEUE)
    private readonly notificationQueue: Queue,
  ) {}

  async create(dto: CreateCustomerDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 0. Check if customer already exists by email
      const existing = await this.customerRepo.findOne({ where: { email: dto.email } });
      if (existing) {
        throw new BadRequestException('Customer with this email already exists');
      }

      const generatedPassword = crypto.randomBytes(8).toString('hex');
      
      // 1. Create Supabase User & Profile
      const userId = await this.authService.createSupabaseUser(dto.email, generatedPassword, UserRole.CUSTOMER);

      // 2. Create customer entity
      const customer = this.customerRepo.create({
        ...dto,
        userId,
      });

      const savedCustomer = await queryRunner.manager.save(Customer, customer);
      await queryRunner.commitTransaction();

      this.logger.log(`Customer created successfully: ${savedCustomer.email} (ID: ${savedCustomer.id})`);

      // 3. Send credentials if requested
      if (dto.sendLoginCredentials) {
        this.logger.log(`Dispatching credential notification for ${dto.email}`);
        await this.notificationQueue.add(
          NotificationJobType.SEND_EMAIL,
          {
            subscriptionId: null,
            customerId: savedCustomer.id,
            channel: 'email',
            templateType: NotificationTemplateType.CUSTOMER_CREDENTIALS,
            variables: {
              customer_name: savedCustomer.name,
              customer_email: savedCustomer.email,
              customer_password: generatedPassword,
            },
          } as NotificationJobPayload,
          {
            removeOnComplete: true,
            attempts: 3,
            backoff: { type: 'exponential', delay: 1000 },
          },
        );
      }

      return {
        ...savedCustomer,
        password: generatedPassword, // Return for admin result modal
      };
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Failed to create customer: ${error.message}`, error.stack);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Failed to create customer');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(page: number = 1, limit: number = 10, search?: string, isActive?: boolean, from?: string, to?: string) {
    const query = this.customerRepo.createQueryBuilder('customer');

    if (search) {
      query.where('(customer.name ILIKE :search OR customer.email ILIKE :search OR customer.phone ILIKE :search)', { search: `%${search}%` });
    }

    if (isActive !== undefined) {
      query.andWhere('customer.isActive = :isActive', { isActive });
    }

    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      toDate.setUTCHours(23, 59, 59, 999);
      query.andWhere('customer.createdAt BETWEEN :from AND :to', { from: fromDate, to: toDate });
    }

    // Include subscriptions count
    query.loadRelationCountAndMap('customer.subscriptionsCount', 'customer.subscriptions');
    
    query.orderBy('customer.createdAt', 'DESC');
    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const customer = await this.customerRepo.findOne({
      where: { id },
      relations: ['subscriptions'],
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const customer = await this.findOne(id);
    
    if (dto.email && dto.email !== customer.email) {
       const emailExists = await this.customerRepo.findOne({ where: { email: dto.email }});
       if (emailExists) throw new BadRequestException('Email already in use');
       
       // Note: Updating Supabase auth email requires admin API call, simplified here for record only
    }

    Object.assign(customer, dto);
    return this.customerRepo.save(customer);
  }

  async remove(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const customer = await this.customerRepo.findOne({ 
        where: { id },
        relations: ['subscriptions']
      });
      if (!customer) throw new NotFoundException(`Customer with ID ${id} not found`);

      const subscriptionIds = customer.subscriptions?.map(s => s.id) || [];

      // 1. Delete all Notification Logs for this customer
      await queryRunner.manager.delete(NotificationLog, { customerId: id });

      // 2. Delete all Payments related to this customer's subscriptions
      if (subscriptionIds.length > 0) {
        await queryRunner.manager.delete(Payment, { subscriptionId: In(subscriptionIds) });
        // 3. Delete all Subscriptions
        await queryRunner.manager.delete(Subscription, { customerId: id });
      }

      // 4. Delete the Customer record
      await queryRunner.manager.delete(Customer, { id });

      // 5. Delete the Profile record (using the userId)
      if (customer.userId) {
        await queryRunner.manager.delete(Profile, { id: customer.userId });
      }

      await queryRunner.commitTransaction();

      // 6. Finally, Delete Supabase Auth User (outside DB transaction)
      if (customer.userId) {
        try {
          await this.authService.deleteSupabaseUser(customer.userId);
        } catch (authError) {
          this.logger.error(`Supabase Auth deletion failed for user ${customer.userId}, but DB records were cleared.`);
        }
      }

      return { success: true, message: 'Customer and all associated data deleted successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async bulkImport(fileBuffer: Buffer) {
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json<any>(sheet);

    let successCount = 0;
    let failedCount = 0;
    const errors: any[] = [];

    for (const [index, row] of rows.entries()) {
      try {
        if (!row.name || !row.email || !row.phone) {
          throw new Error('Missing required fields: name, email, or phone');
        }

        await this.create({
          name: row.name,
          email: String(row.email).toLowerCase(),
          phone: String(row.phone),
          companyName: row.companyName,
          address: row.address,
          gstNumber: row.gstNumber,
          notes: row.notes,
          sendLoginCredentials: false,
        });
        successCount++;
      } catch (err: any) {
        failedCount++;
        errors.push({ row: index + 2, error: err.message });
      }
    }

    return { success: successCount, failed: failedCount, errors };
  }
}
