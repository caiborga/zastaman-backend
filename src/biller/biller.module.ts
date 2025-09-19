import { Module } from '@nestjs/common';
import { BillerService } from './biller.service';
import { BillerController } from './biller.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Biller } from './entities/biller.entity';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Biller]), UsersModule],
  controllers: [BillerController],
  providers: [BillerService],
})
export class BillerModule {}
