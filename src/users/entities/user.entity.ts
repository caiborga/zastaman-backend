import { Exclude } from 'class-transformer';
import { Biller } from 'src/biller/entities/biller.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @OneToOne(() => Biller, (biller) => biller.user)
  biller?: Biller;

  @OneToMany(() => Invoice, (invoice) => invoice.user)
  invoices?: Invoice[];
}
