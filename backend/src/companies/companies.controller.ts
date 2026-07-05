import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../auth/entities/profile.entity';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

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
