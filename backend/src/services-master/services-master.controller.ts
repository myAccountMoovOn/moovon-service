import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ServicesMasterService } from './services-master.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';
import { SupabaseAuthGuard, AuthenticatedUser } from '../common/guards/supabase-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Services Master')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('services')
export class ServicesMasterController {
  constructor(private readonly servicesMasterService: ServicesMasterService) {}

  @ApiOperation({ summary: 'Create a new service' })
  @Roles('admin', 'provider')
  @Post()
  create(@Body() createServiceDto: CreateServiceDto, @CurrentUser() user: AuthenticatedUser) {
    if (user.role === 'provider' && user.companyId) {
      createServiceDto.companyId = user.companyId;
    }
    return this.servicesMasterService.create(createServiceDto);
  }

  @ApiOperation({ summary: 'Get all services (paginated)' })
  @Roles('admin', 'provider', 'customer')
  @Get()
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('isActive') isActive?: string,
    @Query('pricingType') pricingType?: string,
    @Query('durationType') durationType?: string,
    @Query('category') category?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    const active = isActive === 'true' ? true : isActive === 'false' ? false : undefined;

    return this.servicesMasterService.findAll(
      pageNumber,
      limitNumber,
      search,
      active,
      pricingType,
      durationType,
      category,
      from,
      to,
      categoryId,
      user
    );
  }

  @ApiOperation({ summary: 'Get a specific service' })
  @Roles('admin')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesMasterService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a service' })
  @Roles('admin', 'provider')
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateServiceDto: UpdateServiceDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.servicesMasterService.update(id, updateServiceDto, user);
  }

  @ApiOperation({ summary: 'Deactivate a service (soft delete)' })
  @Roles('admin', 'provider')
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.servicesMasterService.remove(id, user);
  }
}
