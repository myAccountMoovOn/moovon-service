import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as nodemailer from 'nodemailer';
import { Profile, UserRole } from './entities/profile.entity';
import { Customer } from '../customers/entities/customer.entity';
import { Company } from '../companies/entities/company.entity';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly supabaseAdmin: SupabaseClient;
  private readonly supabaseAnon: SupabaseClient;
  
  // Custom in-memory cache for 2FA OTPs
  private otpCache = new Map<string, { otp: string, session: any, expiresAt: number }>();
  
  // Custom in-memory cache for Signup Flow
  private signupCache = new Map<string, { 
    otp: string, 
    dto: any, 
    type: 'provider' | 'customer', 
    expiresAt: number 
  }>();

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly companiesService: CompaniesService,
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

  async login(email: string, password: string) {
    // 1. Verify the password to get the Supabase session
    const { data, error } = await this.supabaseAnon.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Generate a custom 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // 3. Lock the session in memory. We DO NOT sign them out so the session remains valid,
    // but we DO NOT return it to the frontend either.
    this.otpCache.set(email, { otp, session: data.session, expiresAt });

    // 4. Send the OTP via Custom SMTP
    await this.sendCustomEmailOtp(email, otp);

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
  ): Promise<string> {
    const { data, error } = await this.supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role },
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

  async registerProviderStep1(dto: import('./dto/auth.dto').RegisterProviderDto) {
    // 1. Generate a custom 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // 2. Lock the signup data in memory
    this.signupCache.set(dto.email, { otp, dto, type: 'provider', expiresAt });

    // 3. Send the OTP
    await this.sendCustomEmailOtp(dto.email, otp);

    return { message: 'OTP sent to email. Please verify to complete registration.' };
  }

  async registerCustomerStep1(dto: import('./dto/auth.dto').RegisterCustomerDto) {
    // 1. Validate company code first so we don't send OTP if it's invalid
    await this.companiesService.findByCode(dto.companyCode);

    // 2. Generate a custom 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // 3. Lock the signup data in memory
    this.signupCache.set(dto.email, { otp, dto, type: 'customer', expiresAt });

    // 4. Send the OTP
    await this.sendCustomEmailOtp(dto.email, otp);

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

    if (type === 'provider') {
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
    return {
      message: result.message,
      companyCode: result.companyCode,
      companyName: result.companyName,
      session,
      user: {
        id: session.user.id,
        email: session.user.email,
        role: type === 'provider' ? UserRole.PROVIDER : UserRole.CUSTOMER,
      },
    };
  }

  // Internal actual registration logic (now private or kept public for testing, but typically only called by verifySignup)
  async registerProvider(dto: import('./dto/auth.dto').RegisterProviderDto) {
    const userId = await this.createSupabaseUser(dto.email, dto.password, UserRole.PROVIDER);
    
    // Create the company
    const company = await this.companiesService.create(dto.companyName);

    // Update profile with companyId
    await this.profileRepository.update({ id: userId }, { companyId: company.id });

    return { message: 'Provider registered successfully', companyCode: company.code, companyName: company.name };
  }

  async registerCustomer(dto: import('./dto/auth.dto').RegisterCustomerDto) {
    const company = await this.companiesService.findByCode(dto.companyCode);

    const userId = await this.createSupabaseUser(dto.email, dto.password, UserRole.CUSTOMER);
    
    // Update profile with companyId
    await this.profileRepository.update({ id: userId }, { companyId: company.id });

    // Create customer record
    const customer = this.customerRepository.create({
      userId,
      companyId: company.id,
      name: dto.name,
      phone: dto.phone,
      email: dto.email,
    });
    await this.customerRepository.save(customer);

    return { message: 'Customer registered successfully', companyName: company.name };
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
    const customer = await this.customerRepository.findOne({
      where: { userId },
    });
    return { profile, customer };
  }

  async updateProfile(userId: string, data: Partial<Customer>) {
    const customer = await this.customerRepository.findOne({
      where: { userId },
    });
    if (!customer) {
      throw new Error('Customer record not found for this user');
    }
    // Only allow updating certain fields for safety
    const { name, phone, address, companyName, gstNumber } = data;
    Object.assign(customer, { name, phone, address, companyName, gstNumber });
    return this.customerRepository.save(customer);
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

  async sendCustomEmailOtp(email: string, otp: string) {
    this.logger.log(`Requesting Custom SMTP OTP for ${email}`);
    
    const host = this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com';
    // Use parseInt to ensure we get a number, matching the ICA project
    const port = parseInt(this.configService.get<string>('SMTP_PORT') || '587', 10);
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (!pass) {
      this.logger.warn(`[DEV MODE] SMTP not configured. OTP for ${email} is: ${otp}`);
      return { message: 'OTP logged to console (dev mode)' };
    }

    // Create fresh transporter per request to avoid timeout/ETIMEDOUT issues
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // True for 465, false for 587 (Standard ICA logic)
      auth: {
        user,
        pass,
      },
    });

    try {
      await transporter.sendMail({
        from: this.configService.get<string>('SMTP_FROM') || `"Moovon Admin" <${user}>`,
        to: email,
        subject: 'Your Moovon Verification Code',
        text: `Your 6-digit verification code is: ${otp}. It expires in 10 minutes.`,
        html: `<b>Your 6-digit verification code is: ${otp}</b><br/>It expires in 10 minutes.`,
      });
      return { message: 'OTP sent successfully to your email' };
    } catch (error: any) {
      this.logger.error(`Failed to send Custom SMTP OTP: ${error.message}`);
      throw new Error(`Failed to send OTP email: ${error.message}`);
    }
  }

  async verifyOtp(email: string, token: string) {
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
    });

    return {
      session,
      user: {
        id: session.user.id,
        email: session.user.email,
        role: profile?.role ?? UserRole.CUSTOMER,
      },
    };
  }
}
