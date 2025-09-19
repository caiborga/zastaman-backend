import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVatRateDto {
  @IsNumber()
  percentage: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  isDefault: boolean;
}
