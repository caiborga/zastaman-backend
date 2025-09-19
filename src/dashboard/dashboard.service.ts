import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/customer/entities/customer.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}
  async getData(id: number) {
    const invoices = await this.invoiceRepository.find({
      where: { user: { id } },
    });
    if (!invoices.length) {
      return { data: [], message: 'No invoices found' };
    }

    const { totalNet, vatTotal, totalGross } = invoices.reduce(
      (acc, inv) => {
        const net = Number(inv.invAmount) || 0;
        const vat = Number(inv.vatAmount) || 0;

        acc.totalNet += net;
        acc.vatTotal += vat;
        acc.totalGross += net + vat;
        return acc;
      },
      { totalNet: 0, vatTotal: 0, totalGross: 0 },
    );
    const monthlySummary: Record<
      string,
      { total: number; vatTotal: number; customers: number[] }
    > = {};

    for (const inv of invoices) {
      const date = new Date(inv.invDate);
      const monthKey = `${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlySummary[monthKey]) {
        monthlySummary[monthKey] = { total: 0, vatTotal: 0, customers: [] };
      }

      monthlySummary[monthKey].total += Number(inv.invAmount);
      monthlySummary[monthKey].vatTotal += Number(inv.vatAmount);
      monthlySummary[monthKey].customers.push(inv.customer);
    }

    const monthsTotals = Array(12).fill(0);
    const monthsVats = Array(12).fill(0);

    for (const inv of invoices) {
      const date = new Date(inv.invDate);
      const monthIndex = date.getMonth(); // 0 = Januar, 11 = Dezember
      monthsTotals[monthIndex] += Number(inv.invAmount);
      monthsVats[monthIndex] += Number(inv.vatAmount);
    }

    const customerIds = invoices
      .map((inv) => inv.customer)
      .filter((id) => !!id); // falls null/undefined rausgefiltert werden soll

    const customers = await this.customerRepository.find({
      where: { id: In(customerIds) },
    });

    const months = Object.entries(monthlySummary)
      .sort(([a], [b]) => a.localeCompare(b))
      .reduce(
        (acc, [key, val]) => {
          acc[key] = val;
          return acc;
        },
        {} as Record<string, { total: number; vatTotal: number }>,
      );
    return {
      data: {
        count: invoices.length,
        totalNet,
        totalGross,
        vatTotal,
        monthsTotals,
        monthsVats,
        months,
      },
      customers,
    };
  }
}
