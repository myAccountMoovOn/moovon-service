import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { AuthenticatedUser } from '../common/guards/supabase-auth.guard';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto, user: AuthenticatedUser) {
    const companyId = user.role === 'provider' ? user.companyId : null;
    const existing = await this.categoryRepo.findOne({ where: { name: dto.name, companyId: companyId as any } });
    if (existing) {
      throw new ConflictException(`Category with name "${dto.name}" already exists`);
    }
    const category = this.categoryRepo.create({
      ...dto,
      companyId,
    });
    return this.categoryRepo.save(category);
  }

  async findAll(user: AuthenticatedUser) {
    const query: any = {};
    if (user.role === 'provider') {
      query.companyId = user.companyId;
    }
    return this.categoryRepo.find({
      where: query,
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string, user: AuthenticatedUser) {
    const query: any = { id };
    if (user.role === 'provider') {
      query.companyId = user.companyId;
    }
    const category = await this.categoryRepo.findOne({ where: query });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto, user: AuthenticatedUser) {
    const category = await this.findOne(id, user);
    
    if (dto.name && dto.name !== category.name) {
      const companyId = user.role === 'provider' ? user.companyId : null;
      const existing = await this.categoryRepo.findOne({ where: { name: dto.name, companyId: companyId as any } });
      if (existing) {
        throw new ConflictException(`Category with name "${dto.name}" already exists`);
      }
    }

    Object.assign(category, dto);
    return this.categoryRepo.save(category);
  }

  async remove(id: string, user: AuthenticatedUser) {
    const category = await this.findOne(id, user);
    return this.categoryRepo.remove(category);
  }
}
