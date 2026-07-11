import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { AuditLoggerService } from './audit-logger.service';
import { CryptoService } from './crypto.service';
import { EmailTemplateService } from './email-template.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  providers: [AuditLoggerService, CryptoService, EmailTemplateService],
  exports: [AuditLoggerService, CryptoService, EmailTemplateService],
})
export class CommonModule {}
