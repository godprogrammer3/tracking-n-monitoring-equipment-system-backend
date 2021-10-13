import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly sendGrid: SendGridService
  ) { }

  validateUser(username: string, pass: string): boolean {
    console.log("validateUser");
    return true;
  }

  async signIn(email: string, verify: boolean): Promise<any> {
    if (!verify) {
      return new HttpException('Email not verify', HttpStatus.NOT_FOUND)
    }
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return new HttpException('Invalid email', HttpStatus.NOT_FOUND);
    }
    if (user.status == 'Approved' || user.status == 'SignedOut') {
      this.usersService.updateUser(user.id, { "status": "Signingin" });
      return new HttpException('signin success', HttpStatus.OK);
    }
    else return new HttpException('Can not login', HttpStatus.NOT_FOUND);
  }

  async register(userDto: CreateUserDto): Promise<any> {
    const result = await this.usersService.findByEmail(userDto.email);
    if (result) {
      if (result.status == 'Approved') {
        this.usersService.updateUser(result.id, userDto);
        return new HttpException('register success', HttpStatus.OK);
      }
      else return new HttpException('Your account is waiting for approve', HttpStatus.NOT_FOUND)
    }
    else {
      const user = await this.usersService.createUser(userDto);
      this.usersService.updateUser(user.id, { "status": "WaitingForValodateEmail" })
      return new HttpException('register seccess', HttpStatus.CREATED);
    }
  }

  async signOut(email: string) {
    const result = await this.usersService.findByEmail(email);
    this.usersService.updateUser(result.id, { "status": "SignedOut" });
    return new HttpException('Signed Out', HttpStatus.OK);
  }

  async sendMail(): Promise<any> {
    const result = await this.sendGrid.send({
      to: 'supreeyafon22@gmail.com',
      from: '61010103@kmitl.ac.th',
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    });
    return result;
  }
}
