import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto, UpdateTemplateDto } from './dto/template.dto';
import { SupabaseAuthGuard, AuthenticatedUser } from '../common/guards/supabase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Templates')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @ApiOperation({ summary: 'Create a new notification template' })
  @Roles('admin', 'provider')
  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() createTemplateDto: CreateTemplateDto) {
    return this.templatesService.create(createTemplateDto, user);
  }

  @ApiOperation({ summary: 'Get all notification templates' })
  @Roles('admin', 'provider')
  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.templatesService.findAll(user);
  }

  @ApiOperation({ summary: 'Get a specific template' })
  @Roles('admin', 'provider')
  @Get(':id')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.templatesService.findOne(id, user);
  }

  @ApiOperation({ summary: 'Update a template' })
  @Roles('admin', 'provider')
  @Patch(':id')
  update(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() updateTemplateDto: UpdateTemplateDto) {
    return this.templatesService.update(id, updateTemplateDto, user);
  }

  @ApiOperation({ summary: 'Delete a template' })
  @Roles('admin', 'provider')
  @Delete(':id')
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.templatesService.remove(id, user);
  }
}
