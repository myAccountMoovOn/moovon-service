import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';
import { AuthenticatedUser } from '../common/guards/supabase-auth.guard';

@Injectable()
export class ServicesMasterService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
  ) {}

  async create(dto: CreateServiceDto) {
    const service = this.serviceRepo.create(dto);
    return this.serviceRepo.save(service);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    isActive?: boolean,
    pricingType?: string,
    durationType?: string,
    category?: string,
    from?: string,
    to?: string,
    categoryId?: string,
    user?: AuthenticatedUser,
  ) {
    const query = this.serviceRepo.createQueryBuilder('service')
      .leftJoinAndSelect('service.categoryRef', 'categoryRef');

    if (user && user.role !== 'admin' && user.role !== 'super_admin' && user.companyId) {
      query.andWhere('service.company_id = :companyId', { companyId: user.companyId });
    }

    if (search) {
      query.andWhere(
        '(service.name ILIKE :search OR service.category ILIKE :search OR categoryRef.name ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (isActive !== undefined) {
      query.andWhere('service.isActive = :isActive', { isActive });
    }

    if (pricingType) {
      query.andWhere('service.pricingType = :pricingType', { pricingType });
    }

    if (durationType) {
      query.andWhere('service.durationType = :durationType', { durationType });
    }

    if (category) {
      query.andWhere('(service.category ILIKE :category OR categoryRef.name ILIKE :category)', {
        category: `%${category}%`,
      });
    }

    if (categoryId) {
      query.andWhere('service.categoryId = :categoryId', { categoryId });
    }

    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      toDate.setUTCHours(23, 59, 59, 999);
      query.andWhere('service.createdAt BETWEEN :from AND :to', { from: fromDate, to: toDate });
    }

    query.orderBy('service.createdAt', 'DESC');
    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const service = await this.serviceRepo.findOne({ 
      where: { id },
      relations: ['categoryRef', 'subscriptions'] 
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async update(id: string, dto: UpdateServiceDto, user?: AuthenticatedUser) {
    const service = await this.findOne(id);
    
    if (user && user.role === 'provider' && service.companyId !== user.companyId) {
      throw new ForbiddenException('You can only update services belonging to your company');
    }

    Object.assign(service, dto);
    return this.serviceRepo.save(service);
  }

  async remove(id: string, user?: AuthenticatedUser) {
    const service = await this.serviceRepo.findOne({
      where: { id },
      relations: ['subscriptions'],
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    if (user && user.role === 'provider' && service.companyId !== user.companyId) {
      throw new ForbiddenException('You can only delete services belonging to your company');
    }

    if (service.subscriptions && service.subscriptions.length > 0) {
      service.isActive = false;
      await this.serviceRepo.save(service);
      return { 
        message: 'Service deactivated (soft delete) because it has existing subscriptions.',
        deleted: false 
      };
    }

    await this.serviceRepo.remove(service);
    return { 
      message: 'Service permanently deleted.',
      deleted: true 
    };
  }
}
