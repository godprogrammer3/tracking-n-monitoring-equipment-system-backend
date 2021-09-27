import { SendGridService } from '@anchan828/nest-sendgrid';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { AuthenticationService } from './authentication.service';
export declare class AuthenticationController {
    private readonly sendGrid;
    private service;
    constructor(sendGrid: SendGridService, service: AuthenticationService);
    signIn(req: any, userDto: UpdateUserDto): Promise<any>;
    register(createUserDto: CreateUserDto): Promise<any>;
    signout(req: any): Promise<any>;
    sendMail(): Promise<any>;
    sendNoti(): Promise<any>;
}
