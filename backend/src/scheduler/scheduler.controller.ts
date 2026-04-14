import { Controller, Post, UseGuards, Logger } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SchedulerService } from './scheduler.service';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Scheduler')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Roles('admin')
@Controller('scheduler')
export class SchedulerController {
  private readonly logger = new Logger(SchedulerController.name);

  constructor(private readonly schedulerService: SchedulerService) {}

  @ApiOperation({ summary: 'Manually trigger the daily subscription notification sweep' })
  @Post('trigger-notifications')
  async triggerNotifications() {
    this.logger.log('Manual notification sweep triggered by admin');
    // We run it asynchronously to avoid blocking the response
    this.schedulerService.handleDailyNotifications()
      .catch(err => this.logger.error(`Manual notification sweep failed: ${err.message}`));
    
    return { 
      message: 'Notification sweep started. Check the Notification Logs for progress.',
      timestamp: new Date().toISOString()
    };
  }
}
