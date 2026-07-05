import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from './entities/template.entity';
import { CreateTemplateDto, UpdateTemplateDto } from './dto/template.dto';
import { AuthenticatedUser } from '../common/guards/supabase-auth.guard';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepo: Repository<Template>,
  ) {}

  async create(dto: CreateTemplateDto, user: AuthenticatedUser) {
    const template = this.templateRepo.create({
      ...dto,
      companyId: user.role === 'provider' ? user.companyId : null,
    });
    return this.templateRepo.save(template);
  }

  async findAll(user: AuthenticatedUser) {
    const query: any = {};
    if (user.role === 'provider') {
      query.companyId = user.companyId;
    }
    return this.templateRepo.find({
      where: query,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, user: AuthenticatedUser) {
    const query: any = { id };
    if (user.role === 'provider') {
      query.companyId = user.companyId;
    }
    const template = await this.templateRepo.findOne({ where: query });
    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }
    return template;
  }

  async update(id: string, dto: UpdateTemplateDto, user: AuthenticatedUser) {
    const template = await this.findOne(id, user);
    Object.assign(template, dto);
    return this.templateRepo.save(template);
  }

  async remove(id: string, user: AuthenticatedUser) {
    const template = await this.findOne(id, user);
    await this.templateRepo.remove(template);
    return { message: 'Template successfully deleted' };
  }
}
