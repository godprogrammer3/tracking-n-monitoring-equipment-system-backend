import { Timestamp } from "typeorm";

export class CreateUserDto {
    id:number;
    firstName:string;
    lastName:string;
    tel:string;
    email: string;
    birth_date: Date;
    password: string;
    face_id: number;
    profile_pic: string;
    ban_status: string;
    created_at: Timestamp;
    updated_at: Timestamp;
    updated_by: number;

}
