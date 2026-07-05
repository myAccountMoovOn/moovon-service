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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { SupabaseAuthGuard, AuthenticatedUser } from '../common/guards/supabase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Create a new category' })
  @Roles('admin', 'provider')
  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto, user);
  }

  @ApiOperation({ summary: 'Get all categories' })
  @Roles('admin', 'provider')
  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.categoriesService.findAll(user);
  }

  @ApiOperation({ summary: 'Get a specific category' })
  @Roles('admin', 'provider')
  @Get(':id')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.categoriesService.findOne(id, user);
  }

  @ApiOperation({ summary: 'Update a category' })
  @Roles('admin', 'provider')
  @Patch(':id')
  update(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto, user);
  }

  @ApiOperation({ summary: 'Delete a category' })
  @Roles('admin', 'provider')
  @Delete(':id')
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.categoriesService.remove(id, user);
  }
}
