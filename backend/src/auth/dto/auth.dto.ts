import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongpassword123' })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  companyName?: string;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ required: false })
  gstNumber?: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @MinLength(6)
  newPassword: string;
}
