import { BadRequestException, Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Subscription, PaymentStatus } from './entities/subscription.entity';
import { CreateSubscriptionDto, UpdateSubscriptionDto, NotifySubscriptionDto } from './dto/subscription.dto';
import { NOTIFICATION_QUEUE, NotificationJobPayload, NotificationJobType } from '../queues/notification.queue';
import { NotificationTemplateType, NotificationChannel, NotificationLog } from '../notifications/entities/notification-log.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Service } from '../services-master/entities/service.entity';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
    @InjectQueue(NOTIFICATION_QUEUE)
    private readonly notificationQueue: Queue,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => PaymentsService))
    private readonly paymentsService: PaymentsService,
  ) {}

  async create(dto: CreateSubscriptionDto) {
    const service = await this.serviceRepo.findOne({ where: { id: dto.serviceId } });
    if (!service) throw new NotFoundException('Service not found');
    
    if (!service.isActive) {
      throw new BadRequestException('Cannot assign an inactive service. Please activate the service first.');
    }

    const subscription = this.subscriptionRepo.create(dto);
    const savedSub = await this.subscriptionRepo.save(subscription);

    // Fetch again to get relations for email variables
    const subWithRelations = await this.findOne(savedSub.id);

    // Generate Actual Payment Link (via PaymentsService which handles Razorpay vs Mock)
    const { paymentLinkUrl } = await this.paymentsService.generateLink(subWithRelations.id);

    // Queue Automated Email
    const emailPayload: NotificationJobPayload = {
      subscriptionId: subWithRelations.id,
      customerId: subWithRelations.customerId,
      channel: NotificationChannel.EMAIL,
      templateType: NotificationTemplateType.NEW_SUBSCRIPTION,
      variables: {
        customer_name: subWithRelations.customer?.name || 'Customer',
        customer_email: subWithRelations.customer?.email || '',
        service_name: subWithRelations.service?.name || 'Service',
        amount: String(subWithRelations.amount),
        payment_link: paymentLinkUrl,
        start_date: subWithRelations.startDate,
        end_date: subWithRelations.endDate,
      },
    };

    await this.notificationQueue.add(NotificationJobType.SEND_EMAIL, emailPayload);

    return subWithRelations;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: string,
    customerId?: string,
    serviceId?: string,
    search?: string,
    from?: string,
    to?: string,
    paymentStatus?: string,
  ) {
    const query = this.subscriptionRepo.createQueryBuilder('sub')
      .leftJoinAndSelect('sub.customer', 'customer')
      .leftJoinAndSelect('sub.service', 'service')
      .orderBy('sub.createdAt', 'DESC');

    if (customerId) query.andWhere('sub.customerId = :customerId', { customerId });
    if (serviceId) query.andWhere('sub.serviceId = :serviceId', { serviceId });

    if (search) {
      query.andWhere(
        '(customer.name ILIKE :search OR customer.email ILIKE :search OR customer.phone ILIKE :search OR service.name ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      toDate.setUTCHours(23, 59, 59, 999);
      query.andWhere('sub.endDate BETWEEN :from AND :to', { from: fromDate, to: toDate });
    }

    if (paymentStatus) {
      query.andWhere('sub.paymentStatus = :paymentStatus', { paymentStatus });
    }

    if (status) {
      const today = new Date().toISOString().split('T')[0];
      if (status === 'active') {
        query.andWhere('sub.endDate >= :today', { today });
      } else if (status === 'expired') {
        query.andWhere('sub.endDate < :today', { today });
      } else if (status === 'upcoming') {
        const next7Days = new Date();
        next7Days.setDate(next7Days.getDate() + 7);
        const next7DaysString = next7Days.toISOString().split('T')[0];
        query.andWhere('sub.endDate >= :today AND sub.endDate <= :next7Days', { today, next7Days: next7DaysString });
      }
    }

    const [data, total] = await query.skip((page - 1) * limit).take(limit).getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUpcoming(days: number) {
    const today = new Date().toISOString().split('T')[0];
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    const targetDateString = targetDate.toISOString().split('T')[0];

    return this.subscriptionRepo.createQueryBuilder('sub')
      .leftJoinAndSelect('sub.customer', 'customer')
      .leftJoinAndSelect('sub.service', 'service')
      .where('sub.endDate >= :today AND sub.endDate <= :targetDateString', { today, targetDateString })
      .orderBy('sub.endDate', 'ASC')
      .getMany();
  }

  async findOne(id: string) {
    const sub = await this.subscriptionRepo.findOne({
      where: { id },
      relations: ['customer', 'service', 'payments'],
    });

    if (!sub) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }
    return sub;
  }

  async update(id: string, dto: UpdateSubscriptionDto) {
    const sub = await this.findOne(id);
    Object.assign(sub, dto);
    return this.subscriptionRepo.save(sub);
  }

  async remove(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const sub = await this.subscriptionRepo.findOne({ where: { id } });
      if (!sub) throw new NotFoundException(`Subscription with ID ${id} not found`);

      // 1. Manually delete related Notification Logs
      await queryRunner.manager.delete(NotificationLog, { subscriptionId: id });

      // 2. Manually delete related Payments
      await queryRunner.manager.delete(Payment, { subscriptionId: id });

      // 3. Delete the Subscription
      await queryRunner.manager.delete(Subscription, { id });

      await queryRunner.commitTransaction();
      return { success: true, message: 'Subscription and related records deleted successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async notify(id: string, dto: NotifySubscriptionDto) {
    const sub = await this.findOne(id);

    const variables = {
      customer_name: sub.customer?.name || '',
      customer_email: sub.customer?.email || '',
      customer_phone: sub.customer?.phone || '',
      service_name: sub.service?.name || '',
      start_date: sub.startDate,
      end_date: sub.endDate,
      amount: String(sub.amount),
    };

    const jobs = dto.channels.map((channel) => {
      let jobType: NotificationJobType;
      switch (channel) {
        case NotificationChannel.EMAIL:
          jobType = NotificationJobType.SEND_EMAIL;
          break;
        case NotificationChannel.SMS:
          jobType = NotificationJobType.SEND_SMS;
          break;
        case NotificationChannel.WHATSAPP:
          jobType = NotificationJobType.SEND_WHATSAPP;
          break;
        default:
          throw new Error('Unknown channel');
      }

      const payload: NotificationJobPayload = {
        subscriptionId: sub.id,
        customerId: sub.customerId,
        channel,
        templateType: NotificationTemplateType.RENEWAL_REMINDER,
        variables,
      };

      return {
        name: jobType,
        data: payload,
      };
    });

    await this.notificationQueue.addBulk(jobs);

    return { message: 'Notification jobs added to queue successfully', jobCount: jobs.length };
  }
}
