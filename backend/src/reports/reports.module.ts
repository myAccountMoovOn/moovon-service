import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PdfService } from './pdf.service';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Customer } from '../customers/entities/customer.entity';
import { Service } from '../services-master/entities/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, Payment, Customer, Service])],
  controllers: [ReportsController],
  providers: [ReportsService, PdfService],
  exports: [ReportsService],
})
export class ReportsModule {}
