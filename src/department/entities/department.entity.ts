import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { User } from "src/users/entities/user.entity"

@Entity()
export class Department {
    @PrimaryColumn()
    id: number;

    @Column()
    dept_name: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => User, user => user.dept)
    users: User[];


}
