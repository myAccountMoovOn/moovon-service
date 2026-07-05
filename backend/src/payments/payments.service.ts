import { Injectable, NotFoundException, BadRequestException, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import PDFDocument from 'pdfkit';
import * as fs from 'fs/promises';
import { join } from 'path';
import { AuthenticatedUser } from '../common/guards/supabase-auth.guard';
import { Payment, PaymentRecordStatus } from './entities/payment.entity';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { StorageService } from '../storage/storage.service';
import { PaymentStatus } from '../subscriptions/entities/subscription.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { NOTIFICATION_QUEUE, NotificationJobPayload, NotificationJobType } from '../queues/notification.queue';
import { NotificationTemplateType, NotificationChannel } from '../notifications/entities/notification-log.entity';
import { Customer } from '../customers/entities/customer.entity';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private razorpay: any;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => SubscriptionsService))
    private readonly subscriptionsService: SubscriptionsService,
    private readonly storageService: StorageService,
    @InjectQueue(NOTIFICATION_QUEUE)
    private readonly notificationQueue: Queue,
  ) {
    const key_id = this.configService.get<string>('RAZORPAY_KEY_ID');
    const key_secret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
    if (key_id && key_secret) {
      this.razorpay = new Razorpay({ key_id, key_secret });
    } else {
      this.logger.warn('Razorpay credentials missing. Payment generation will fail.');
    }
  }

  async generateLink(subscriptionId: string, userId?: string) {
    const subscription = await this.subscriptionsService.findOne(subscriptionId);
    
    // Ownership check for customers
    if (userId) {
      const customer = await this.customerRepo.findOne({ where: { userId } });
      if (!customer || subscription.customerId !== customer.id) {
        throw new BadRequestException('You do not have permission to pay for this subscription');
      }
    }
    
    if (subscription.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Subscription is already paid');
    }

    const isMockMode = this.configService.get<string>('PAYMENT_MODE') === 'mock';

    if (isMockMode) {
      this.logger.log(`Generating MOCK payment link for subscription ${subscriptionId}`);
      const mockPayment = this.paymentRepo.create({
        subscriptionId,
        amount: subscription.amount,
        paymentLinkId: `mock_link_${Date.now()}`,
        paymentLinkUrl: `${this.configService.get('FRONTEND_URL')}/mock-payment?id=${subscriptionId}`,
        status: PaymentRecordStatus.PENDING,
      });
      await this.paymentRepo.save(mockPayment);
      return { paymentLinkUrl: mockPayment.paymentLinkUrl };
    }

    if (!this.razorpay) {
      throw new BadRequestException('Razorpay is not configured. Enable Mock Mode for testing.');
    }

    try {
      // Sanitize phone number for Razorpay (must be 10 digits or start with +)
      let phone = subscription.customer?.phone || '';
      phone = phone.replace(/\s+/g, ''); // Remove spaces
      if (!phone.startsWith('+') && phone.length === 10) {
        phone = `+91${phone}`;
      }

      const paymentLinkReq = {
        amount: Math.round(subscription.amount * 100),
        currency: 'INR',
        accept_partial: false,
        description: `Payment for Moovon Service: ${subscription.service?.name}`,
        customer: {
          name: subscription.customer?.name,
          email: subscription.customer?.email,
          contact: phone,
        },
        notify: { sms: false, email: false },
        reminder_enable: false,
        callback_url: `${this.configService.get('FRONTEND_URL')}/customer/dashboard`,
        callback_method: 'get',
        notes: { subscription_id: subscription.id },
      };

      const link = await this.razorpay.paymentLink.create(paymentLinkReq);

      const payment = this.paymentRepo.create({
        subscriptionId,
        amount: subscription.amount,
        paymentLinkId: link.id,
        paymentLinkUrl: link.short_url,
        status: PaymentRecordStatus.PENDING,
      });

      await this.paymentRepo.save(payment);

      return { paymentLinkUrl: link.short_url };
    } catch (error: any) {
      // Better error extraction
      const errorCode = error?.error?.code || error?.code || 'UNKNOWN';
      const errorMessage = error?.error?.description || error?.description || error?.message || 'No detail provided';
      
      this.logger.error(`Failed to generate Razorpay link: ${errorCode} - ${errorMessage}`, error);
      throw new BadRequestException(`Payment link generation failed: ${errorMessage} (${errorCode})`);
    }
  }

  async simulateMockSuccess(subscriptionId: string) {
    const payment = await this.paymentRepo.findOne({
      where: { subscriptionId, status: PaymentRecordStatus.PENDING },
      order: { createdAt: 'DESC' },
    });

    if (!payment) throw new NotFoundException('Pending mock payment not found');

    payment.status = PaymentRecordStatus.SUCCESS;
    payment.paidAt = new Date();
    payment.transactionId = `mock_tx_${Date.now()}`;
    await this.paymentRepo.save(payment);

    await this.subscriptionsService.update(subscriptionId, {
      paymentStatus: PaymentStatus.PAID,
    });

    try {
      this.logger.log(`Attempting to generate invoice for mock payment ${payment.id}`);
      await this.generateInvoicePdf(payment.id);
      await this.sendPaymentConfirmation(payment.id);
    } catch (invoiceError: any) {
      this.logger.warn(`Mock payment succeeded but automated actions failed: ${invoiceError.message}`);
    }

    return { success: true, message: 'Mock payment successful! (Note: Invoices require valid Supabase bucket configuration)' };
  }

  async webhook(body: any, signature: string) {
    const secret = this.configService.get<string>('RAZORPAY_WEBHOOK_SECRET');
    if (!secret) throw new BadRequestException('Webhook secret not configured');

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(body))
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new BadRequestException('Invalid signature');
    }

    if (body.event === 'payment_link.paid') {
      const paymentLinkId = body.payload.payment_link.entity.id;
      const paymentId = body.payload.payment_link.entity.payment_id;
      const orderId = body.payload.payment_link.entity.order_id;

      const payment = await this.paymentRepo.findOne({ where: { paymentLinkId } });
      if (!payment) {
        this.logger.warn(`Webhook received for unknown payment link ID: ${paymentLinkId}`);
        return { success: true };
      }

      payment.status = PaymentRecordStatus.SUCCESS;
      payment.transactionId = paymentId; // using razorpay payment id as tx id
      payment.razorpayPaymentId = paymentId;
      payment.razorpayOrderId = orderId;
      payment.paidAt = new Date();
      await this.paymentRepo.save(payment);

      // Update subscription status
      await this.subscriptionsService.update(payment.subscriptionId, {
        paymentStatus: PaymentStatus.PAID,
      });

      // Generate Invoice & Upload
      await this.generateInvoicePdf(payment.id);
      await this.sendPaymentConfirmation(payment.id);

      this.logger.log(`Payment successful for link ID: ${paymentLinkId}`);
    }

    return { success: true };
  }

  async getHistory(subscriptionId: string) {
    return this.paymentRepo.find({
      where: { subscriptionId },
      order: { createdAt: 'DESC' },
    });
  }

  async sendLink(subscriptionId: string) {
    const latestPayment = await this.paymentRepo.findOne({
      where: { subscriptionId, status: PaymentRecordStatus.PENDING },
      order: { createdAt: 'DESC' },
    });

    if (!latestPayment || !latestPayment.paymentLinkUrl) {
      throw new BadRequestException('No pending payment link found for this subscription. Generate one first.');
    }

    const sub = await this.subscriptionsService.findOne(subscriptionId);

    const variables = {
      customer_name: sub.customer?.name || '',
      customer_email: sub.customer?.email || '',
      customer_phone: sub.customer?.phone || '',
      service_name: sub.service?.name || '',
      amount: String(latestPayment.amount),
      payment_link: latestPayment.paymentLinkUrl,
    };

    const jobs = [NotificationChannel.EMAIL, NotificationChannel.SMS].map(channel => {
      return {
        name: channel === NotificationChannel.EMAIL ? NotificationJobType.SEND_EMAIL : NotificationJobType.SEND_SMS,
        data: {
          subscriptionId: sub.id,
          customerId: sub.customerId,
          channel,
          templateType: NotificationTemplateType.PAYMENT_REMINDER,
          variables,
        } as NotificationJobPayload,
      };
    });

    await this.notificationQueue.addBulk(jobs);

    return { message: 'Payment link sent successfully via Email and SMS' };
  }

  async generateInvoicePdf(paymentId: string) {
    const payment = await this.paymentRepo.findOne({
      where: { id: paymentId },
      relations: ['subscription', 'subscription.customer', 'subscription.service'],
    });

    if (!payment || payment.status !== PaymentRecordStatus.SUCCESS) {
      throw new BadRequestException('Cannot generate invoice for pending or failed payment');
    }

    return new Promise<string>((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', async () => {
          const pdfBuffer = Buffer.concat(buffers);
          try {
            const fileName = `invoice_${paymentId}.pdf`;
            await this.storageService.uploadBuffer('invoices', fileName, pdfBuffer, 'application/pdf');
            const signedUrl = await this.storageService.getSignedUrl('invoices', fileName);
            resolve(signedUrl);
          } catch (err) {
            reject(err);
          }
        });

        const sub = payment.subscription;
        const customer = sub?.customer;
        const service = sub?.service;

        doc.fontSize(20).text('INVOICE', { align: 'center' }).moveDown();

        const companyName = this.configService.get('COMPANY_NAME', 'Moovon Service');
        const companyGst = this.configService.get('COMPANY_GST', '');
        
        doc.fontSize(12).text(`Billed By: ${companyName}`);
        if (companyGst) doc.text(`GST: ${companyGst}`);
        doc.moveDown();

        doc.text(`Invoice No: INV-${paymentId.split('-')[0].toUpperCase()}`);
        doc.text(`Date: ${payment.paidAt?.toLocaleDateString()}`);
        doc.text(`Transaction ID: ${payment.transactionId}`);
        doc.moveDown();

        doc.text(`Billed To:`);
        doc.text(`${customer?.name}`);
        if (customer?.companyName) doc.text(`${customer.companyName}`);
        if (customer?.address) doc.text(`${customer.address}`);
        if (customer?.gstNumber) doc.text(`GST: ${customer.gstNumber}`);
        doc.moveDown();

        doc.text(`Service Details:`);
        doc.text(`Service: ${service?.name} (${service?.category})`);
        doc.text(`Duration: ${sub?.startDate} to ${sub?.endDate}`);
        doc.moveDown();

        doc.text(`Amount Paid: Rs. ${payment.amount}`);
        doc.moveDown(2);
        doc.text('Thank you for your business!', { align: 'center' });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  async getInvoiceUrl(paymentId: string) {
    const fileName = `invoice_${paymentId}.pdf`;
    try {
      const url = await this.storageService.getSignedUrl('invoices', fileName);
      return { url };
    } catch {
      throw new NotFoundException('Invoice not found. Ensure payment is successful.');
    }
  }

  async remove(id: string, user?: AuthenticatedUser) {
    const payment = await this.paymentRepo.findOne({ 
      where: { id },
      relations: ['subscription', 'subscription.customer'] 
    });
    
    if (!payment) throw new NotFoundException(`Payment with ID ${id} not found`);

    if (user && user.role === 'provider') {
      if (payment.subscription?.customer?.companyId !== user.companyId) {
        throw new BadRequestException('You do not have permission to delete this payment');
      }
    }

    await this.paymentRepo.remove(payment);
    return { success: true, message: 'Payment record deleted' };
  }

  private async sendPaymentConfirmation(paymentId: string) {
    const payment = await this.paymentRepo.findOne({
      where: { id: paymentId },
      relations: ['subscription', 'subscription.customer', 'subscription.service'],
    });

    if (!payment || !payment.subscription?.customer) return;

    const sub = payment.subscription;
    const variables = {
      customer_name: sub.customer?.name || '',
      customer_email: sub.customer?.email || '',
      customer_phone: sub.customer?.phone || '',
      service_name: sub.service?.name || '',
      amount: String(payment.amount),
      transaction_id: payment.transactionId || 'N/A',
      paid_at: payment.paidAt?.toLocaleDateString() || '',
    };

    const jobs = [NotificationChannel.EMAIL, NotificationChannel.SMS].map(channel => {
      return {
        name: channel === NotificationChannel.EMAIL ? NotificationJobType.SEND_EMAIL : NotificationJobType.SEND_SMS,
        data: {
          subscriptionId: sub.id,
          customerId: sub.customerId,
          channel,
          templateType: NotificationTemplateType.PAYMENT_SUCCESS,
          variables,
        } as NotificationJobPayload,
      };
    });

    await this.notificationQueue.addBulk(jobs);
    this.logger.log(`Queued Payment Success confirmation for payment ${paymentId}`);
  }

  async findAll(page: number, limit: number, search?: string, status?: string, from?: string, to?: string, user?: AuthenticatedUser) {
    this.logger.log(`Fetching payments. Page: ${page}, Limit: ${limit}, Search: ${search}, Range: [${from} - ${to}]`);
    
    const query = this.paymentRepo.createQueryBuilder('payment')
      .leftJoinAndSelect('payment.subscription', 'subscription')
      .leftJoinAndSelect('subscription.customer', 'customer')
      .leftJoinAndSelect('subscription.service', 'service');

    if (status) {
      query.where('payment.status = :status', { status });
    } else {
      query.where('payment.status = :defaultStatus', { defaultStatus: PaymentRecordStatus.SUCCESS });
    }

    if (user && user.role !== 'admin') {
      if (user.role === 'provider' && user.companyId) {
        query.andWhere('customer.company_id = :companyId', { companyId: user.companyId });
      } else if (user.role === 'customer') {
        query.andWhere('customer.user_id = :userId', { userId: user.id });
      }
    }

    if (search) {
      query.andWhere(
        '(customer.name ILIKE :search OR customer.email ILIKE :search OR customer.phone ILIKE :search OR payment.transactionId ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      toDate.setUTCHours(23, 59, 59, 999);
      query.andWhere('payment.paidAt BETWEEN :from AND :to', { from: fromDate, to: toDate });
    }

    query.orderBy('payment.paidAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [payments, total] = await query.getManyAndCount();

    return {
      data: payments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getMyHistory(userId: string) {
    const customer = await this.customerRepo.findOne({ where: { userId } });
    if (!customer) return { payments: [] };

    const payments = await this.paymentRepo.createQueryBuilder('payment')
      .innerJoin('payment.subscription', 'sub')
      .where('sub.customerId = :customerId', { customerId: customer.id })
      .orderBy('payment.createdAt', 'DESC')
      .getMany();

    return { payments };
  }
}
