import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Biller } from 'src/biller/entities/biller.entity';

@Entity()
export class Customer {
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

  @Column()
  token: string;

  @Column('decimal', { precision: 10, scale: 2 })
  hourlyRate: number;

  @ManyToOne(() => Biller, (biller) => biller.customers, {
    onDelete: 'CASCADE',
  })
  biller: Biller;
}
