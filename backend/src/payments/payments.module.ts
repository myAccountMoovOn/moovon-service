import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Customer } from '../customers/entities/customer.entity';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { StorageModule } from '../storage/storage.module';
import { BullModule } from '@nestjs/bullmq';
import { NOTIFICATION_QUEUE } from '../queues/notification.queue';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Customer]),
    forwardRef(() => SubscriptionsModule),
    StorageModule,
    BullModule.registerQueue({ name: NOTIFICATION_QUEUE }),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
