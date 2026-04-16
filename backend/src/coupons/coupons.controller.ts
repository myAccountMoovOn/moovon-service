import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { CreateCouponDto, UpdateCouponDto, ValidateCouponDto } from './dto/coupon.dto';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Coupons')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new coupon' })
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponsService.create(createCouponDto);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate a coupon code and calculate discount' })
  validate(@Body() validateCouponDto: ValidateCouponDto) {
    return this.couponsService.validate(validateCouponDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all coupons' })
  findAll() {
    return this.couponsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a coupon by ID' })
  findOne(@Param('id') id: string) {
    return this.couponsService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update a coupon' })
  update(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
    return this.couponsService.update(id, updateCouponDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a coupon' })
  remove(@Param('id') id: string) {
    return this.couponsService.remove(id);
  }
}
