import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import {
  NOTIFICATION_QUEUE,
  NotificationJobPayload,
  NotificationJobType,
} from './notification.queue';
import { NotificationsService } from '../notifications/notifications.service';

@Processor(NOTIFICATION_QUEUE)
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(private readonly notificationsService: NotificationsService) {
    super();
  }

  async process(job: Job<NotificationJobPayload>): Promise<void> {
    const { data } = job;
    this.logger.log(`Processing job [${job.name}] for customer ${data.customerId}`);

    try {
      switch (job.name as NotificationJobType) {
        case NotificationJobType.SEND_EMAIL:
          await this.notificationsService.sendEmail(data);
          break;
        case NotificationJobType.SEND_SMS:
          await this.notificationsService.sendSms(data);
          break;
        case NotificationJobType.SEND_WHATSAPP:
          // WhatsApp integration placeholder — to be implemented in a later phase
          this.logger.warn('WhatsApp sending is not yet implemented — job skipped');
          break;
        default:
          this.logger.warn(`Unknown job type: ${job.name}`);
      }
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Job [${job.name}] failed for customer ${data.customerId}: ${err.message}`,
        err.stack,
      );
      throw error; // let BullMQ handle retry
    }
  }
}
