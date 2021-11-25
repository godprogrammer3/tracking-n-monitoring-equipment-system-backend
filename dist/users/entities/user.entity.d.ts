import { Role } from "./role.entity";
import { Department } from 'src/department/entities/department.entity';
export declare class User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    fcm_token: string;
    tel: string;
    gender: string;
    birth_date: Date;
    face_id: string;
    profile_pic: string;
    created_at: Date;
    updated_at: Date;
    user: User;
    role: Role;
    dept: Department;
}
