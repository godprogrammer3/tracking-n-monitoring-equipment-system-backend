import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { IsDate, IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Role } from './role.entity';
import { Department } from 'src/department/entities/department.entity';
import { type } from 'os';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  status: string;

  @Column()
  fcm_token: string;

  @Column()
  tel: string;

  @Column()
  gender: string;

  @Column({ type: Date})
  birth_date: Date;

  @Column()
  face_id: string;

  @Column()
  profile_pic: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @ManyToOne(() => Department, (dept) => dept.users)
  dept: Department;

  @ManyToOne(type => User)
  @JoinColumn({
    name: 'updated_by',
    referencedColumnName: 'id'
  })
  updated_by: User;
}
