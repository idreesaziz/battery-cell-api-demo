import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("battery_cells")
export class BatteryCell {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 64, unique: true })
  serialNumber!: string;

  @Column({ type: "float" })
  voltage!: number;

  @Column({ type: "float" })
  temperature!: number;

  @Column({ type: "float" })
  stateOfCharge!: number;

  @Column({ type: "float" })
  stateOfHealth!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
