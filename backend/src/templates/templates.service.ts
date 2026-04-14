import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from './entities/template.entity';
import { CreateTemplateDto, UpdateTemplateDto } from './dto/template.dto';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepo: Repository<Template>,
  ) {}

  async create(dto: CreateTemplateDto) {
    const template = this.templateRepo.create(dto);
    return this.templateRepo.save(template);
  }

  async findAll() {
    return this.templateRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const template = await this.templateRepo.findOne({ where: { id } });
    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }
    return template;
  }

  async update(id: string, dto: UpdateTemplateDto) {
    const template = await this.findOne(id);
    Object.assign(template, dto);
    return this.templateRepo.save(template);
  }

  async remove(id: string) {
    const template = await this.findOne(id);
    await this.templateRepo.remove(template);
    return { message: 'Template successfully deleted' };
  }
}
