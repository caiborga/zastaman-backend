import {
  Controller,
  Get,
  Post,
  Body,
  //   Patch,
  //   Param,
  //   Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
// import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  create(@Body() dto: CreateInvoiceDto, @Req() req) {
    return this.invoiceService.create(dto, req.user);
  }

  @Get()
  findAllForUser(@Req() req) {
    return this.invoiceService.findAllForUser(req.user);
  }

  //   @Get(':id')
  //   findOne(@Param('id') id: string) {
  //     return this.invoiceService.findOne(+id);
  //   }

  //   @Patch(':id')
  //   update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
  //     return this.invoiceService.update(+id, updateInvoiceDto);
  //   }

  //   @Delete(':id')
  //   remove(@Param('id') id: string) {
  //     return this.invoiceService.remove(+id);
  //   }
}
