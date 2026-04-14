import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLoggerService } from '../audit-logger.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger('AuditInterceptor');

  constructor(private readonly auditLogger: AuditLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const user = request.user; // Set by SupabaseAuthGuard
    const path = request.url;

    // Only log modifying actions by admins
    const isModifying = ['POST', 'PATCH', 'DELETE', 'PUT'].includes(method);
    const isAdmin = user && user.role === 'admin';

    if (!isModifying || !isAdmin) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(() => {
        const action = `${method} ${path}`;
        const entityType = path.split('/')[2] || 'unknown'; // Rough guess from URL e.g. /api/v1/customers
        
        this.auditLogger.log(
          user.id,
          action,
          entityType,
          null, // entityId can be complex to extract generically, can be improved
          { body: request.body }
        ).catch((err: any) => this.logger.error(`Failed to log audit: ${err.message}`));
      }),
    );
  }
}
