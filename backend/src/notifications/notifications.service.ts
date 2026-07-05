import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import {
  NotificationLog,
  NotificationChannel,
  NotificationStatus,
  NotificationTemplateType,
} from './entities/notification-log.entity';
import { Template } from '../templates/entities/template.entity';
import { NotificationJobPayload } from '../queues/notification.queue';
import { Customer } from '../customers/entities/customer.entity';
import { AuthenticatedUser } from '../common/guards/supabase-auth.guard';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(NotificationLog)
    private readonly logRepo: Repository<NotificationLog>,
    @InjectRepository(Template)
    private readonly templateRepo: Repository<Template>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST', 'smtp.gmail.com'),
      port: this.configService.get<number>('SMTP_PORT', 587),
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });
  }

  async getCustomerByUserId(userId: string) {
    return this.customerRepo.findOne({ where: { userId } });
  }

  replaceVariables(template: string, variables: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(variables[key] ?? `{{${key}}}`));
  }

  async sendEmail(payload: NotificationJobPayload): Promise<void> {
    const log = await this.createLog(payload, NotificationChannel.EMAIL);

    try {
      // Check customer preferences
      if (payload.customerId) {
        const customer = await this.customerRepo.findOne({ where: { id: payload.customerId } });
        if (customer && customer.notificationEmail === false) {
          this.logger.log(`Skipping Email to customer ${payload.customerId} - Email notifications disabled`);
          await this.updateLog(log.id, NotificationStatus.FAILED, 'Email notifications disabled by customer preference');
          return;
        }
      }

      const template = await this.templateRepo.findOne({
        where: {
          type: payload.templateType as NotificationTemplateType,
          channel: NotificationChannel.EMAIL,
          isActive: true,
        },
      });

      const subject = template?.subject
        ? this.replaceVariables(template.subject, payload.variables)
        : `Notification from ${this.configService.get('COMPANY_NAME', 'Moovon Service')}`;

      const customerEmail = payload.variables['customer_email'];
      if (!customerEmail) {
        throw new Error('customer_email variable missing in job payload');
      }

      const html = this.renderHtml(
        payload.templateType as NotificationTemplateType,
        payload.variables,
        template?.body ? this.replaceVariables(template.body, payload.variables) : undefined
      );

      await this.transporter.sendMail({
        from: this.configService.get<string>('EMAIL_FROM'),
        to: customerEmail,
        subject,
        html,
      });

      await this.updateLog(log.id, NotificationStatus.SENT);
      this.logger.log(`Email sent to ${customerEmail} [template: ${payload.templateType}]`);
    } catch (error) {
      const err = error as Error;
      await this.updateLog(log.id, NotificationStatus.FAILED, err.message);
      throw error;
    }
  }

  async sendSms(payload: NotificationJobPayload): Promise<void> {
    const log = await this.createLog(payload, NotificationChannel.SMS);

    try {
      // Check customer preferences
      if (payload.customerId) {
        const customer = await this.customerRepo.findOne({ where: { id: payload.customerId } });
        if (customer && customer.notificationSms === false) {
          this.logger.log(`Skipping SMS to customer ${payload.customerId} - SMS notifications disabled`);
          await this.updateLog(log.id, NotificationStatus.FAILED, 'SMS notifications disabled by customer preference');
          return;
        }
      }

      const template = await this.templateRepo.findOne({
        where: {
          type: payload.templateType as NotificationTemplateType,
          channel: NotificationChannel.SMS,
          isActive: true,
        },
      });

      const message = template
        ? this.replaceVariables(template.body, payload.variables)
        : JSON.stringify(payload.variables);

      const phone = payload.variables['customer_phone'];
      if (!phone) throw new Error('customer_phone variable missing in job payload');

      const apiKey = this.configService.get<string>('SMS_API_KEY');
      const senderId = this.configService.get<string>('SMS_SENDER_ID', 'MOOVON');

      // MSG91 API call
      const url = `https://api.msg91.com/api/sendhttp.php?mobiles=${phone}&authkey=${apiKey}&route=4&sender=${senderId}&message=${encodeURIComponent(message)}&country=91`;
      const response = await fetch(url);
      const result = await response.text();

      if (!response.ok) {
        throw new Error(`SMS API error: ${result}`);
      }

      await this.updateLog(log.id, NotificationStatus.SENT);
      this.logger.log(`SMS sent to ${phone} [template: ${payload.templateType}]`);
    } catch (error) {
      const err = error as Error;
      await this.updateLog(log.id, NotificationStatus.FAILED, err.message);
      throw error;
    }
  }

  async getLogs(
    page: number,
    limit: number,
    channel?: NotificationChannel,
    status?: NotificationStatus,
    customerId?: string,
    user?: AuthenticatedUser,
  ) {
    const query = this.logRepo.createQueryBuilder('log')
      .leftJoinAndSelect('log.customer', 'customer')
      .orderBy('log.createdAt', 'DESC');

    if (channel) query.andWhere('log.channel = :channel', { channel });
    if (status) query.andWhere('log.status = :status', { status });
    if (customerId) query.andWhere('log.customerId = :customerId', { customerId });
    if (user && user.role === 'provider' && user.companyId) {
      query.andWhere('customer.company_id = :companyId', { companyId: user.companyId });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  private async createLog(
    payload: NotificationJobPayload,
    channel: NotificationChannel,
  ): Promise<NotificationLog> {
    const log = this.logRepo.create({
      subscriptionId: payload.subscriptionId,
      customerId: payload.customerId,
      channel,
      templateType: payload.templateType as NotificationTemplateType,
      status: NotificationStatus.PENDING,
    });
    return this.logRepo.save(log);
  }

  private async updateLog(
    id: string,
    status: NotificationStatus,
    errorMessage?: string,
  ): Promise<void> {
    await this.logRepo.update(id, {
      status,
      sentAt: status === NotificationStatus.SENT ? new Date() : undefined,
      errorMessage: errorMessage ?? null,
    });
  }

  private renderHtml(type: NotificationTemplateType, vars: Record<string, any>, customBody?: string): string {
    const primaryColor = '#1677ff'; // Moovon Blue
    const customerName = vars['customer_name'] || 'Customer';
    const serviceName = vars['service_name'] || 'Service';
    const amount = vars['amount'] ? `₹${Number(vars['amount']).toLocaleString()}` : null;
    const startDate = vars['start_date'] ? vars['start_date'] : null;
    const endDate = vars['end_date'] ? vars['end_date'] : 'Ongoing';
    const paymentLink = vars['payment_link'] || null;

    let title = 'Notification';
    let message = customBody || 'Here is an update regarding your service.';

    switch (type) {
      case NotificationTemplateType.NEW_SUBSCRIPTION:
        title = 'Subscription Activated';
        if (!customBody) message = `Welcome! Your subscription for <b>${serviceName}</b> has been activated. We're excited to serve you.`;
        break;
      case NotificationTemplateType.CUSTOMER_CREDENTIALS:
        title = 'Your Account Credentials';
        if (!customBody) message = `Your account has been created successfully. Below are your login details. Please keep them secure.`;
        break;
      case NotificationTemplateType.WELCOME:
        title = 'Welcome to Moovon';
        if (!customBody) message = `We're happy to have you on board! Your journey with Moovon Service starts today.`;
        break;
      case NotificationTemplateType.PAYMENT_REMINDER:
        title = 'Payment Due';
        if (!customBody) message = `This is a friendly reminder that the payment for your <b>${serviceName}</b> subscription is now due.`;
        break;
      case NotificationTemplateType.RENEWAL_REMINDER:
        title = 'Renewal Notice';
        if (!customBody) message = `Your subscription for <b>${serviceName}</b> is set to renew soon. Review your details below.`;
        break;
      case NotificationTemplateType.PAYMENT_SUCCESS:
        title = 'Payment Received';
        if (!customBody) message = `Thank you! We have successfully received your payment for <b>${serviceName}</b>. Your service continues uninterrupted.`;
        break;
      case NotificationTemplateType.LOGIN_OTP:
        title = 'Security Code';
        if (!customBody) message = `Use the following code to complete your login. This code is valid for 10 minutes.`;
        break;
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #2d3436; margin: 0; padding: 0; background-color: #f0f2f5; }
          .container { max-width: 550px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
          .header { background: ${primaryColor}; padding: 40px 20px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; }
          .content { padding: 40px; }
          .greeting { font-size: 20px; font-weight: 700; color: #1a1a1a; margin-bottom: 12px; }
          .message { font-size: 16px; color: #636e72; margin-bottom: 32px; }
          .card { background: #fafbfc; border: 1px solid #edf2f7; border-radius: 12px; padding: 24px; margin-bottom: 32px; position: relative; overflow: hidden; }
          .card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: ${primaryColor}; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid #f1f4f8; padding-bottom: 10px; }
          .detail-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
          .detail-label { color: #a0aec0; text-transform: uppercase; font-size: 10px; font-weight: 800; letter-spacing: 1px; }
          .detail-value { font-weight: 600; color: #2d3748; font-size: 14px; }
          .cta-box { text-align: center; margin-top: 20px; }
          .btn { background: ${primaryColor}; color: #ffffff !important; padding: 16px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; display: inline-block; box-shadow: 0 4px 14px rgba(22, 119, 255, 0.4); }
          .footer { padding: 30px; text-align: center; font-size: 12px; color: #b2bec3; background: #fafafa; border-top: 1px solid #f1f1f1; }
          .otp-code { font-size: 32px; font-weight: 800; color: ${primaryColor}; letter-spacing: 4px; text-align: center; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>MOOVON SERVICE</h1></div>
          <div class="content">
            <div class="greeting">Hello ${customerName},</div>
            <div class="message">${message}</div>
            
            ${type === NotificationTemplateType.LOGIN_OTP ? `
              <div class="otp-code">${vars['otp']}</div>
            ` : ''}

            ${(serviceName && (amount || startDate)) || vars['customer_password'] ? `
            <div class="card">
              ${vars['customer_email'] ? `<div class="detail-row"><span class="detail-label">Login Email</span><span class="detail-value">${vars['customer_email']}</span></div>` : ''}
              ${vars['customer_password'] ? `<div class="detail-row"><span class="detail-label">Password</span><span class="detail-value">${vars['customer_password']}</span></div>` : ''}
              ${serviceName && type !== NotificationTemplateType.CUSTOMER_CREDENTIALS ? `<div class="detail-row"><span class="detail-label">Service</span><span class="detail-value">${serviceName}</span></div>` : ''}
              ${amount ? `<div class="detail-row"><span class="detail-label">Agreed Price</span><span class="detail-value">${amount}</span></div>` : ''}
              ${startDate ? `<div class="detail-row"><span class="detail-label">Activation Period</span><span class="detail-value">${startDate} - ${endDate}</span></div>` : ''}
            </div>
            ` : ''}

            ${paymentLink ? `
            <div class="cta-box">
              <a href="${paymentLink}" class="btn">Complete Payment Now</a>
            </div>
            ` : ''}
          </div>
          <div class="footer">
            Cheers,<br>
            <b>The Moovon Service Team</b><br><br>
            This is an automated security notification.
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
