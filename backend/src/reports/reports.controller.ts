import { Controller, Get, Query, UseGuards, Res, Param } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/guards/supabase-auth.guard';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Roles('admin', 'provider')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @ApiOperation({ summary: 'Get renewals report' })
  @Get('renewals')
  getRenewals(@CurrentUser() user: AuthenticatedUser, @Query('from') from?: string, @Query('to') to?: string) {
    const companyId = user.role === 'provider' ? (user.companyId || undefined) : undefined;
    return this.reportsService.getRenewals(from, to, companyId);
  }

  @ApiOperation({ summary: 'Get revenue report' })
  @Get('revenue')
  getRevenue(@CurrentUser() user: AuthenticatedUser, @Query('from') from?: string, @Query('to') to?: string) {
    const companyId = user.role === 'provider' ? (user.companyId || undefined) : undefined;
    return this.reportsService.getRevenue(from, to, companyId);
  }

  @ApiOperation({ summary: 'Detailed customer-wise report' })
  @Get('customers-detailed')
  getCustomersDetailed(@CurrentUser() user: AuthenticatedUser) {
    const companyId = user.role === 'provider' ? (user.companyId || undefined) : undefined;
    return this.reportsService.getCustomerReport(companyId);
  }

  @ApiOperation({ summary: 'Detailed service-wise report' })
  @Get('services-detailed')
  getServicesDetailed(@CurrentUser() user: AuthenticatedUser) {
    const companyId = user.role === 'provider' ? (user.companyId || undefined) : undefined;
    return this.reportsService.getServiceReport(companyId);
  }

  @ApiOperation({ summary: 'Detailed payment status report' })
  @Get('payment-status-detailed')
  getPaymentStatusDetailed(@CurrentUser() user: AuthenticatedUser) {
    const companyId = user.role === 'provider' ? (user.companyId || undefined) : undefined;
    return this.reportsService.getPaymentStatusReport(companyId);
  }

  @ApiOperation({ summary: 'Get dashboard summary metrics' })
  @Get('dashboard')
  getDashboard(
    @Query('from') from?: string, 
    @Query('to') to?: string,
    @CurrentUser() user?: AuthenticatedUser
  ) {
    // If the user is a provider, automatically scope the metrics to their company
    const companyId = user?.role === 'provider' ? (user.companyId || undefined) : undefined;
    return this.reportsService.getDashboardSummary(from, to, companyId);
  }

  // --- Dynamic Export Endpoints ---

  @ApiOperation({ summary: 'Export reports to Excel or CSV' })
  @Get('export/:format/:type')
  async exportExcel(
    @CurrentUser() user: AuthenticatedUser,
    @Res() res: Response, 
    @Param('format') format: 'xlsx' | 'csv',
    @Param('type') type: string,
    @Query('from') from?: string, 
    @Query('to') to?: string
  ) {
    const companyId = user.role === 'provider' ? (user.companyId || undefined) : undefined;
    const buffer = await this.reportsService.exportToExcel(type, from, to, format, companyId);
    const contentType = format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const extension = format === 'csv' ? 'csv' : 'xlsx';
    
    res.set({
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${type}_report_${new Date().getTime()}.${extension}"`,
    });
    res.send(buffer);
  }

  @ApiOperation({ summary: 'Export reports to PDF' })
  @Get('export/pdf/:type')
  async exportPdf(
    @CurrentUser() user: AuthenticatedUser,
    @Res() res: Response,
    @Param('type') type: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const companyId = user.role === 'provider' ? (user.companyId || undefined) : undefined;
    const buffer = await this.reportsService.exportToPdf(from, to, type, companyId);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${type}_report_${new Date().getTime()}.pdf"`,
    });
    res.send(buffer);
  }
}
