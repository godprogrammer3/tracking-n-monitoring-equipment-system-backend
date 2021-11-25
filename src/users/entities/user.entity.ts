import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { IsDate, IsEmail, IsNotEmpty, Length } from "class-validator";
import { Role } from "./role.entity";
import { Department } from 'src/department/entities/department.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  firstName: string;

  @Column()
  @IsNotEmpty()
  lastName: string;

  @Column()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  status: string;

  @Column()
  fcm_token: string;

  @Column()
  @IsNotEmpty()
  @Length(10)
  tel: string;

  @Column()
  @IsNotEmpty()
  gender: string;
  
  @Column()
  @IsDate()
  @IsNotEmpty()
  birth_date: Date;

  @Column()
  @IsNotEmpty()
  face_id: string;

  @Column()
  @IsNotEmpty()
  profile_pic: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(type => User)
  @JoinColumn({ name: "updated_by"})
  user: User;

  @ManyToOne(() => Role, role => role.users)
  role: Role;

  @ManyToOne(() => Department,dept => dept.users)
  dept: Department;

}


