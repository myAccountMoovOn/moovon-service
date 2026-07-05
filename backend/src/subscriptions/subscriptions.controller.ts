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
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto, NotifySubscriptionDto } from './dto/subscription.dto';
import { SupabaseAuthGuard, AuthenticatedUser } from '../common/guards/supabase-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Subscriptions')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @ApiOperation({ summary: 'Create a new subscription' })
  @Roles('admin', 'provider')
  @Post()
  create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (user.role === 'provider' && user.companyId) {
      createSubscriptionDto.companyId = user.companyId;
    }
    return this.subscriptionsService.create(createSubscriptionDto);
  }

  @ApiOperation({ summary: 'Get all subscriptions (paginated & filtered)' })
  @Get()
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('customerId') customerId?: string,
    @Query('serviceId') serviceId?: string,
    @Query('search') search?: string,
    @Query('paymentStatus') paymentStatus?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.subscriptionsService.findAll(
      pageNumber, 
      limitNumber, 
      status, 
      customerId, 
      serviceId, 
      search, 
      from, 
      to, 
      paymentStatus,
      user
    );
  }

  @ApiOperation({ summary: 'Get subscriptions expiring within N days' })
  @Get('upcoming')
  getUpcoming(@Query('days') days?: string) {
    const daysNumber = days ? parseInt(days, 10) : 30;
    return this.subscriptionsService.getUpcoming(daysNumber);
  }

  @ApiOperation({ summary: 'Get a specific subscription' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a subscription' })
  @Roles('admin', 'provider')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.subscriptionsService.update(id, updateSubscriptionDto, user);
  }

  @ApiOperation({ summary: 'Delete a subscription' })
  @Roles('admin', 'provider')
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.subscriptionsService.remove(id, user);
  }

  @ApiOperation({ summary: 'Send notifications manually via queue' })
  @Roles('admin', 'provider')
  @Post(':id/notify')
  notify(
    @Param('id') id: string,
    @Body() notifyDto: NotifySubscriptionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.subscriptionsService.notify(id, notifyDto, user);
  }
}
