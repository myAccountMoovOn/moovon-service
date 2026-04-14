import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { Payment } from '../payments/entities/payment.entity';
import { NotificationLog } from '../notifications/entities/notification-log.entity';
import { Profile } from '../auth/entities/profile.entity';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { AuthModule } from '../auth/auth.module';
import { BullModule } from '@nestjs/bullmq';
import { NOTIFICATION_QUEUE } from '../queues/notification.queue';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer, 
      Subscription, 
      Payment, 
      NotificationLog, 
      Profile
    ]), 
    AuthModule,
    BullModule.registerQueue({
      name: NOTIFICATION_QUEUE,
    }),
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
