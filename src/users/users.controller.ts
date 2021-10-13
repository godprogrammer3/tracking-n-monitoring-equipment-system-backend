import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SendGridService } from '@anchan828/nest-sendgrid';


@Controller('users')
export class UsersController {
  constructor(
    private service: UsersService,
    private readonly sendGrid: SendGridService,
  ) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param() params) {
    return this.service.findOne(params.id);
  }

  @Post()
  create(@Body() CreateUserDto: CreateUserDto) {
    return this.service.createUser(CreateUserDto);
  }

  @Put(':id')
  update(@Param() params, @Body() updateUserDto: UpdateUserDto) {
    return this.service.updateUser(params.id, updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param() params) {
    return this.service.remove(params.id);
  }

  @Put('send-mail')
  async sendMail(): Promise<any> {
    const result = await this.sendGrid.send({
      to: 'game47you@gmail.com',
      from: '6101013@kmitl.ac.th',
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    });
    return result;
  }
}
