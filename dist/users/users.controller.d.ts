import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SendGridService } from '@anchan828/nest-sendgrid';
export declare class UsersController {
    private service;
    private readonly sendGrid;
    constructor(service: UsersService, sendGrid: SendGridService);
    findAll(): Promise<import("./entities/user.entity").User[]>;
    update(params: any, updateUserDto: UpdateUserDto): Promise<{
        updated_by: number;
        id: number;
        firstName?: string;
        lastName?: string;
        email?: string;
        status?: string;
        fcm_token?: string;
        tel?: string;
        gender?: string;
        birth_date?: Date;
        face_id?: string;
        profile_pic?: string;
        roleId?: number;
        deptId?: number;
    } & import("./entities/user.entity").User>;
    removeUser(params: any): Promise<import("@nestjs/common").HttpException>;
    sendMail(): Promise<any>;
    approve(req: any, params: any): Promise<import("@nestjs/common").HttpException>;
    block(params: any): Promise<import("@nestjs/common").HttpException>;
    unBlock(params: any): Promise<import("@nestjs/common").HttpException>;
}
