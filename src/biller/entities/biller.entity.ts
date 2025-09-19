// src/biller/entities/biller.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { VatRate } from 'src/vat-rate/entities/vat-rate.entity';

@Entity()
export class Biller {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  preName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  street: string;

  @Column({ nullable: true })
  streetNumber: number;

  @Column({ nullable: true })
  postcode: number;

  @Column({ nullable: true })
  town: string;

  @Column({ nullable: true })
  country: string;

  @OneToOne(() => User, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToMany(() => Customer, (customer) => customer.biller, { cascade: true })
  customers: Customer[];

  @OneToMany(() => VatRate, (vatRate) => vatRate.biller, {
    cascade: true,
  })
  vatRates: VatRate[];

  @Column({ default: 1 })
  invoiceNumber: number;
}
