import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsNumber()
  @IsNotEmpty()
  hourlyRate: number;

  @IsString()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  preName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsNumber()
  @IsNotEmpty()
  streetNumber: number;

  @IsNumber()
  @IsNotEmpty()
  postcode: number;

  @IsString()
  @IsNotEmpty()
  town: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}
