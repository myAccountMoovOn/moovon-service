import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  email: string | undefined;
  role: string;
}

export interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private readonly supabase: SupabaseClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {
    const url = this.configService.getOrThrow<string>('SUPABASE_URL');
    const anonKey = this.configService.getOrThrow<string>('SUPABASE_ANON_KEY');
    this.supabase = createClient(url, anonKey);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];

    const { data, error } = await this.supabase.auth.getUser(token);

    if (error || !data?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const supabaseUser: User = data.user;
    
    // Source of Truth: Fetch role from database profile
    let role = 'customer';
    try {
      const profiles = await this.dataSource.query(
        'SELECT role FROM profiles WHERE id = $1',
        [supabaseUser.id],
      );
      if (profiles && profiles.length > 0) {
        role = profiles[0].role;
      } else {
        // Fallback to metadata if DB record doesn't exist yet
        role = (supabaseUser.app_metadata?.['role'] as string | undefined) || 
               (supabaseUser.user_metadata?.['role'] as string | undefined) || 
               'customer';
      }
    } catch (dbError) {
      // Emergency fallback if DB query fails
      role = (supabaseUser.app_metadata?.['role'] as string | undefined) || 'customer';
    }

    request.user = {
      id: supabaseUser.id,
      email: supabaseUser.email,
      role,
    };

    return true;
  }
}
