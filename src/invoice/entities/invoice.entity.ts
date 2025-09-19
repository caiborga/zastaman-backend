import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customer: number;

  @Column()
  invoiceNumber: string;

  @Column()
  periodStart: Date;

  @Column()
  periodEnd: Date;

  @Column()
  invDate: Date;

  @Column()
  createDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  invAmount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  vatAmount: number;

  @Column()
  vatKey: number;

  @ManyToOne(() => User, (user) => user.invoices, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;
}
