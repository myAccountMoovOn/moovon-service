import {
  IsString,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsOptional,
  MinLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PricingType, DurationType } from '../entities/service.entity';

export class CreateServiceDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty({ enum: PricingType })
  @IsEnum(PricingType)
  pricingType: PricingType;

  @ApiProperty({ enum: DurationType })
  @IsEnum(DurationType)
  durationType: DurationType;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  basePrice: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateServiceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ enum: PricingType })
  @IsOptional()
  @IsEnum(PricingType)
  pricingType?: PricingType;

  @ApiPropertyOptional({ enum: DurationType })
  @IsOptional()
  @IsEnum(DurationType)
  durationType?: DurationType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
