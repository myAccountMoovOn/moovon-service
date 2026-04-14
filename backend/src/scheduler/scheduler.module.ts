import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { NotificationLog } from '../notifications/entities/notification-log.entity';
import { NOTIFICATION_QUEUE } from '../queues/notification.queue';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, NotificationLog]),
    BullModule.registerQueue({ name: NOTIFICATION_QUEUE }),
  ],
  controllers: [SchedulerController],
  providers: [SchedulerService],
})
export class SchedulerModule {}
