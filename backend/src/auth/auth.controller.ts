import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto, UpdateProfileDto, ChangePasswordDto } from './dto/auth.dto';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/guards/supabase-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login with email and password' })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @ApiOperation({ summary: 'Logout and invalidate session' })
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard)
  @Post('logout')
  logout(@CurrentUser() user: AuthenticatedUser) {
    // The access token is in the Authorization header; pass user id for admin signOut
    return this.authService.logout(user.id);
  }

  @ApiOperation({ summary: 'Get current user profile and customer data' })
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getMe(user.id);
  }

  @ApiOperation({ summary: 'Update customer profile data' })
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard)
  @Post('profile')
  updateProfile(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(user.id, dto);
  }

  @ApiOperation({ summary: 'Change login password' })
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard)
  @Post('change-password')
  changePassword(@CurrentUser() user: AuthenticatedUser, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(user.id, dto.newPassword);
  }

  @ApiOperation({ summary: 'Request Login OTP via Email' })
  @Post('request-otp')
  requestOtp(@Body('email') email: string) {
    return this.authService.sendEmailOtp(email);
  }

  @ApiOperation({ summary: 'Verify Email OTP and Login' })
  @Post('verify-otp')
  verifyOtp(@Body('email') email: string, @Body('token') token: string) {
    return this.authService.verifyOtp(email, token);
  }
}
