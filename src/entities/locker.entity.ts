import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Locker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  uid: string;
}
