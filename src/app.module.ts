import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/entities/user.entity';
import { BillerModule } from './biller/biller.module';
import { Biller } from './biller/entities/biller.entity';
import { InvoiceModule } from './invoice/invoice.module';
import { Invoice } from './invoice/entities/invoice.entity';
import { CustomerModule } from './customer/customer.module';
import { Customer } from './customer/entities/customer.entity';
import { VatRateModule } from './vat-rate/vat-rate.module';
import { VatRate } from './vat-rate/entities/vat-rate.entity';
import { PdfModule } from './pdf/pdf.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 3300,
      username: 'zb_db_admin',
      password: '1',
      database: 'zb_db',
      entities: [User, Biller, Invoice, Customer, VatRate],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    BillerModule,
    InvoiceModule,
    CustomerModule,
    VatRateModule,
    PdfModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
