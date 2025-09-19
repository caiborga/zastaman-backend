import { Module } from '@nestjs/common';
import { VatRateService } from './vat-rate.service';
import { VatRateController } from './vat-rate.controller';
import { VatRate } from './entities/vat-rate.entity';
import { User } from 'src/users/entities/user.entity';
import { Biller } from 'src/biller/entities/biller.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [VatRateController],
  providers: [VatRateService],
  imports: [TypeOrmModule.forFeature([VatRate, User, Biller])],
})
export class VatRateModule {}
