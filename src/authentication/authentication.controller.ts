import { SendGridService } from '@anchan828/nest-sendgrid';
import { Controller, Get, Put, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from './authenttication.guard';

@Controller('authen')
export class AuthenticationController {
  constructor(private readonly sendGrid: SendGridService){}
  @UseGuards(FirebaseAuthGuard)
  @Get('/hello')
  getAll() {
    return 'hello';
  }

  @Put('send-mail')
  async sendMail(): Promise<any> {
    const result = await this.sendGrid.send({
      to: 'game47you@gmail.com',
      from: '61010103@kmitl.ac.th',
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    });
    return result;
  }
}
