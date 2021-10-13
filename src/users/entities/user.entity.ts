import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Role } from "./role.entity";
import { Department } from 'src/department/entities/department.entity';

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
  tel: string;

  @Column()
  sex: string;
  
  @Column()
  birth_date: Date;

  @Column()
  face_id: string;

  @Column()
  profile_pic: string;

  @Column()
  status: string;

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
