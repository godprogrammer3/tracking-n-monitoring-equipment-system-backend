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
import { Role } from './entities/role.entity';
import { CreateByAdmin } from './dto/create-by-admin.dto';


@Controller('users')
export class UsersController {
  constructor(
    private service: UsersService,
    private readonly sendGrid: SendGridService,
  ) {}

  @UseGuards(RolesGuard)
  @Roles('super_admin')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  
  @UseGuards(RolesGuard)
  @Roles('super_admin','admin')
  @Post('/createUser')
  create(@Body() createByAdmin: CreateByAdmin) {
    return this.service.createByAdmin(createByAdmin);
  }

  @UseGuards(RolesGuard)
  @Put('updatebyId/:id')
  update(@Param() params, @Body() updateUserDto: UpdateUserDto) {
    return this.service.updateUser(params.id, updateUserDto);
  }

  @UseGuards(RolesGuard)
  @Delete('remove/:id')
  removeUser(@Param() params) {
    return this.service.remove(params.id,);
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

  
  @UseGuards(RolesGuard)
  @Roles('super_admin','admin')
  @Put('/approve/:id')
  approve(@Request() req, @Param() params) {
    return this.service.approve(params.id,req.actor.id);
  }

  @UseGuards(RolesGuard)
  @Roles('super_admin','admin')
  @Put('block/:id')
  block(@Param() params) {
    return this.service.block(params.id);
  }

  @UseGuards(RolesGuard)
  @Roles('super_admin','admin')
  @Put('unblock/:id')
  unBlock(@Param() params) {
    return this.service.unBlock(params.id);
  }

  @UseGuards(RolesGuard)
  @Get('/viewUser/:id')
  view(@Param() params) {
    return this.service.viewUser(params.id);
  }
}
