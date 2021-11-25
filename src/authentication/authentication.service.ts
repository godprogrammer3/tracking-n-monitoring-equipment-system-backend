import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { getResponse } from 'src/utils/response';
import * as admin from 'firebase-admin';
import * as serviceAccount from 'src/config/firebase.config.json';

/*admin.initializeApp({
   crdential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});*/

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

  async signIn(user: object, fcm_token: string): Promise<any> {
    if (!user['email_verified']) {
      throw new HttpException(getResponse('02',null),HttpStatus.FORBIDDEN);
    }
    var result = await this.usersService.findByEmail(user['email']);
    if (!result) {
      throw new HttpException(getResponse('03',null),HttpStatus.FORBIDDEN); 
    }
    if (result.status == 'Approved') {
      const userRole = await this.usersService.findRole(result.id)
      await admin.auth().setCustomUserClaims(user['uid'], {
        "role": userRole
      })
      const re = await admin.auth().getUser(user['uid']);
      await this.usersService.updateUser(result.id, { "status": "Signingin","fcm_token": fcm_token });
      result = await this.usersService.findById(result.id);
      throw new HttpException(getResponse('00',result),HttpStatus.OK);
    }
    else if (result.status == 'SignedOut') {
      await this.usersService.updateUser(result.id, { "status": "Signingin","fcm_token": fcm_token });
      result = await this.usersService.findById(result.id);
      throw new HttpException(getResponse('00',result),HttpStatus.OK);
    }
    else throw new HttpException(getResponse('04',null),HttpStatus.FORBIDDEN);
  }

  async register(userDto: CreateUserDto): Promise<any> {
    var result = await this.usersService.findByEmail(userDto.email);
    console.log(result);
    if (result) {
      if (result.status == 'Approved') {
        this.usersService.updateUser(result.id, userDto);
        result = await this.usersService.findById(result.id);
        console.log('response', getResponse('00',result));
        throw new HttpException(getResponse('00',result),HttpStatus.OK);
      }
     /* else {
        return getResponse('01',null);}*/
    }
    else {
      const user = await this.usersService.createUser(userDto);
      this.usersService.updateUser(user.id, { "status": "WaitingForValidateEmail" });
      result = await this.usersService.findById(user.id);
      const getAdmin = await this.usersService.findByRole(['super_admin','admin'],result.dept.id);
      console.log('admin',getAdmin);
      const tokens = getAdmin.map(token => token.fcm_token);
      console.log('tokens', tokens);
      const message = {
        notification: {
          title: 'test',
          body: '12345'
        },
        tokens: tokens
      };
      admin.messaging().sendMulticast(message)
      .then((response) => {
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
      throw new HttpException(getResponse('00',user),HttpStatus.OK);
    }
  }

  async signOut(email: string): Promise<any> {
    const result = await this.usersService.findByEmail(email);
    this.usersService.updateUser(result.id, { "status": "SignedOut", "fcm_token": null });
    throw new HttpException(getResponse('00',null),HttpStatus.OK);
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


  async sendNoti(): Promise<any> {
     const user = await this.usersService.findById(4)
     console.log("department",user.dept.id);
      const getAdmin = await this.usersService.findByRole(['super_admin','admin'],user.dept.id);
      console.log('admin',getAdmin);
      const tokens = getAdmin.map(token => token.fcm_token);
      console.log('tokens', tokens);
      const message = {
        notification: {
          title: 'test',
          body: '12345'
        },
        tokens: tokens
      };
      admin.messaging().sendMulticast(message)
      .then((response) => {
        console.log('Successfully sent message:', response.successCount);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
  }
}
