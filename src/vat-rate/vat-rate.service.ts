import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VatRate } from './entities/vat-rate.entity';
import { CreateVatRateDto } from './dto/create-vat-rate.dto';
import { UpdateVatRateDto } from './dto/update-vat-rate.dto';
import { User } from 'src/users/entities/user.entity';
import { Biller } from 'src/biller/entities/biller.entity';

@Injectable()
export class VatRateService {
  constructor(
    @InjectRepository(VatRate)
    private vatRateRepository: Repository<VatRate>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Biller)
    private billerRepository: Repository<Biller>,
  ) {}

  /**
   * Create new VatRate for the Biller of the authenticated user
   */
  async create(dto: CreateVatRateDto, userPayload: { userId: number }) {
    const user = await this.userRepository.findOne({
      where: { id: userPayload.userId },
      relations: ['biller'],
    });

    if (!user?.biller) {
      throw new NotFoundException('Biller not found for user');
    }

    if (dto.isDefault) {
      await this.vatRateRepository.update(
        { biller: user.biller, isDefault: true },
        { isDefault: false },
      );
    }

    const vatRate = this.vatRateRepository.create({
      ...dto,
      biller: user.biller,
    });

    return this.vatRateRepository.save(vatRate);
  }

  /**
   * Get all VatRates for the authenticated user's biller
   */
  async findAll(userPayload: { userId: number }) {
    const user = await this.userRepository.findOne({
      where: { id: userPayload.userId },
      relations: ['biller'],
    });

    if (!user?.biller) {
      throw new NotFoundException('Biller not found for user');
    }

    return this.vatRateRepository.find({
      where: { biller: { id: user.biller.id } },
      order: { id: 'ASC' },
    });
  }

  /**
   * Get single VatRate by ID
   */
  async findOne(id: number) {
    const vatRate = await this.vatRateRepository.findOne({ where: { id } });
    if (!vatRate) {
      throw new NotFoundException('VatRate not found');
    }
    return vatRate;
  }

  /**
   * Update a VatRate by ID
   */
  async update(id: number, dto: UpdateVatRateDto) {
    const vatRate = await this.vatRateRepository.findOne({
      where: { id },
      relations: ['biller'],
    });

    if (!vatRate) {
      throw new NotFoundException('VatRate not found');
    }

    if (dto.isDefault) {
      await this.vatRateRepository.update(
        { biller: vatRate.biller, isDefault: true },
        { isDefault: false },
      );
    }

    Object.assign(vatRate, dto);
    return this.vatRateRepository.save(vatRate);
  }

  /**
   * Delete a VatRate by ID
   */
  async remove(id: number) {
    const vatRate = await this.vatRateRepository.findOne({ where: { id } });
    if (!vatRate) {
      throw new NotFoundException('VatRate not found');
    }

    return this.vatRateRepository.remove(vatRate);
  }
}
