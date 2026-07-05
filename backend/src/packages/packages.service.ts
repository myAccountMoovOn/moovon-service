import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Package } from './entities/package.entity';
import { CreatePackageDto, UpdatePackageDto } from './dto/package.dto';
import { Service } from '../services-master/entities/service.entity';
import { AuthenticatedUser } from '../common/guards/supabase-auth.guard';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepo: Repository<Package>,
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
  ) {}

  async create(dto: CreatePackageDto) {
    const { serviceIds, ...packageData } = dto;
    const services = await this.serviceRepo.findBy({ id: In(serviceIds) });
    const pkg = this.packageRepo.create({
      ...packageData,
      services,
    });
    return this.packageRepo.save(pkg);
  }

  async findAll(serviceId?: string, user?: AuthenticatedUser) {
    const query = this.packageRepo.createQueryBuilder('pkg')
      .leftJoinAndSelect('pkg.services', 'services')
      .orderBy('pkg.createdAt', 'DESC');

    // Multi-tenancy: filter by companyId for non-admin users
    if (user && user.role !== 'admin' && user.companyId) {
      query.andWhere('pkg.company_id = :companyId', { companyId: user.companyId });
    }

    if (serviceId) {
      query.innerJoin('pkg.services', 'filteredService', 'filteredService.id = :serviceId', { serviceId });
    }

    return query.getMany();
  }

  async findOne(id: string) {
    const pkg = await this.packageRepo.findOne({
      where: { id },
      relations: ['services'],
    });
    if (!pkg) throw new NotFoundException(`Package with ID ${id} not found`);
    return pkg;
  }

  async update(id: string, dto: UpdatePackageDto, user?: AuthenticatedUser) {
    const pkg = await this.findOne(id);
    
    if (user && user.role === 'provider' && pkg.companyId !== user.companyId) {
      throw new ForbiddenException('You can only update packages belonging to your company');
    }

    const { serviceIds, ...packageData } = dto;
    
    if (serviceIds) {
      pkg.services = await this.serviceRepo.findBy({ id: In(serviceIds) });
    }
    
    Object.assign(pkg, packageData);
    return this.packageRepo.save(pkg);
  }

  async remove(id: string, user?: AuthenticatedUser) {
    const pkg = await this.findOne(id);

    if (user && user.role === 'provider' && pkg.companyId !== user.companyId) {
      throw new ForbiddenException('You can only delete packages belonging to your company');
    }

    await this.packageRepo.remove(pkg);
    return { success: true };
  }
}
