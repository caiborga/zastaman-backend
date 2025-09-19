import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
// import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Repository } from 'typeorm';
import { instanceToPlain } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { In } from 'typeorm'; // falls noch nicht importiert
import { VatRate } from 'src/vat-rate/entities/vat-rate.entity';
import { Biller } from 'src/biller/entities/biller.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(VatRate)
    private vatRateRepository: Repository<VatRate>,
    @InjectRepository(Biller)
    private billerRepository: Repository<Biller>,
  ) {}
  async create(dto: CreateInvoiceDto, userPayload: { userId: number }) {
    const user = await this.usersRepository.findOne({
      where: { id: userPayload.userId },
      relations: ['biller'],
    });

    if (!user?.biller) {
      throw new NotFoundException('Biller not found for user');
    }

    const biller = user.biller;
    biller.invoiceNumber += 1;
    await this.billerRepository.save(biller);

    const invoice = this.invoiceRepository.create({
      ...dto,
      user,
    });

    const saved = await this.invoiceRepository.save(invoice);
    return instanceToPlain(saved);
  }

  async findAllForUser(userPayload: { userId: number }) {
    const invoices = await this.invoiceRepository.find({
      where: { user: { id: userPayload.userId } },
    });

    // Hole alle Customer-IDs
    const customerIds = invoices.map((inv) => inv.customer).filter(Boolean);

    const customers = await this.customerRepository.find({
      where: { id: In(customerIds) },
    });

    const customerMap = new Map(customers.map((c) => [c.id, c]));

    // Hole alle VatRate-IDs (über vatKey)
    const vatKeys = invoices.map((inv) => inv.vatKey).filter(Boolean);

    const vatRates = await this.vatRateRepository.find({
      where: { id: In(vatKeys) },
    });

    const vatRateMap = new Map(vatRates.map((v) => [v.id, v]));

    // Kombiniere Daten
    const enrichedInvoices = invoices.map((inv) => ({
      ...inv,
      customer: customerMap.get(inv.customer), // Customer-Objekt
      vatRate: vatRateMap.get(inv.vatKey), // VatRate-Objekt
    }));

    return instanceToPlain(enrichedInvoices);
  }

  async findOne(id: number, userId: number) {
    const invoice = await this.invoiceRepository.find({
      where: { user: { id: userId }, id: id },
    });

    return instanceToPlain(invoice);
  }

  //   update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
  //     return `This action updates a #${id} invoice`;
  //   }

  //   remove(id: number) {
  //     return `This action removes a #${id} invoice`;
  //   }
}
