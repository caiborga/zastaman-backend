import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { Biller } from 'src/biller/entities/biller.entity';

@Entity()
@Index('unique_default_vat_per_biller', ['biller', 'isDefault'], {
  unique: true,
  where: `"isDefault" = true`,
})
export class VatRate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  percentage: number;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'isDefault', default: false })
  isDefault: boolean;

  @ManyToOne(() => Biller, (biller) => biller.vatRates, { onDelete: 'CASCADE' })
  biller: Biller;
}
