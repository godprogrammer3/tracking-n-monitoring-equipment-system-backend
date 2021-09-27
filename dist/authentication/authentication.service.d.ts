import { UsersService } from 'src/users/users.service';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
export declare class AuthenticationService {
    private readonly usersService;
    private readonly sendGrid;
    constructor(usersService: UsersService, sendGrid: SendGridService);
    validateUser(username: string, pass: string): boolean;
    signIn(user: object, fcm_token: string): Promise<any>;
    register(userDto: CreateUserDto): Promise<any>;
    signOut(email: string): Promise<any>;
    sendMail(): Promise<any>;
    sendNoti(): Promise<any>;
}
