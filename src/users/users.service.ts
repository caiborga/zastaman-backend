import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Biller } from 'src/biller/entities/biller.entity';
import { VatRate } from 'src/vat-rate/entities/vat-rate.entity';
import { customers } from './mocks';
import { Customer } from 'src/customer/entities/customer.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Biller)
    private billerRepository: Repository<Biller>,
    @InjectRepository(VatRate)
    private vatRepository: Repository<VatRate>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      username: createUserDto.username,
      password: hashedPassword,
    });

    // Erstmal User speichern
    const savedUser = await this.usersRepository.save(user);

    // Jetzt den Biller für diesen User anlegen
    const biller = this.billerRepository.create({
      user: savedUser,
    });

    const savedBiller = await this.billerRepository.save(biller);

    // Jetzt die Standardsteuersätze anlegen
    const standardRates = [
      { percentage: 19.0, description: 'Standardsteuersatz', isDefault: true },
      { percentage: 7.0, description: 'Ermäßigter Steuersatz' },
    ];

    const vatRates = standardRates.map((rate) =>
      this.vatRepository.create({
        ...rate,
        biller: savedBiller,
      }),
    );

    await this.vatRepository.save(vatRates);

    const customerMocks = customers.map((customer) =>
      this.customerRepository.create({
        ...customer,
        biller: savedBiller,
      }),
    );

    await this.customerRepository.save(customerMocks);

    return {
      id: savedUser.id,
      username: savedUser.username,
    };
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  //   findOne(id: number) {
  //     return `This action returns a #${id} user`;
  //   }

  //   update(id: number, updateUserDto: UpdateUserDto) {
  //     return `This action updates a #${id} user`;
  //   }

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
