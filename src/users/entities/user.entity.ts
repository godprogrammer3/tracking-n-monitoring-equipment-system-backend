import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

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
  password: string;

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
  ban_status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(type => User)
  @JoinColumn({ name: "updated_by"})
  user: User;
}
