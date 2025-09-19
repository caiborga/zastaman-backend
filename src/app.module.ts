import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    ConfigModule.forRoot({
      isGlobal: true, // überall verfügbar, kein erneutes Importieren nötig
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT') || '3300'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        entities: [User, Biller, Invoice, Customer, VatRate],
        synchronize: true, // ⚠️ in PROD meist false + Migrations nutzen
      }),
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
