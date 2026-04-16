import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PackagesService } from './packages.service';
import { CreatePackageDto, UpdatePackageDto } from './dto/package.dto';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Packages')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('packages')
export class PackagesController {
  // Registry confirmation for /api/v1/packages
  constructor(private readonly packagesService: PackagesService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new package' })
  create(@Body() createPackageDto: CreatePackageDto) {
    return this.packagesService.create(createPackageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all packages' })
  findAll(@Query('serviceId') serviceId?: string) {
    return this.packagesService.findAll(serviceId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a package by ID' })
  findOne(@Param('id') id: string) {
    return this.packagesService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update a package' })
  update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto) {
    return this.packagesService.update(id, updatePackageDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a package' })
  remove(@Param('id') id: string) {
    return this.packagesService.remove(id);
  }
}
