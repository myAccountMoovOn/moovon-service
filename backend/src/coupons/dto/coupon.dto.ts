import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsBoolean, IsDateString, IsOptional, Min, IsNotEmpty } from 'class-validator';
import { DiscountType } from '../entities/coupon.entity';

export class CreateCouponDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ enum: DiscountType })
  @IsEnum(DiscountType)
  type: DiscountType;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  value: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPurchaseAmount?: number;
}

export class UpdateCouponDto extends PartialType(CreateCouponDto) {}

export class ValidateCouponDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @Min(0)
  amount: number;
}
