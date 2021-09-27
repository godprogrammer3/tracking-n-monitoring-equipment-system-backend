import { User } from "src/users/entities/user.entity";
export declare class Department {
    id: number;
    dept_name: string;
    created_at: Date;
    updated_at: Date;
    users: User[];
}
