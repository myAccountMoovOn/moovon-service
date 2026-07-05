import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { Payment, PaymentRecordStatus } from '../payments/entities/payment.entity';
import { Customer } from '../customers/entities/customer.entity';
import { Service } from '../services-master/entities/service.entity';
import * as XLSX from 'xlsx';

import { PdfService } from './pdf.service';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    @InjectRepository(Subscription) private readonly subRepo: Repository<Subscription>,
    @InjectRepository(Payment) private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Customer) private readonly customerRepo: Repository<Customer>,
    @InjectRepository(Service) private readonly serviceRepo: Repository<Service>,
    private readonly pdfService: PdfService,
  ) {}

  async exportToPdf(from?: string, to?: string, type: string = 'renewals') {
    let title = 'Report';
    let headers: string[] = [];
    let rows: any[] = [];
    let data: any;

    switch (type) {
      case 'revenue':
        title = 'Revenue Report';
        const { payments } = await this.getRevenue(from, to);
        data = payments;
        headers = ['Transaction ID', 'Customer', 'Amount', 'Date'];
        rows = data.map((p: any) => [
          p.transactionId || 'N/A',
          p.subscription?.customer?.name || 'N/A',
          `Rs. ${p.amount}`,
          p.paidAt ? new Date(p.paidAt).toLocaleDateString() : 'N/A'
        ]);
        break;

      case 'customers':
        title = 'Customer Performance Report';
        data = await this.getCustomerReport();
        headers = ['Name', 'Email', 'Active Subs', 'Status'];
        rows = data.map((c: any) => [
          c.name,
          c.email,
          c.subscriptionsCount || 0,
          c.isActive ? 'Active' : 'Inactive'
        ]);
        break;

      case 'services':
        title = 'Service Popularity Report';
        data = await this.getServiceReport();
        headers = ['Service Name', 'Total Subs', 'Monthly Price', 'Status'];
        rows = data.map((s: any) => [
          s.name,
          s.subscriptionsCount || 0,
          `Rs. ${s.monthlyPrice}`,
          s.isActive ? 'Active' : 'Inactive'
        ]);
        break;
      
      case 'payment_status':
        title = 'Outstanding / Pending Payments';
        data = await this.getPaymentStatusReport();
        headers = ['Customer', 'Service', 'Due Date', 'Status'];
        rows = data.map((s: any) => [
          s.customer?.name,
          s.service?.name,
          new Date(s.endDate).toLocaleDateString(),
          s.paymentStatus.toUpperCase()
        ]);
        break;

      default: // renewals
        title = 'Upcoming Renewals Report';
        data = await this.getRenewals(from, to);
        headers = ['Customer', 'Service', 'Expiry', 'Amount'];
        rows = data.map((sub: any) => [
          sub.customer?.name,
          sub.service?.name,
          new Date(sub.endDate).toLocaleDateString(),
          `Rs. ${sub.amount}`
        ]);
    }

    const docDefinition: TDocumentDefinitions = {
      content: [
        { text: title, style: 'header' },
        { text: `Date Range: ${from || 'All'} to ${to || 'All'}`, style: 'subheader' },
        { text: `Generated on: ${new Date().toLocaleString()}`, margin: [0, 0, 0, 20] },
        {
          table: {
            headerRows: 1,
            widths: Array(headers.length).fill('*'),
            body: [
              headers.map(h => ({ text: h, bold: true, fillColor: '#f4f4f4' })),
              ...rows
            ]
          }
        }
      ],
      styles: {
        header: { fontSize: 20, bold: true, color: '#1a73e8', margin: [0, 0, 0, 10] },
        subheader: { fontSize: 12, color: '#555', margin: [0, 0, 0, 2] }
      }
    };

    return this.pdfService.generatePdf(docDefinition);
  }

  async exportToExcel(type: string, from?: string, to?: string, format: 'xlsx' | 'csv' = 'xlsx') {
    let rows: any[] = [];
    let sheetName = 'Report';

    switch (type) {
      case 'revenue':
        const { payments } = await this.getRevenue(from, to);
        sheetName = 'Revenue';
        rows = payments.map(p => ({
          'Transaction ID': p.transactionId,
          'Customer': p.subscription?.customer?.name,
          'Amount': p.amount,
          'Paid At': p.paidAt,
          'Status': p.status
        }));
        break;
      
      case 'customers':
        const customers = await this.getCustomerReport();
        sheetName = 'Customers';
        rows = customers.map(c => ({
          'Name': c.name,
          'Email': c.email,
          'Phone': c.phone,
          'Active Subs': c.subscriptionsCount,
          'Status': c.isActive ? 'Active' : 'Inactive'
        }));
        break;

      case 'services':
        const services = await this.getServiceReport();
        sheetName = 'Services';
        rows = services.map(s => ({
          'Service Name': s.name,
          'Base Price': s.basePrice,
          'Total Subs': s.subscriptionsCount,
          'Status': s.isActive ? 'Active' : 'Inactive'
        }));
        break;

      case 'payment_status':
        const pending = await this.getPaymentStatusReport();
        sheetName = 'Outstanding';
        rows = pending.map(s => ({
          'Customer': s.customer?.name,
          'Email': s.customer?.email,
          'Service': s.service?.name,
          'Due Date': s.endDate,
          'Status': s.paymentStatus
        }));
        break;

      default: // renewals
        const data = await this.getRenewals(from, to);
        sheetName = 'Renewals';
        rows = data.map(sub => ({
          'Customer Name': sub.customer?.name,
          'Service': sub.service?.name,
          'Amount': sub.amount,
          'Expiry Date': sub.endDate || 'Ongoing',
          'Status': !sub.endDate || new Date(sub.endDate) > new Date() ? 'Active' : 'Expired'
        }));
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    return XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: format === 'csv' ? 'csv' : 'xlsx' 
    });
  }

  async getCustomerReport() {
    return this.customerRepo.createQueryBuilder('customer')
      .loadRelationCountAndMap('customer.subscriptionsCount', 'customer.subscriptions')
      .orderBy('customer.name', 'ASC')
      .getMany();
  }

  async getServiceReport() {
    return this.serviceRepo.createQueryBuilder('service')
      .loadRelationCountAndMap('service.subscriptionsCount', 'service.subscriptions')
      .orderBy('service.name', 'ASC')
      .getMany();
  }

  async getPaymentStatusReport() {
    return this.subRepo.createQueryBuilder('sub')
      .leftJoinAndSelect('sub.customer', 'customer')
      .leftJoinAndSelect('sub.service', 'service')
      .where('sub.paymentStatus IN (:...statuses)', { statuses: ['pending', 'partial'] })
      .orderBy('sub.endDate', 'ASC')
      .getMany();
  }

  async getRenewals(from?: string, to?: string) {
    const query = this.subRepo.createQueryBuilder('sub')
      .leftJoinAndSelect('sub.customer', 'customer')
      .leftJoinAndSelect('sub.service', 'service');

    if (from && to) {
      query.where('sub.endDate BETWEEN :from AND :to', { from, to });
    }
    
    query.orderBy('sub.endDate', 'ASC');
    return await query.getMany();
  }

  async getRevenue(from?: string, to?: string) {
    const query = this.paymentRepo.createQueryBuilder('payment')
      .leftJoinAndSelect('payment.subscription', 'subscription')
      .leftJoinAndSelect('subscription.customer', 'customer')
      .where('payment.status = :status', { status: PaymentRecordStatus.SUCCESS });

    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      toDate.setUTCHours(23, 59, 59, 999);
      query.andWhere('payment.paidAt BETWEEN :from AND :to', { from: fromDate, to: toDate });
    }

    const payments = await query.getMany();
    const totalRevenue = payments.reduce((sum: number, p: Payment) => sum + Number(p.amount), 0);

    return { totalRevenue, payments };
  }

  async getDashboardSummary(from?: string, to?: string, companyId?: string | null) {
    const nowStr = new Date().toISOString().split('T')[0];
    const next30DaysDate = new Date();
    next30DaysDate.setDate(next30DaysDate.getDate() + 30);
    const next30DaysStr = next30DaysDate.toISOString().split('T')[0];

    // Helper for date filtering in counts
    const addDateFilter = (qb: any, field: string = 'sub.createdAt') => {
      if (from && to) {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        toDate.setUTCHours(23, 59, 59, 999);
        qb.andWhere(`${field} BETWEEN :from AND :to`, { from: fromDate, to: toDate });
      }
      return qb;
    };
    
    // Helper for scoping by company
    const scopeByCompany = (qb: any, field: string) => {
      if (companyId) {
        qb.andWhere(`${field} = :companyId`, { companyId });
      }
      return qb;
    };

    const paymentQuery = this.paymentRepo.createQueryBuilder('payment')
      .leftJoinAndSelect('payment.subscription', 'subscription')
      .where('payment.status = :paymentStatus', { paymentStatus: PaymentRecordStatus.SUCCESS });
    scopeByCompany(paymentQuery, 'subscription.company_id');

    const customerQuery = this.customerRepo.createQueryBuilder('customer');
    scopeByCompany(customerQuery, 'customer.company_id');
    
    const subQueryBase = this.subRepo.createQueryBuilder('sub');
    scopeByCompany(subQueryBase, 'sub.company_id');

    const absolutePaymentQuery = this.paymentRepo.createQueryBuilder('payment')
      .leftJoinAndSelect('payment.subscription', 'subscription')
      .where('payment.status = :paymentStatus', { paymentStatus: PaymentRecordStatus.SUCCESS });
    scopeByCompany(absolutePaymentQuery, 'subscription.company_id');

    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      toDate.setUTCHours(23, 59, 59, 999);
      
      paymentQuery.andWhere('payment.paidAt BETWEEN :from AND :to', { from: fromDate, to: toDate });
      
      // New Customer definition: Customers who started a subscription in this period
      customerQuery.andWhere(qb => {
        const subQuery = qb.subQuery()
          .select('1')
          .from(Subscription, 'sub')
          .where('sub.customerId = customer.id')
          .andWhere('sub.startDate BETWEEN :from AND :to', { from: fromDate, to: toDate })
          .getQuery();
        return 'EXISTS ' + subQuery;
      });
    }

    const [
      absoluteTotalCustomers, 
      newCustomers, 
      allSuccessfulPayments, 
      filteredPayments, 
      activeSubs, 
      expiredSubs, 
      upcomingRenewals, 
      filteredSubscriptions
    ] = await Promise.all([
      this.customerRepo.createQueryBuilder('customer')
        .where(qb => {
          const subQuery = qb.subQuery()
            .select('1')
            .from(Subscription, 'sub')
            .where('sub.customerId = customer.id')
            .getQuery();
          return 'EXISTS ' + subQuery;
        })
        .andWhere(companyId ? 'customer.company_id = :companyId' : '1=1', { companyId })
        .getCount(),
      customerQuery.getCount(),
      absolutePaymentQuery.getMany(),
      paymentQuery.getMany(),
      // Active: (endDate >= now OR NULL) AND paid - ABSOLUTE (no date filter)
      scopeByCompany(
        this.subRepo.createQueryBuilder('sub')
          .where('(sub.endDate >= :nowStr OR sub.endDate IS NULL)', { nowStr })
          .andWhere('sub.paymentStatus = :paidStatus', { paidStatus: 'paid' }),
        'sub.company_id'
      ).getCount(),
      // Expired: endDate < now - ABSOLUTE (no date filter)
      scopeByCompany(
        this.subRepo.createQueryBuilder('sub')
          .where('sub.endDate < :nowStr', { nowStr }),
        'sub.company_id'
      ).getCount(),
      // Upcoming: endDate in next 30 days AND respects date filter
      addDateFilter(
        scopeByCompany(
          this.subRepo.createQueryBuilder('sub')
            .where('sub.endDate BETWEEN :nowStr AND :next30DaysStr', { nowStr, next30DaysStr }),
          'sub.company_id'
        ),
        'sub.endDate'
      ).getCount(),
      // For Expected Revenue calculation: Sum of ALL subscriptions in that period
      addDateFilter(
        scopeByCompany(
          this.subRepo.createQueryBuilder('sub'),
          'sub.company_id'
        ),
        'sub.startDate'
      ).getMany(),
    ]);

    const totalRevenueValue = allSuccessfulPayments.reduce((sum: number, p: Payment) => sum + Number(p.amount), 0);
    const newRevenueValue = filteredPayments.reduce((sum: number, p: Payment) => sum + Number(p.amount), 0);
    const expectedRevenueValue = filteredSubscriptions.reduce((sum: number, s: Subscription) => sum + Number(s.amount), 0);

    return {
      totalCustomers: Number(absoluteTotalCustomers),
      newCustomers: Number(newCustomers),
      totalRevenue: totalRevenueValue,
      newRevenue: newRevenueValue,
      expectedRevenue: expectedRevenueValue,
      activeSubscriptions: Number(activeSubs),
      expiredSubscriptions: Number(expiredSubs),
      upcomingRenewals: Number(upcomingRenewals),
    };
  }
}
