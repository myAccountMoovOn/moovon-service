import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, IsNull, In } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Subscription, PaymentStatus } from '../subscriptions/entities/subscription.entity';
import { Service, DurationType } from '../services-master/entities/service.entity';
import { NotificationLog, NotificationTemplateType, NotificationChannel } from '../notifications/entities/notification-log.entity';
import { NOTIFICATION_QUEUE, NotificationJobPayload, NotificationJobType } from '../queues/notification.queue';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    @InjectRepository(Subscription)
    private readonly subRepo: Repository<Subscription>,
    @InjectRepository(NotificationLog)
    private readonly logRepo: Repository<NotificationLog>,
    @InjectQueue(NOTIFICATION_QUEUE)
    private readonly notificationQueue: Queue,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleDailyNotifications() {
    this.logger.log('Running daily 9:00 AM subscription notification cron job...');

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const activeSubscriptions = await this.subRepo.find({
      where: {
        paymentStatus: In([PaymentStatus.PENDING, PaymentStatus.PARTIAL]),
      },
      relations: ['customer', 'service'],
    });

    for (const sub of activeSubscriptions) {
      if (!sub.customer || !sub.service) continue;

      // SKIP notifications for deactivated services
      if (!sub.service.isActive) {
        this.logger.debug(`Skipping notification for subscription ${sub.id} as service ${sub.service.name} is deactivated.`);
        continue;
      }

      // SKIP expiry alerts for ongoing subscriptions (no end date)
      if (!sub.endDate) continue;

      const endDate = new Date(sub.endDate);
      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let templateType: NotificationTemplateType | null = null;
      let shouldSend = false;

      const isLongTerm = sub.service.durationType === DurationType.YEARLY || sub.service.durationType === DurationType.QUARTERLY;

      if (isLongTerm) {
        // --- YEARLY/QUARTERLY Logic (Standard) ---
        if (diffDays >= 30) {
          if (diffDays === 30) {
            templateType = NotificationTemplateType.RENEWAL_REMINDER;
            shouldSend = true;
          }
        } 
        else if (diffDays >= 6 && diffDays < 30) {
          if (diffDays % 5 === 0) {
             templateType = NotificationTemplateType.RENEWAL_REMINDER;
             shouldSend = true;
          }
        }
        else if (diffDays >= 1 && diffDays <= 5) {
          templateType = NotificationTemplateType.RENEWAL_REMINDER;
          shouldSend = true;
        }
      } else {
        // --- MONTHLY/CUSTOM Logic (Streamlined) ---
        // Only notify at 7, 3, and 1 days before expiry
        if ([7, 3, 1].includes(diffDays)) {
          templateType = NotificationTemplateType.RENEWAL_REMINDER;
          shouldSend = true;
        }
      }

      // --- SHARED RULES (Expiry & Follow-Up) ---
      // Expired today
      if (diffDays === 0) {
        templateType = NotificationTemplateType.EXPIRY_ALERT;
        shouldSend = true;
      }
      // Expired 1 to 7 days ago => send follow up daily
      else if (diffDays < 0 && diffDays >= -7) {
        templateType = NotificationTemplateType.FOLLOW_UP;
        shouldSend = true;
      }

      if (shouldSend && templateType) {
        const hasSentToday = await this.checkDuplicateLog(sub.id, templateType);
        if (!hasSentToday) {
          await this.dispatchJobs(sub, templateType);
        }
      }
    }



    this.logger.log('Daily subscription notification cron job complete.');
  }

  private async checkDuplicateLog(subscriptionId: string, templateType: NotificationTemplateType): Promise<boolean> {
    const todayStr = new Date().toISOString().split('T')[0];
    
    const logs = await this.logRepo.createQueryBuilder('log')
      .where('log.subscription_id = :subscriptionId', { subscriptionId })
      .andWhere('log.template_type = :templateType', { templateType })
      .andWhere('DATE(log.created_at) = :todayStr', { todayStr })
      .getMany();

    return logs.length > 0;
  }

  private async dispatchJobs(sub: Subscription, templateType: NotificationTemplateType) {
    const variables = {
      customer_name: sub.customer?.name || '',
      service_name: sub.service?.name || '',
      end_date: sub.endDate,
      amount: String(sub.amount),
    };

    const channels = [NotificationChannel.EMAIL, NotificationChannel.SMS];
    const jobs = channels.map(channel => {
      let jobType: NotificationJobType;
      switch (channel) {
        case NotificationChannel.EMAIL: jobType = NotificationJobType.SEND_EMAIL; break;
        case NotificationChannel.SMS: jobType = NotificationJobType.SEND_SMS; break;
        default: jobType = NotificationJobType.SEND_WHATSAPP;
      }

      return {
        name: jobType,
        data: {
          subscriptionId: sub.id,
          customerId: sub.customerId,
          channel,
          templateType,
          variables,
        } as NotificationJobPayload,
      };
    });

    await this.notificationQueue.addBulk(jobs);
    this.logger.log(`Queued ${templateType} jobs for subscription ${sub.id}`);
  }
}
