import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Profile, UserRole } from './entities/profile.entity';
import { Customer } from '../customers/entities/customer.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly supabaseAdmin: SupabaseClient;
  private readonly supabaseAnon: SupabaseClient;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
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
    const { data, error } = await this.supabaseAnon.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const profile = await this.profileRepository.findOne({
      where: { id: data.user.id },
    });

    return {
      session: data.session,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: profile?.role ?? UserRole.CUSTOMER,
      },
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

  async sendEmailOtp(email: string) {
    this.logger.log(`Requesting Email OTP for ${email}`);
    const { data, error } = await this.supabaseAnon.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false, // User must already exist as a Customer
      },
    });

    if (error) {
      this.logger.error(`Failed to send Email OTP: ${error.message}`);
      throw new Error(`Failed to send OTP: ${error.message}`);
    }

    return { message: 'OTP sent successfully to your email' };
  }

  async verifyOtp(email: string, token: string) {
    this.logger.log(`Verifying OTP for ${email}`);
    const { data, error } = await this.supabaseAnon.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error || !data.user || !data.session) {
      this.logger.error(`Failed to verify OTP: ${error?.message ?? 'Invalid user or session'}`);
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    const profile = await this.profileRepository.findOne({
      where: { id: data.user.id },
    });

    return {
      session: data.session,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: profile?.role ?? UserRole.CUSTOMER,
      },
    };
  }
}
