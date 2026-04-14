import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditLoggerService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
  ) {}

  async log(
    adminId: string,
    action: string,
    entityType: string,
    entityId: string | null = null,
    metadata: Record<string, any> | null = null,
  ) {
    const log = this.auditRepo.create({
      adminId,
      action,
      entityType,
      entityId,
      metadata,
    });
    return this.auditRepo.save(log);
  }
}
