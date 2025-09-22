// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { BillerModule } from './biller/biller.module';
import { InvoiceModule } from './invoice/invoice.module';
import { CustomerModule } from './customer/customer.module';
import { VatRateModule } from './vat-rate/vat-rate.module';
import { PdfModule } from './pdf/pdf.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProd = config.get('NODE_ENV') === 'production';

        const base = {
          type: 'postgres' as const,
          host: config.get<string>('DB_HOST') ?? 'localhost',
          port: Number(config.get('DB_PORT') ?? 3300),
          username: config.get<string>('DB_USER') ?? 'postgres',
          password: config.get<string>('DB_PASS') ?? '',
          database: config.get<string>('DB_NAME') ?? 'postgres',
        };
        console.log('url', base);

        return {
          ...base,
          ssl: isProd ? { rejectUnauthorized: false } : false,

          autoLoadEntities: true,

          synchronize: true,

          logging: isProd ? ['error', 'warn'] : ['query', 'error', 'warn'],
        };
      },
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
