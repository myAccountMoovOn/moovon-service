import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsUUID, IsString, IsNumber, IsBoolean, Min, IsOptional, IsArray, ArrayMinSize } from 'class-validator';

export class CreatePackageDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  serviceIds: string[];

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Duration in months' })
  @IsNumber()
  @Min(1)
  durationMonths: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  actualPrice: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  offerPrice: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdatePackageDto extends PartialType(CreatePackageDto) {}
