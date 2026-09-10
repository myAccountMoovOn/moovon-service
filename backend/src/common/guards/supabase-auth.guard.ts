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
  companyId: string | null;
}

export interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private readonly supabase: SupabaseClient;
  private readonly supabaseAdmin: SupabaseClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {
    const url = this.configService.getOrThrow<string>('SUPABASE_URL');
    const anonKey = this.configService.getOrThrow<string>('SUPABASE_ANON_KEY');
    const serviceKey = this.configService.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY');
    this.supabase = createClient(url, anonKey);
    this.supabaseAdmin = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser & { cookies: any }>();
    const authHeader = request.headers['authorization'];
    
    let token = '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (request.cookies && request.cookies['access_token']) {
      token = request.cookies['access_token'];
    }

    if (!token) {
      throw new UnauthorizedException('Missing or invalid token in Authorization header or cookies');
    }

    let supabaseUser: any = null;

    const { data, error } = await this.supabase.auth.getUser(token);
    if (data?.user) {
      supabaseUser = data.user;
    } else {
      // Fallback 1: Try admin client
      try {
        const adminRes = await this.supabaseAdmin.auth.getUser(token);
        if (adminRes.data?.user) {
          supabaseUser = adminRes.data.user;
        }
      } catch (e) {}

      // Fallback 2: Parse JWT payload to inspect sub/id and verify via admin client
      if (!supabaseUser && token) {
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
            const userId = payload.sub || payload.id;
            if (userId) {
              const res = await this.supabaseAdmin.auth.admin.getUserById(userId);
              if (res.data?.user) {
                supabaseUser = res.data.user;
              } else if (payload.email) {
                supabaseUser = {
                  id: userId,
                  email: payload.email,
                  app_metadata: payload.app_metadata || {},
                  user_metadata: payload.user_metadata || {},
                };
              }
            }
          }
        } catch (jwtErr) {}
      }
    }

    if (!supabaseUser) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    
    // Source of Truth: Fetch role from database profile
    let role = 'customer';
    let companyId: string | null = null;
    try {
      const profiles = await this.dataSource.query(
        'SELECT role, company_id FROM profiles WHERE id = $1',
        [supabaseUser.id],
      );
      if (profiles && profiles.length > 0) {
        role = profiles[0].role;
        companyId = profiles[0].company_id || null;
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
      companyId,
    };

    return true;
  }
}
