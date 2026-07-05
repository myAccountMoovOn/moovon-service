import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PackagesService } from './packages.service';
import { CreatePackageDto, UpdatePackageDto } from './dto/package.dto';
import { SupabaseAuthGuard, AuthenticatedUser } from '../common/guards/supabase-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Packages')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('packages')
export class PackagesController {
  // Registry confirmation for /api/v1/packages
  constructor(private readonly packagesService: PackagesService) {}

  @Post()
  @Roles('admin', 'provider')
  @ApiOperation({ summary: 'Create a new package' })
  create(@Body() createPackageDto: CreatePackageDto, @CurrentUser() user: AuthenticatedUser) {
    if (user.role === 'provider' && user.companyId) {
      createPackageDto.companyId = user.companyId;
    }
    return this.packagesService.create(createPackageDto);
  }

  @Get()
  @Roles('admin', 'provider', 'customer')
  @ApiOperation({ summary: 'Get all packages' })
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('serviceId') serviceId?: string,
  ) {
    return this.packagesService.findAll(serviceId, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a package by ID' })
  findOne(@Param('id') id: string) {
    return this.packagesService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'provider')
  @ApiOperation({ summary: 'Update a package' })
  update(
    @Param('id') id: string,
    @Body() updatePackageDto: UpdatePackageDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.packagesService.update(id, updatePackageDto, user);
  }

  @Delete(':id')
  @Roles('admin', 'provider')
  @ApiOperation({ summary: 'Delete a package' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.packagesService.remove(id, user);
  }
}
