import { Controller, Get, Post, Body, Param, UseGuards, Patch, NotFoundException, Query, Req } from '@nestjs/common';
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
    let companyIdToUse = user.companyId;
    
    // Fallback: If customer profile is missing companyId (e.g. legacy accounts), fetch from customer table
    if (!companyIdToUse && user.role === UserRole.CUSTOMER) {
      try {
        const customer = await this.profileRepository.manager.query(
          'SELECT company_id FROM customers WHERE user_id = $1',
          [user.id]
        );
        if (customer && customer.length > 0) {
          companyIdToUse = customer[0].company_id;
        }
      } catch (e) {
        // ignore
      }
    }

    if (!companyIdToUse) {
      if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.PROVIDER) {
        const companyName = user.role === UserRole.SUPER_ADMIN ? 'Moovon Service' : 'My Company';
        const company = await this.companiesService.create(companyName);
        await this.profileRepository.update({ id: user.id }, { companyId: company.id });
        companyIdToUse = company.id;
      } else {
        return null;
      }
    }
    
    const company = await this.companiesService.findOne(companyIdToUse);
    
    // Fallback if an old company record doesn't have a code
    if (company && !company.code) {
      company.code = await this.companiesService.generateUniqueCode(company.name || 'COMP');
      await this.companiesService.update(company.id, { code: company.code } as any);
    }

    if (company && company.smtpPass) {
      company.smtpPass = '********'; // Mask password before sending to client
    }
    
    // Resolve waterfall branding
    if (company) {
      const resolvedBranding = await this.companiesService.getResolvedBranding(company.id);
      Object.assign(company, resolvedBranding);
    }
    
    return company;
  }

  @Patch('me')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER, UserRole.SUPER_ADMIN, UserRole.RESELLER)
  async updateMe(@CurrentUser() user: AuthenticatedUser, @Req() req: any) {
    const body = req.body;
    
    let companyIdToUse = user.companyId;
    
    if (!companyIdToUse) {
      if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.PROVIDER) {
        const companyName = user.role === UserRole.SUPER_ADMIN ? 'Moovon Service' : 'My Company';
        const company = await this.companiesService.create(companyName);
        await this.profileRepository.update({ id: user.id }, { companyId: company.id });
        companyIdToUse = company.id;
      } else {
        throw new Error('No company assigned to user');
      }
    }
    
    // Explicitly pick allowed fields to bypass ValidationPipe whitelist stripping since we don't have a DTO class with decorators
    const allowedFields = [
      'name', 'logo', 'customDomain', 'primaryColor', 'accentColor', 'fontFamily', 
      'favicon', 'appName', 'tagline', 'appIconUrl', 'smtpHost', 'smtpPort', 
      'smtpUser', 'smtpPass', 'smtpFromName', 'smtpFromEmail', 'supportEmail', 
      'supportPhone', 'emailHeaderLogo', 'privacyPolicyUrl', 'termsUrl', 'footerText'
    ];
    
    const updateDto: any = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateDto[field] = body[field];
      }
    }
    
    return this.companiesService.update(companyIdToUse, updateDto);
  }

  @Get(':id/branding')
  async getBranding(@Param('id') id: string) {
    try {
      const resolved = await this.companiesService.getResolvedBranding(id);
      const company = await this.companiesService.findOne(id);
      return { id: company.id, name: company.name, ...resolved };
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
