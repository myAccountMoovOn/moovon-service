import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Headers,
  Delete,
  UseGuards,
  HttpCode,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { SupabaseAuthGuard, AuthenticatedUser } from '../common/guards/supabase-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  
  @ApiOperation({ summary: 'Get all successful payments (paginated)' })
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles('admin', 'provider')
  @Get()
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.paymentsService.findAll(pageNumber, limitNumber, search, status, from, to, user);
  }

  @ApiOperation({ summary: 'Generate Razorpay payment link for a subscription (or mock link)' })
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles('admin', 'customer')
  @Post('generate-link/:subscriptionId')
  generateLink(
    @Param('subscriptionId') subscriptionId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.paymentsService.generateLink(
      subscriptionId,
      user.role === 'admin' ? undefined : user.id,
    );
  }

  @ApiOperation({ summary: 'Simulate a successful mock payment' })
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles('admin', 'provider')
  @Post('simulate-mock-success/:subscriptionId')
  simulateMockSuccess(@Param('subscriptionId') subscriptionId: string) {
    return this.paymentsService.simulateMockSuccess(subscriptionId);
  }

  @ApiOperation({ summary: 'Razorpay Webhook endpoint' })
  @Post('webhook')
  @HttpCode(200)
  webhook(
    @Body() body: any,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    return this.paymentsService.webhook(body, signature);
  }

  @ApiOperation({ summary: 'Get payment history for a subscription' })
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard)
  @Get(':subscriptionId')
  getHistory(@Param('subscriptionId') subscriptionId: string) {
    return this.paymentsService.getHistory(subscriptionId);
  }

  @ApiOperation({ summary: 'Send generated payment link via Email/SMS' })
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('send-link/:subscriptionId')
  sendLink(@Param('subscriptionId') subscriptionId: string) {
    return this.paymentsService.sendLink(subscriptionId);
  }

  @ApiOperation({ summary: 'Get invoice URL for a successful payment' })
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard)
  @Get('invoice/:paymentId')
  getInvoiceUrl(@Param('paymentId') paymentId: string) {
    return this.paymentsService.getInvoiceUrl(paymentId);
  }

  @ApiOperation({ summary: 'Delete a payment record' })
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles('admin', 'provider')
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.paymentsService.remove(id, user);
  }

  @ApiOperation({ summary: "Get the current customer's payment history" })
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard)
  @Get('history/my-history')
  async getMyHistory(@CurrentUser() user: AuthenticatedUser) {
    return this.paymentsService.getMyHistory(user.id);
  }
}
