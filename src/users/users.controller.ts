import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { FirebaseAuthGuard } from 'src/authentication/authenttication.guard';


@Controller('users')
export class UsersController {
  constructor(
    private service: UsersService,
    private readonly sendGrid: SendGridService,
  ) {}
  //@Roles('super_admin')
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('findbyId/:id')
  findById(@Param() params) {
    return this.service.findById(params.id);
  }

  @Post()
  create(@Body() CreateUserDto: CreateUserDto) {
    return this.service.createUser(CreateUserDto);
  }

  @Put('updatebyId/:id')
  update(@Param() params, @Body() updateUserDto: UpdateUserDto) {
    return this.service.updateUser(params.id, updateUserDto);
  }

  @UseGuards(FirebaseAuthGuard,RolesGuard)
  @Delete('remove/:id')
  deleteUser(@Request() req ,@Param() params) {
    return this.service.remove(params.id,req.user);
  }

  @Get('findRole/:id')
  findRole(@Param() params) {
    return this.service.findRole(params.id);
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

  @Get('findByRole')
  async findByRole(): Promise<any> {
    const role: string[] = ['super_admin','admin']; 
    return this.service.findByRole(role, 1);
  }

  
  @UseGuards(FirebaseAuthGuard,RolesGuard)
  @Roles('super_admin','admin')
  @Put('/approve/:id')
  approve(@Request() req, @Param() params) {
    console.log('user',params.id);
    return this.service.approve(params.id,req.user);
  }

  @Get('getUser')
  viewUser(@Body() id: string[]) {
    console.log('id', id[0]);
  }
}
