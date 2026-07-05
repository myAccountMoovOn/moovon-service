import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  async generateUniqueCode(name: string): Promise<string> {
    const baseCode = name.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, 'COMP');
    let code = `${baseCode}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    let exists = await this.companiesRepository.findOne({ where: { code } });
    while (exists) {
      code = `${baseCode}-${Math.floor(1000 + Math.random() * 9000)}`;
      exists = await this.companiesRepository.findOne({ where: { code } });
    }
    return code;
  }

  async create(name: string, logo?: string): Promise<Company> {
    const code = await this.generateUniqueCode(name);
    const company = this.companiesRepository.create({ name, code, logo });
    return this.companiesRepository.save(company);
  }

  async findByCode(code: string): Promise<Company> {
    const company = await this.companiesRepository.findOne({ where: { code } });
    if (!company) {
      throw new NotFoundException(`Company with code ${code} not found`);
    }
    return company;
  }

  async findAll(): Promise<Company[]> {
    return this.companiesRepository.find();
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companiesRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }
}
