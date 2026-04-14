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
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Services Master')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('services')
export class ServicesMasterController {
  constructor(private readonly servicesMasterService: ServicesMasterService) {}

  @ApiOperation({ summary: 'Create a new service' })
  @Roles('admin')
  @Post()
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesMasterService.create(createServiceDto);
  }

  @ApiOperation({ summary: 'Get all services (paginated)' })
  @Roles('admin')
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('isActive') isActive?: string,
    @Query('pricingType') pricingType?: string,
    @Query('durationType') durationType?: string,
    @Query('category') category?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
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
    );
  }

  @ApiOperation({ summary: 'Get a specific service' })
  @Roles('admin')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesMasterService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a service' })
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesMasterService.update(id, updateServiceDto);
  }

  @ApiOperation({ summary: 'Deactivate a service (soft delete)' })
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesMasterService.remove(id);
  }
}
