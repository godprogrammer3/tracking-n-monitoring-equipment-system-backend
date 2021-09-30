import { Timestamp } from "typeorm";

export class CreateUserDto {
    id:number;
    firstName:string;
    lastName:string;
    email: string;
    password: string;
    tel:string;    
    sex: string;
    birth_date: Date;
    face_id: string;
    profile_pic: string;
    ban_status: string;
    created_at: Date;
    updated_at: Date;
}
