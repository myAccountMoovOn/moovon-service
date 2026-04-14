import { Controller, Get, Query, UseGuards, Res, Param } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Roles('admin')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @ApiOperation({ summary: 'Get renewals report' })
  @Get('renewals')
  getRenewals(@Query('from') from?: string, @Query('to') to?: string) {
    return this.reportsService.getRenewals(from, to);
  }

  @ApiOperation({ summary: 'Get revenue report' })
  @Get('revenue')
  getRevenue(@Query('from') from?: string, @Query('to') to?: string) {
    return this.reportsService.getRevenue(from, to);
  }

  @ApiOperation({ summary: 'Detailed customer-wise report' })
  @Get('customers-detailed')
  getCustomersDetailed() {
    return this.reportsService.getCustomerReport();
  }

  @ApiOperation({ summary: 'Detailed service-wise report' })
  @Get('services-detailed')
  getServicesDetailed() {
    return this.reportsService.getServiceReport();
  }

  @ApiOperation({ summary: 'Detailed payment status report' })
  @Get('payment-status-detailed')
  getPaymentStatusDetailed() {
    return this.reportsService.getPaymentStatusReport();
  }

  @ApiOperation({ summary: 'Get dashboard summary metrics' })
  @Get('dashboard')
  getDashboard(@Query('from') from?: string, @Query('to') to?: string) {
    return this.reportsService.getDashboardSummary(from, to);
  }

  // --- Dynamic Export Endpoints ---

  @ApiOperation({ summary: 'Export reports to Excel or CSV' })
  @Get('export/:format/:type')
  async exportExcel(
    @Res() res: Response, 
    @Param('format') format: 'xlsx' | 'csv',
    @Param('type') type: string,
    @Query('from') from?: string, 
    @Query('to') to?: string
  ) {
    const buffer = await this.reportsService.exportToExcel(type, from, to, format);
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
    @Res() res: Response,
    @Param('type') type: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const buffer = await this.reportsService.exportToPdf(from, to, type);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${type}_report_${new Date().getTime()}.pdf"`,
    });
    res.send(buffer);
  }
}
