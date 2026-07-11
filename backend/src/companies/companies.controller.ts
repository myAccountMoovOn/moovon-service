import { Controller, Get, Post, Body, Param, UseGuards, Patch, NotFoundException, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/guards/supabase-auth.guard';
import { UserRole, Profile } from '../auth/entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
    @InjectRepository(Profile) private readonly profileRepository: Repository<Profile>,
  ) {}

  @Post()
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  create(@Body() createCompanyDto: { name: string; logo?: string }) {
    return this.companiesService.create(createCompanyDto.name, createCompanyDto.logo);
  }

  @Get()
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  findAll() {
    return this.companiesService.findAll();
  }

  @Get('public/list')
  async getPublicList(@Query('type') type?: string) {
    const isReseller = type === 'reseller';
    return this.companiesService.findPublicList(isReseller);
  }

  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  async getMe(@CurrentUser() user: AuthenticatedUser) {
    if (!user.companyId) {
      if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.PROVIDER) {
        // Auto-create a default company for the user
        const companyName = user.role === UserRole.SUPER_ADMIN ? 'Moovon Service' : 'My Company';
        const company = await this.companiesService.create(companyName);
        await this.profileRepository.update({ id: user.id }, { companyId: company.id });
        user.companyId = company.id;
      } else {
        return null;
      }
    }
    const company = await this.companiesService.findOne(user.companyId);
    
    // Fallback if an old company record doesn't have a code
    if (company && !company.code) {
      company.code = await this.companiesService.generateUniqueCode(company.name || 'COMP');
      await this.companiesService.update(company.id, { code: company.code } as any);
    }

    if (company && company.smtpPass) {
      company.smtpPass = '********'; // Mask password before sending to client
    }
    return company;
  }

  @Patch('me')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER, UserRole.SUPER_ADMIN)
  async updateMe(@CurrentUser() user: AuthenticatedUser, @Body() updateDto: Partial<Company>) {
    if (!user.companyId) {
      if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.PROVIDER) {
        const companyName = user.role === UserRole.SUPER_ADMIN ? 'Moovon Service' : 'My Company';
        const company = await this.companiesService.create(companyName);
        await this.profileRepository.update({ id: user.id }, { companyId: company.id });
        user.companyId = company.id;
      } else {
        throw new Error('No company assigned to user');
      }
    }
    return this.companiesService.update(user.companyId, updateDto);
  }

  @Get(':id/branding')
  async getBranding(@Param('id') id: string) {
    try {
      const company = await this.companiesService.findOne(id);
      return {
        id: company.id,
        name: company.name,
        logo: company.logo,
        primaryColor: company.primaryColor,
        accentColor: company.accentColor,
        fontFamily: company.fontFamily,
        favicon: company.favicon,
        appName: company.appName,
        tagline: company.tagline,
        appIconUrl: company.appIconUrl,
        privacyPolicyUrl: company.privacyPolicyUrl,
        termsUrl: company.termsUrl,
        footerText: company.footerText,
        supportEmail: company.supportEmail,
        supportPhone: company.supportPhone,
      };
    } catch (e) {
      throw new NotFoundException(`Branding for company ${id} not found`);
    }
  }

  @Get('by-code/:code')
  findByCode(@Param('code') code: string) {
    return this.companiesService.findByCode(code);
  }

  @Get(':id')
  @UseGuards(SupabaseAuthGuard)
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }
}
