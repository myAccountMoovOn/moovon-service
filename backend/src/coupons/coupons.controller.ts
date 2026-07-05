import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { CreateCouponDto, UpdateCouponDto, ValidateCouponDto } from './dto/coupon.dto';
import { SupabaseAuthGuard, AuthenticatedUser } from '../common/guards/supabase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Coupons')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  @Roles('admin', 'provider')
  @ApiOperation({ summary: 'Create a new coupon' })
  create(@CurrentUser() user: AuthenticatedUser, @Body() createCouponDto: CreateCouponDto) {
    return this.couponsService.create(createCouponDto, user);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate a coupon code and calculate discount' })
  validate(@CurrentUser() user: AuthenticatedUser, @Body() validateCouponDto: ValidateCouponDto) {
    return this.couponsService.validate(validateCouponDto, user);
  }

  @Get()
  @Roles('admin', 'provider')
  @ApiOperation({ summary: 'Get all coupons' })
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.couponsService.findAll(user);
  }

  @Get(':id')
  @Roles('admin', 'provider')
  @ApiOperation({ summary: 'Get a coupon by ID' })
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.couponsService.findOne(id, user);
  }

  @Patch(':id')
  @Roles('admin', 'provider')
  @ApiOperation({ summary: 'Update a coupon' })
  update(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
    return this.couponsService.update(id, updateCouponDto, user);
  }

  @Delete(':id')
  @Roles('admin', 'provider')
  @ApiOperation({ summary: 'Delete a coupon' })
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.couponsService.remove(id, user);
  }
}
