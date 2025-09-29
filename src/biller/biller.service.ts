import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBillerDto } from './dto/create-biller.dto';
import { UpdateBillerDto } from './dto/update-biller.dto';
import { User } from 'src/users/entities/user.entity';
import { Biller } from './entities/biller.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class BillerService {
  constructor(
    @InjectRepository(Biller)
    private billerRepository: Repository<Biller>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateBillerDto, userPayload: { userId: number }) {
    const user = await this.usersRepository.findOne({
      where: { id: userPayload.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const biller = this.billerRepository.create({
      ...dto,
      user,
    });

    const savedBiller = await this.billerRepository.save(biller);
    return instanceToPlain(savedBiller);
  }

  async findByUser(userId: number): Promise<Biller | null> {
    const biller = await this.billerRepository.findOne({
      where: { user: { id: userId } },
    });

    if (biller?.preName) {
      return biller;
    } else {
      return null;
    }
  }

  async update(dto: UpdateBillerDto, userPayload: { userId: number }) {
    const user = await this.usersRepository.findOne({
      where: { id: userPayload.userId },
      relations: ['biller'],
    });

    if (!user || !user.biller) {
      throw new NotFoundException('Biller not found for this user');
    }

    // merge dto into the existing biller
    Object.assign(user.biller, dto);

    const updated = await this.billerRepository.save(user.biller);
    const result = instanceToPlain(updated);
    return result;
  }
}
