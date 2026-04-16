import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { RedisModule } from './redis/redis.module';
import { CommonModule } from './common/common.module';

// Entities
import { Profile } from './auth/entities/profile.entity';
import { Customer } from './customers/entities/customer.entity';
import { Service } from './services-master/entities/service.entity';
import { Subscription } from './subscriptions/entities/subscription.entity';
import { Payment } from './payments/entities/payment.entity';
import { NotificationLog } from './notifications/entities/notification-log.entity';
import { Template } from './templates/entities/template.entity';
import { AuditLog } from './common/entities/audit-log.entity';
import { Category } from './categories/entities/category.entity';
import { Package } from './packages/entities/package.entity';
import { Coupon } from './coupons/entities/coupon.entity';

// Modules
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { ServicesMasterModule } from './services-master/services-master.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TemplatesModule } from './templates/templates.module';
import { ReportsModule } from './reports/reports.module';
import { QueuesModule } from './queues/queues.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { StorageModule } from './storage/storage.module';
import { CategoriesModule } from './categories/categories.module';
import { PackagesModule } from './packages/packages.module';
import { CouponsModule } from './coupons/coupons.module';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';

@Module({
  imports: [
    // Config — global so all modules can inject ConfigService
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeORM — Supabase PostgreSQL
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.getOrThrow<string>('DATABASE_URL'),
        ssl: { rejectUnauthorized: false },
        entities: [
          Profile,
          Customer,
          Service,
          Subscription,
          Payment,
          NotificationLog,
          Template,
          AuditLog,
          Category,
          Package,
          Coupon,
        ],
        synchronize: config.get<string>('NODE_ENV') !== 'production',
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
    }),

    // Rate limiting — 100 requests per minute per IP
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Cron scheduler
    ScheduleModule.forRoot(),

    // BullMQ — Redis queue
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST', '127.0.0.1'),
          port: config.get<number>('REDIS_PORT', 6379),
          password: config.get<string>('REDIS_PASSWORD') || undefined,
          enableReadyCheck: false,
          maxRetriesPerRequest: null,
          retryStrategy: (times: number) => {
            if (times > 3) return null; // stop retrying
            return Math.min(times * 100, 3000);
          },
        },
      }),
    }),

    // Feature modules
    AuthModule,
    CustomersModule,
    ServicesMasterModule,
    SubscriptionsModule,
    PaymentsModule,
    NotificationsModule,
    TemplatesModule,
    ReportsModule,
    QueuesModule,
    SchedulerModule,
    StorageModule,
    RedisModule,
    CommonModule,
    CategoriesModule,
    PackagesModule,
    CouponsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}
