import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';

import { CryptoService } from '../common/crypto.service';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    private cryptoService: CryptoService,
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

  async create(name: string, logo?: string, isReseller = false, resellerId: string | null = null): Promise<Company> {
    const code = await this.generateUniqueCode(name);
    const company = this.companiesRepository.create({ name, code, logo, isReseller, resellerId });
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

  async findPublicList(isReseller: boolean) {
    return this.companiesRepository.find({
      where: { isReseller },
      select: ['id', 'name', 'code'],
      order: { name: 'ASC' },
    });
  }

  async update(id: string, updateData: Partial<Company>): Promise<Company> {
    const company = await this.findOne(id);
    
    if (updateData.customDomain) {
      // Check for domain uniqueness
      const existing = await this.companiesRepository.findOne({ where: { customDomain: updateData.customDomain } });
      if (existing && existing.id !== id) {
        throw new NotFoundException(`Custom domain ${updateData.customDomain} is already in use`);
      }
    }

    if (updateData.smtpPass) {
      updateData.smtpPass = this.cryptoService.encrypt(updateData.smtpPass);
    }

    Object.assign(company, updateData);
    return this.companiesRepository.save(company);
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companiesRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }
  async getSmtpConfig(companyId: string) {
    const company = await this.findOne(companyId);
    if (!company || !company.smtpHost || !company.smtpPass) {
      return null;
    }
    return {
      host: company.smtpHost,
      port: company.smtpPort,
      user: company.smtpUser,
      pass: this.cryptoService.decrypt(company.smtpPass),
      fromName: company.smtpFromName,
      fromEmail: company.smtpFromEmail,
    };
  }
}
