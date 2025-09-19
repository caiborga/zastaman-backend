import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { CustomerService } from 'src/customer/customer.service';
import { CustomerModule } from 'src/customer/customer.module';
import { Customer } from 'src/customer/entities/customer.entity';
import { InvoiceService } from 'src/invoice/invoice.service';
import { BillerService } from 'src/biller/biller.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice]),
    TypeOrmModule.forFeature([Customer]),
    UsersModule,
    CustomerModule,
  ],
  controllers: [PdfController],
  providers: [PdfService, CustomerService, InvoiceService, BillerService],
})
export class PdfModule {}
