import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { UsersModule } from 'src/users/users.module';
import { Customer } from 'src/customer/entities/customer.entity';
import { VatRate } from 'src/vat-rate/entities/vat-rate.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, Customer, VatRate]),
    UsersModule,
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
