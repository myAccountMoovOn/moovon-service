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

  @ApiOperation({ summary: 'Register a new Provider/Company Step 1 (Sends OTP)' })
  @Post('register-provider-step1')
  registerProviderStep1(@Body() dto: import('./dto/auth.dto').RegisterProviderDto) {
    return this.authService.registerProviderStep1(dto);
  }

  @ApiOperation({ summary: 'Register a new Reseller Step 1 (Sends OTP)' })
  @Post('register-reseller-step1')
  registerResellerStep1(@Body() dto: import('./dto/auth.dto').RegisterResellerDto) {
    return this.authService.registerResellerStep1(dto);
  }

  @ApiOperation({ summary: 'Register a new Customer with a Company Code Step 1 (Sends OTP)' })
  @Post('register-customer-step1')
  registerCustomerStep1(@Body() dto: import('./dto/auth.dto').RegisterCustomerDto) {
    return this.authService.registerCustomerStep1(dto);
  }

  @ApiOperation({ summary: 'Verify Signup OTP and Complete Registration' })
  @Post('register-verify')
  verifySignup(@Body() dto: import('./dto/auth.dto').OtpVerifyDto) {
    return this.authService.verifySignup(dto.email, dto.token);
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
  requestOtp(@Body() dto: import('./dto/auth.dto').OtpRequestDto) {
    // Generate a temporary OTP for this flow (if used directly, which is currently bypassed by login 2FA)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return this.authService.sendCustomEmailOtp(dto.email, otp);
  }

  @ApiOperation({ summary: 'Verify Email OTP and Login' })
  @Post('verify-otp')
  verifyOtp(@Body() dto: import('./dto/auth.dto').OtpVerifyDto) {
    return this.authService.verifyOtp(dto.email, dto.token);
  }

  @ApiOperation({ summary: 'Request Password Reset OTP' })
  @Post('forgot-password')
  forgotPassword(@Body() dto: import('./dto/auth.dto').ForgotPasswordDto) {
    return this.authService.forgotPasswordStep1(dto.email);
  }

  @ApiOperation({ summary: 'Verify OTP and Reset Password' })
  @Post('reset-password')
  resetPassword(@Body() dto: import('./dto/auth.dto').ResetPasswordDto) {
    return this.authService.forgotPasswordStep2(dto);
  }
}
