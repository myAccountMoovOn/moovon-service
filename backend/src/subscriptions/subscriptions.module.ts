import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { Subscription } from './entities/subscription.entity';
import { Payment } from '../payments/entities/payment.entity';
import { NotificationLog } from '../notifications/entities/notification-log.entity';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { NOTIFICATION_QUEUE } from '../queues/notification.queue';
import { PaymentsModule } from '../payments/payments.module';
import { NotificationsModule } from '../notifications/notifications.module';

import { Service } from '../services-master/entities/service.entity';
import { Package } from '../packages/entities/package.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, Payment, NotificationLog, Service, Package]),
    BullModule.registerQueue({ name: NOTIFICATION_QUEUE }),
    forwardRef(() => PaymentsModule),
    NotificationsModule,
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
