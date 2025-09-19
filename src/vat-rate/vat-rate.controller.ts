import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { VatRateService } from './vat-rate.service';
import { CreateVatRateDto } from './dto/create-vat-rate.dto';
import { UpdateVatRateDto } from './dto/update-vat-rate.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('vat')
export class VatRateController {
  constructor(private readonly vatRateService: VatRateService) {}

  /**
   * Create a new VAT rate for the authenticated user's biller
   */
  @Post()
  create(@Body() dto: CreateVatRateDto, @Req() req) {
    return this.vatRateService.create(dto, req.user);
  }

  /**
   * Get all VAT rates for the authenticated user's biller
   */
  @Get()
  findAll(@Req() req) {
    return this.vatRateService.findAll(req.user);
  }

  /**
   * Get single VAT rate by ID (optional - can be useful)
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vatRateService.findOne(+id);
  }

  /**
   * Update a VAT rate by ID
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVatRateDto) {
    return this.vatRateService.update(+id, dto);
  }

  /**
   * Delete a VAT rate by ID
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vatRateService.remove(+id);
  }
}
