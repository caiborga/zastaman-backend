import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateInvoiceDto {
  @IsNumber()
  @IsNotEmpty()
  customer: number;

  @IsString()
  @IsNotEmpty()
  invoiceNumber: string;

  @IsDateString()
  @IsNotEmpty()
  periodStart: Date;

  @IsDateString()
  @IsNotEmpty()
  periodEnd: Date;

  @IsDateString()
  @IsNotEmpty()
  invDate: Date;

  @IsDateString()
  @IsNotEmpty()
  createDate: Date;

  @IsNumber()
  @IsNotEmpty()
  invAmount: number;

  @IsNumber()
  @IsNotEmpty()
  vatAmount: number;

  @IsNumber()
  @IsNotEmpty()
  vatKey: number;
}
