import { Entity, Column, PrimaryGeneratedColumn, Timestamp  } from "typeorm";
import "reflect-metadata";
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    tel: string;

    @Column()
    email: string;

    @Column()
    birth_date: Date;

    @Column()
    password: string;

    @Column()
    face_id: number;

    @Column()
    profile_pic: string;

    @Column()
    ban_status: string;

    @Column()
    created_at: Timestamp;

    @Column()
    updated_at: Timestamp;

    @Column()
    updated_by: number;

}
