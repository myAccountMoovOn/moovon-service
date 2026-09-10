import { Injectable, UnauthorizedException, Logger, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as nodemailer from 'nodemailer';
import { Profile, UserRole } from './entities/profile.entity';
import { Customer } from '../customers/entities/customer.entity';
import { Company } from '../companies/entities/company.entity';
import { CompaniesService } from '../companies/companies.service';
import { EmailTemplateService } from '../common/email-template.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly supabaseAdmin: SupabaseClient;
  private readonly supabaseAnon: SupabaseClient;
  
  // Custom in-memory cache for 2FA OTPs
  private otpCache = new Map<string, { otp: string, session: any, expiresAt: number }>();
  
  // Custom in-memory cache for Forgot Password Flow
  private forgotPasswordCache = new Map<string, { otp: string; expiresAt: number }>();

  // Custom in-memory cache for Signup Flow
  private signupCache = new Map<string, { 
    otp: string, 
    dto: any, 
    type: 'reseller' | 'provider' | 'customer', 
    expiresAt: number 
  }>();

  // Custom in-memory cache for Password Reset
  private resetCache = new Map<string, { otp: string, userId: string, expiresAt: number }>();

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly companiesService: CompaniesService,
    private readonly emailTemplateService: EmailTemplateService,
  ) {
    const url = this.configService.getOrThrow<string>('SUPABASE_URL');
    const serviceKey = this.configService.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY');
    const anonKey = this.configService.getOrThrow<string>('SUPABASE_ANON_KEY');

    // Admin client — never expose to frontend
    this.supabaseAdmin = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Anon client — for user-facing auth operations
    this.supabaseAnon = createClient(url, anonKey);
  }

  getAdminClient(): SupabaseClient {
    return this.supabaseAdmin;
  }

  async login(email: string, password: string, portal?: string) {
    // 1. Verify the password to get the Supabase session
    const { data, error } = await this.supabaseAnon.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get user profile to check role and find companyId
    const profile = await this.profileRepository.findOne({ where: { id: data.user.id } });
    const userRole = (
      profile?.role ||
      data.user.user_metadata?.role ||
      data.user.app_metadata?.role ||
      'customer'
    ).toString().toLowerCase();

    // Portal isolation check:
    if (portal === 'main') {
      // Main domain (localhost:5173/login) is strictly for Super Admin / Admin
      if (userRole !== 'super_admin' && userRole !== 'admin') {
        throw new UnauthorizedException('User not exist');
      }
    } else if (portal === 'reseller') {
      if (userRole !== 'reseller') {
        throw new UnauthorizedException('User not exist');
      }
    } else if (portal === 'company') {
      if (userRole !== 'provider' && userRole !== 'company') {
        throw new UnauthorizedException('User not exist');
      }
    }

    // 2. Generate a custom 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // 3. Lock the session in memory.
    this.otpCache.set(email, { otp, session: data.session, expiresAt });
    
    // 4. Send the OTP via Custom SMTP
    await this.sendCustomEmailOtp(email, otp, profile?.companyId);

    return {
      requireOtp: true,
      message: 'Password verified. Custom OTP sent to email.',
    };
  }

  async refresh(refreshToken: string) {
    const { data, error } = await this.supabaseAnon.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return { session: data.session };
  }

  async logout(accessToken: string) {
    const { error } = await this.supabaseAdmin.auth.admin.signOut(accessToken);
    if (error) {
      this.logger.warn(`Logout warning: ${error.message}`);
    }
    return { message: 'Logged out successfully' };
  }

  async createSupabaseUser(
    email: string,
    password: string,
    role: UserRole,
    name?: string,
    phone?: string,
  ): Promise<string> {
    const { data, error } = await this.supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role, name, phone, full_name: name },
      app_metadata: { role },
    });

    if (error || !data.user) {
      throw new Error(`Failed to create Supabase auth user: ${error?.message ?? 'unknown error'}`);
    }

    // Create profile record
    const profile = this.profileRepository.create({
      id: data.user.id,
      role,
    });
    await this.profileRepository.save(profile);

    return data.user.id;
  }

  async registerResellerStep1(dto: import('./dto/auth.dto').RegisterResellerDto) {
    // Check if user already exists
    const { data: { users }, error: checkError } = await this.supabaseAdmin.auth.admin.listUsers();
    if (!checkError && users) {
      const exists = users.find(u => u.email === dto.email);
      if (exists) {
        throw new UnauthorizedException('User with this email already exists.');
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    this.signupCache.set(dto.email, { otp, dto, type: 'reseller', expiresAt });

    try {
      await this.sendCustomEmailOtp(dto.email, otp);
    } catch (e: any) {
      this.signupCache.delete(dto.email);
      throw new InternalServerErrorException(e.message);
    }

    return { message: 'OTP sent to email. Please verify to complete registration.' };
  }

  async registerProviderStep1(dto: import('./dto/auth.dto').RegisterProviderDto) {
    // Validate reseller code if provided
    let resellerId = null;
    if (dto.resellerCode) {
      const reseller = await this.companiesService.findByCode(dto.resellerCode);
      if (!reseller.isReseller) {
        throw new InternalServerErrorException('Invalid Reseller Code');
      }
      resellerId = reseller.id;
    }

    // Check if user already exists
    const { data: { users }, error: checkError } = await this.supabaseAdmin.auth.admin.listUsers();
    if (!checkError && users) {
      const exists = users.find(u => u.email === dto.email);
      if (exists) {
        throw new UnauthorizedException('User with this email already exists.');
      }
    }

    // 1. Generate a custom 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // 3. Lock the signup data in memory
    this.signupCache.set(dto.email, { otp, dto, type: 'provider', expiresAt });

    // 4. Send the OTP
    try {
      await this.sendCustomEmailOtp(dto.email, otp, resellerId);
    } catch (e: any) {
      this.signupCache.delete(dto.email);
      throw new InternalServerErrorException(e.message);
    }

    return { message: 'OTP sent to email. Please verify to complete registration.' };
  }

  async registerCustomerStep1(dto: import('./dto/auth.dto').RegisterCustomerDto) {
    let companyId: string | undefined = undefined;
    if (dto.companyCode) {
      const company = await this.companiesService.findByCode(dto.companyCode);
      companyId = company?.id;
    }

    // 2. Generate a custom 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // 3. Lock the signup data in memory
    this.signupCache.set(dto.email, { otp, dto, type: 'customer', expiresAt });

    // 4. Send the OTP
    try {
      await this.sendCustomEmailOtp(dto.email, otp, companyId);
    } catch (e: any) {
      this.signupCache.delete(dto.email);
      throw new InternalServerErrorException(e.message);
    }

    return { message: 'OTP sent to email. Please verify to complete registration.' };
  }

  async verifySignup(email: string, token: string) {
    this.logger.log(`Verifying Signup OTP for ${email}`);
    
    const cached = this.signupCache.get(email);
    
    if (!cached) {
      throw new UnauthorizedException('No pending signup request found for this email');
    }

    if (Date.now() > cached.expiresAt) {
      this.signupCache.delete(email);
      throw new UnauthorizedException('OTP has expired. Please signup again.');
    }

    if (cached.otp !== token) {
      throw new UnauthorizedException('Invalid OTP code');
    }

    // OTP is valid! Let's perform the actual registration
    const { dto, type } = cached;
    let result: any;

    if (type === 'reseller') {
      result = await this.registerReseller(dto);
    } else if (type === 'provider') {
      result = await this.registerProvider(dto);
    } else {
      result = await this.registerCustomer(dto);
    }

    // Clean up cache
    this.signupCache.delete(email);
    
    // Automatically log the user in after registration so they don't have to enter the password again
    const { data, error } = await this.supabaseAnon.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error || !data.session) {
      throw new Error('User created successfully, but auto-login failed. Please login manually.');
    }

    const session = data.session;
    const profile = await this.profileRepository.findOne({
      where: { id: session.user.id },
      relations: ['company'],
    });
    const customer = await this.customerRepository.findOne({
      where: { userId: session.user.id },
    });

    const resolvedCompanyName = profile?.company?.name || result.companyName || customer?.companyName || (dto as any)?.companyName || '';

    return {
      message: result.message,
      companyCode: result.companyCode,
      companyName: resolvedCompanyName,
      session,
      user: {
        id: session.user.id,
        email: session.user.email,
        role: type === 'reseller' ? UserRole.RESELLER : (type === 'provider' ? UserRole.PROVIDER : UserRole.CUSTOMER),
        name: customer?.name || dto.name || '',
        phone: customer?.phone || dto.phone || '',
        companyName: resolvedCompanyName,
        address: customer?.address || '',
        gstNumber: customer?.gstNumber || '',
      },
    };
  }

  async forgotPassword(email: string) {
    this.logger.log(`Requesting Forgot Password OTP for ${email}`);
    
    // Check if user exists in Supabase
    const { data: { users }, error } = await this.supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    
    if (error || !users) {
      throw new InternalServerErrorException('Error validating account');
    }

    const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new NotFoundException('No account found with this email address.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    this.forgotPasswordCache.set(email.toLowerCase(), { otp, expiresAt });
    this.logger.log(`🔑 [FORGOT PASSWORD OTP] Email: ${email} | Code: ${otp}`);

    await this.sendCustomEmailOtp(email, otp);

    return { message: 'Password reset OTP code sent to your email.' };
  }

  async resetPassword(dto: import('./dto/auth.dto').ResetPasswordDto) {
    const emailKey = dto.email.toLowerCase();
    const cached = this.forgotPasswordCache.get(emailKey);

    if (!cached) {
      throw new UnauthorizedException('No pending password reset request found for this email.');
    }

    if (Date.now() > cached.expiresAt) {
      this.forgotPasswordCache.delete(emailKey);
      throw new UnauthorizedException('OTP has expired. Please request a new password reset.');
    }

    if (cached.otp !== dto.token) {
      throw new UnauthorizedException('Invalid OTP verification code.');
    }

    // OTP is valid, locate user in Supabase
    const { data: { users } } = await this.supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    const user = users?.find(u => u.email?.toLowerCase() === emailKey);

    if (!user) {
      throw new NotFoundException('User account not found.');
    }

    const { error: updateError } = await this.supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: dto.newPassword },
    );

    if (updateError) {
      throw new InternalServerErrorException(`Failed to update password: ${updateError.message}`);
    }

    this.forgotPasswordCache.delete(emailKey);
    this.logger.log(`🎉 Password reset completed for ${dto.email}`);

    return { message: 'Password reset successfully. You can now login with your new password.' };
  }

  // Internal actual registration logic (now private or kept public for testing, but typically only called by verifySignup)
  async registerReseller(dto: import('./dto/auth.dto').RegisterResellerDto) {
    const userId = await this.createSupabaseUser(dto.email, dto.password, UserRole.RESELLER);
    
    // Create the company (isReseller = true)
    const company = await this.companiesService.create(dto.companyName, undefined, true);

    // Update profile with companyId
    await this.profileRepository.update({ id: userId }, { companyId: company.id });

    return { message: 'Reseller registered successfully', companyCode: company.code, companyName: company.name };
  }

  async registerProvider(dto: import('./dto/auth.dto').RegisterProviderDto) {
    const userId = await this.createSupabaseUser(dto.email, dto.password, UserRole.PROVIDER);
    
    let resellerId = null;
    if (dto.resellerCode) {
      const reseller = await this.companiesService.findByCode(dto.resellerCode);
      resellerId = reseller.id;
    }

    // Create the company (isReseller = false) linked to resellerId
    const company = await this.companiesService.create(dto.companyName, undefined, false, resellerId);

    // Update profile with companyId
    await this.profileRepository.update({ id: userId }, { companyId: company.id });

    return { message: 'Business registered successfully', companyCode: company.code, companyName: company.name };
  }

  async registerCustomer(dto: import('./dto/auth.dto').RegisterCustomerDto) {
    let companyId: string | null = null;
    let companyName = '';
    if (dto.companyCode) {
      const company = await this.companiesService.findByCode(dto.companyCode);
      companyId = company?.id || null;
      companyName = company?.name || '';
    }

    const userId = await this.createSupabaseUser(dto.email, dto.password, UserRole.CUSTOMER, dto.name, dto.phone);
    
    // Update profile with companyId if present
    if (companyId) {
      await this.profileRepository.update({ id: userId }, { companyId });
    }

    // Create customer record with name, phone, email
    const customer = this.customerRepository.create({
      userId,
      companyId: companyId || undefined,
      name: dto.name,
      phone: dto.phone,
      email: dto.email,
    });
    await this.customerRepository.save(customer);

    return { message: 'Customer registered successfully', companyName };
  }

  async deleteSupabaseUser(userId: string): Promise<void> {
    const { error } = await this.supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) {
      this.logger.warn(`Failed to delete Supabase user ${userId}: ${error.message}`);
    }
  }

  async getMe(userId: string) {
    const profile = await this.profileRepository.findOne({
      where: { id: userId },
    });
    let customer = await this.customerRepository.findOne({
      where: { userId },
    });

    if (!customer) {
      try {
        const sbUser = await this.supabaseAdmin.auth.admin.getUserById(userId);
        const email = sbUser.data?.user?.email;
        if (email) {
          customer = await this.customerRepository.findOne({
            where: { email },
          });
          if (customer && !customer.userId) {
            customer.userId = userId;
            await this.customerRepository.save(customer);
          }
        }
      } catch (e) {}
    }

    return { profile, customer };
  }

  async updateProfile(userId: string, data: Partial<Customer>) {
    let customer = await this.customerRepository.findOne({
      where: { userId },
    });

    if (!customer) {
      try {
        const sbUser = await this.supabaseAdmin.auth.admin.getUserById(userId);
        const email = sbUser.data?.user?.email;
        if (email) {
          customer = await this.customerRepository.findOne({
            where: { email },
          });
        }

        if (!customer && email) {
          customer = this.customerRepository.create({
            userId,
            email,
            name: data.name || sbUser.data?.user?.user_metadata?.name || 'Customer',
            phone: data.phone || sbUser.data?.user?.user_metadata?.phone || '',
          });
        }
      } catch (e) {}
    }

    if (!customer) {
      throw new InternalServerErrorException('Customer record could not be found or initialized');
    }

    customer.userId = userId;

    const { name, phone, address, companyName, gstNumber } = data;
    if (name !== undefined) customer.name = name;
    if (phone !== undefined) customer.phone = phone;
    if (address !== undefined) customer.address = address;
    if (companyName !== undefined) customer.companyName = companyName;
    if (gstNumber !== undefined) customer.gstNumber = gstNumber;

    const saved = await this.customerRepository.save(customer);

    if (name || phone) {
      try {
        await this.supabaseAdmin.auth.admin.updateUserById(userId, {
          user_metadata: { name, phone, full_name: name },
        });
      } catch (e) {
        this.logger.warn(`Failed to sync user_metadata in Supabase: ${e}`);
      }
    }

    return saved;
  }

  async changePassword(userId: string, newPassword: string) {
    const { error } = await this.supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword,
    });
    if (error) {
      throw new Error(`Failed to change password: ${error.message}`);
    }
    return { message: 'Password updated successfully' };
  }

  async forgotPasswordStep1(email: string) {
    // Check if user exists
    const { data: { users }, error: checkError } = await this.supabaseAdmin.auth.admin.listUsers();
    if (checkError || !users) {
      throw new InternalServerErrorException('Failed to check user existence');
    }
    const user = users.find(u => u.email === email);
    if (!user) {
      // Return success even if not found to prevent email enumeration, or throw error based on preference
      throw new UnauthorizedException('User with this email not found.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    this.resetCache.set(email, { otp, userId: user.id, expiresAt });

    try {
      await this.sendCustomEmailOtp(email, otp);
    } catch (e: any) {
      this.resetCache.delete(email);
      throw new InternalServerErrorException(e.message);
    }

    return { message: 'Password reset OTP sent to your email.' };
  }

  async forgotPasswordStep2(dto: import('./dto/auth.dto').ResetPasswordDto) {
    const cached = this.resetCache.get(dto.email);
    if (!cached) {
      throw new UnauthorizedException('No pending password reset request found for this email');
    }

    if (Date.now() > cached.expiresAt) {
      this.resetCache.delete(dto.email);
      throw new UnauthorizedException('OTP has expired. Please request a new password reset.');
    }

    if (cached.otp !== dto.token) {
      throw new UnauthorizedException('Invalid OTP code');
    }

    // Reset the password
    const { error } = await this.supabaseAdmin.auth.admin.updateUserById(cached.userId, {
      password: dto.newPassword,
    });

    if (error) {
      throw new Error(`Failed to reset password: ${error.message}`);
    }

    // Clean up cache
    this.resetCache.delete(dto.email);

    return { message: 'Password has been successfully reset.' };
  }

  async sendCustomEmailOtp(email: string, otp: string, companyId?: string | null) {
    this.logger.log(`Requesting Custom SMTP OTP for ${email}`);
    this.logger.log(`🔑 [OTP GENERATED] Email: ${email} | Code: ${otp}`);
    
    let host = this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com';
    let port = parseInt(this.configService.get<string>('SMTP_PORT') || '587', 10);
    let user = this.configService.get<string>('SMTP_USER');
    let pass = this.configService.get<string>('SMTP_PASS');
    if (pass) {
      pass = pass.replace(/\s+/g, '');
    }
    let from = this.configService.get<string>('SMTP_FROM') || `"Moovon Admin" <${user}>`;
    let companyConfig = null;

    // Try to load company-specific SMTP config
    if (companyId) {
      const company = await this.companiesService.findOne(companyId);
      companyConfig = company;
      const customConfig = await this.companiesService.getSmtpConfig(companyId);
      // Only use company SMTP if it has all required fields configured
      if (customConfig && customConfig.host && customConfig.user && customConfig.pass) {
        host = customConfig.host;
        port = customConfig.port;
        user = customConfig.user;
        pass = customConfig.pass;
        from = `"${customConfig.fromName || 'Admin'}" <${customConfig.fromEmail || user}>`;
        this.logger.log(`Using custom SMTP for company ${companyId}`);
      } else {
        this.logger.log(`Company ${companyId} has no complete SMTP config — falling back to default SMTP`);
      }
    }

    if (!pass) {
      this.logger.warn(`[DEV MODE] SMTP not configured. OTP for ${email} is: ${otp}`);
      return { message: 'OTP logged to console (dev mode)' };
    }

    // Create fresh transporter per request to avoid timeout/ETIMEDOUT issues
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      connectionTimeout: 10000,  // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    try {
      const htmlContent = this.emailTemplateService.generateOtpEmail(otp, companyConfig);
      
      // Send email asynchronously in the background so the frontend doesn't hang
      transporter.sendMail({
        from,
        to: email,
        subject: `${companyConfig?.appName || 'Moovon'} Verification Code`,
        text: `Your 6-digit verification code is: ${otp}. It expires in 10 minutes.`,
        html: htmlContent,
      }).catch(err => {
        this.logger.error(`Failed to send background SMTP OTP: ${err.message}`);
      });
      
      return { message: 'OTP sent successfully to your email' };
    } catch (error: any) {
      this.logger.error(`Failed to send Custom SMTP OTP: ${error.message}`);
      throw new Error(`Failed to send OTP email: ${error.message}`);
    }
  }

  async verifyOtp(email: string, token: string, portal?: string) {
    this.logger.log(`Verifying Custom OTP for ${email}`);
    
    const cached = this.otpCache.get(email);
    
    if (!cached) {
      throw new UnauthorizedException('No pending OTP request found for this email');
    }

    if (Date.now() > cached.expiresAt) {
      this.otpCache.delete(email);
      throw new UnauthorizedException('OTP has expired. Please login again.');
    }

    if (cached.otp !== token) {
      throw new UnauthorizedException('Invalid OTP code');
    }

    // OTP is valid! Retrieve the locked session
    const session = cached.session;
    this.otpCache.delete(email); // Clean up the cache

    const profile = await this.profileRepository.findOne({
      where: { id: session.user.id },
      relations: ['company'],
    });

    const userRole = (
      profile?.role ||
      session.user.user_metadata?.role ||
      session.user.app_metadata?.role ||
      'customer'
    ).toString().toLowerCase();

    // Portal isolation check:
    if (portal === 'main') {
      if (userRole !== 'super_admin' && userRole !== 'admin') {
        throw new UnauthorizedException('User not exist');
      }
    } else if (portal === 'reseller') {
      if (userRole !== 'reseller') {
        throw new UnauthorizedException('User not exist');
      }
    } else if (portal === 'company') {
      if (userRole !== 'provider' && userRole !== 'company') {
        throw new UnauthorizedException('User not exist');
      }
    }

    const customer = await this.customerRepository.findOne({
      where: { userId: session.user.id },
    });

    const resolvedCompanyName = profile?.company?.name || customer?.companyName || session.user.user_metadata?.companyName || '';

    return {
      session,
      user: {
        id: session.user.id,
        email: session.user.email,
        role: profile?.role ?? UserRole.CUSTOMER,
        name: customer?.name || session.user.user_metadata?.name || session.user.user_metadata?.full_name || '',
        phone: customer?.phone || session.user.user_metadata?.phone || '',
        companyName: resolvedCompanyName,
        companyCode: profile?.company?.code || '',
        address: customer?.address || '',
        gstNumber: customer?.gstNumber || '',
      },
    };
  }
}
