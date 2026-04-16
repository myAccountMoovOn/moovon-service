import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto) {
    const existing = await this.categoryRepo.findOne({ where: { name: dto.name } });
    if (existing) {
      throw new ConflictException(`Category with name "${dto.name}" already exists`);
    }
    const category = this.categoryRepo.create(dto);
    return this.categoryRepo.save(category);
  }

  async findAll() {
    return this.categoryRepo.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    
    if (dto.name && dto.name !== category.name) {
      const existing = await this.categoryRepo.findOne({ where: { name: dto.name } });
      if (existing) {
        throw new ConflictException(`Category with name "${dto.name}" already exists`);
      }
    }

    Object.assign(category, dto);
    return this.categoryRepo.save(category);
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    return this.categoryRepo.remove(category);
  }
}
