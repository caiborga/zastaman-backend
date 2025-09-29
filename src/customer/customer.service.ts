// src/customer/customer.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(dto: CreateCustomerDto, userPayload: { userId: number }) {
    const user = await this.userRepository.findOne({
      where: { id: userPayload.userId },
      relations: ['biller'],
    });

    if (!user || !user.biller) {
      throw new NotFoundException('Biller for user not found');
    }

    const customer = this.customerRepository.create({
      ...dto,
      biller: user.biller,
    });

    return this.customerRepository.save(customer);
  }

  async findAll(userPayload: { userId: number }) {
    const user = await this.userRepository.findOne({
      where: { id: userPayload.userId },
      relations: ['biller'],
    });

    if (!user?.biller) throw new NotFoundException('Biller not found');

    return this.customerRepository.find({
      where: { biller: { id: user.biller.id } },
      relations: ['biller'],
      order: {
        lastName: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async update(id: number, dto: UpdateCustomerDto) {
    const customer = await this.customerRepository.preload({ id, ...dto });
    if (!customer) throw new NotFoundException('Customer not found');
    return this.customerRepository.save(customer);
  }

  async remove(id: number) {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');
    return this.customerRepository.remove(customer);
  }
}
