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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @ApiOperation({ summary: 'Create a new customer' })
  @Roles('admin')
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @ApiOperation({ summary: 'Bulk import customers from Excel' })
  @ApiConsumes('multipart/form-data')
  @Roles('admin')
  @Post('bulk-import')
  @UseInterceptors(FileInterceptor('file'))
  bulkImport(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Excel file is required');
    }
    return this.customersService.bulkImport(file.buffer);
  }

  @ApiOperation({ summary: 'Get all customers (paginated)' })
  @Roles('admin')
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('isActive') isActive?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('hasSubscriptions') hasSubscriptions?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    const isActiveBool = isActive === 'true' ? true : (isActive === 'false' ? false : undefined);
    const hasSubsBool = hasSubscriptions === 'true' ? true : (hasSubscriptions === 'false' ? false : undefined);
    return this.customersService.findAll(pageNumber, limitNumber, search, isActiveBool, from, to, hasSubsBool);
  }

  @ApiOperation({ summary: 'Get a specific customer' })
  @Roles('admin')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a customer' })
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @ApiOperation({ summary: 'Delete a customer' })
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}
