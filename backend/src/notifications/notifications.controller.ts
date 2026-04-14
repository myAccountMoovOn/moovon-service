import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { NotificationChannel, NotificationStatus } from './entities/notification-log.entity';
import { SupabaseAuthGuard, AuthenticatedUser } from '../common/guards/supabase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({ summary: 'Get notification logs (paginated)' })
  @Get('logs')
  getLogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('channel') channel?: NotificationChannel,
    @Query('status') status?: NotificationStatus,
    @Query('customerId') customerId?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    
    return this.notificationsService.getLogs(
      pageNumber,
      limitNumber,
      channel,
      status,
      customerId,
    );
  }

  @ApiOperation({ summary: "Get the current customer's notification history" })
  @Get('my-logs')
  async getMyLogs(
    @CurrentUser() user: AuthenticatedUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;

    // We need to resolve the customerId from the userId
    const customer = await this.notificationsService.getCustomerByUserId(user.id);
    if (!customer) {
        return { data: [], total: 0 };
    }

    return this.notificationsService.getLogs(
      pageNumber,
      limitNumber,
      undefined,
      undefined,
      customer.id,
    );
  }
}
