import { Body, Controller, Get, Post, UseGuards, Res, Req, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
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

  @ApiOperation({ summary: 'Get CSRF Token' })
  @Get('csrf-token')
  getCsrfToken(@Req() req: Request) {
    return { csrfToken: (req as any).csrfToken() };
  }

  @ApiOperation({ summary: 'Login with email and password' })
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto.email, dto.password, (dto as any).portal);
    this.setAuthCookies(res, result);
    return result;
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
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }
    const result = await this.authService.refresh(refreshToken);
    this.setAuthCookies(res, result);
    return result;
  }

  @ApiOperation({ summary: 'Logout and invalidate session' })
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard)
  @Post('logout')
  async logout(@CurrentUser() user: AuthenticatedUser, @Res({ passthrough: true }) res: Response) {
    // The access token is in the Authorization header or cookie; pass user id for admin signOut
    const result = await this.authService.logout(user.id);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return result;
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

  @ApiOperation({ summary: 'Request Password Reset OTP' })
  @Post('forgot-password')
  forgotPassword(@Body() dto: import('./dto/auth.dto').ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @ApiOperation({ summary: 'Verify OTP and Reset Password' })
  @Post('reset-password')
  resetPassword(@Body() dto: import('./dto/auth.dto').ResetPasswordDto) {
    return this.authService.resetPassword(dto);
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
  async verifyOtp(@Body() dto: import('./dto/auth.dto').OtpVerifyDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.verifyOtp(dto.email, dto.token, (dto as any).portal);
    this.setAuthCookies(res, result);
    return result;
  }

  private setAuthCookies(res: Response, result: any) {
    const session = result?.data?.session || result?.session;
    if (session?.access_token) {
      res.cookie('access_token', session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: (session.expires_in || 3600) * 1000,
      });
    }
    if (session?.refresh_token) {
      res.cookie('refresh_token', session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
    }
  }
}
