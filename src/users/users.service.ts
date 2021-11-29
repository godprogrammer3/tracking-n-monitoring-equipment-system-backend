import { HttpCode, HttpException, HttpStatus, Injectable, Options } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createConnection, getRepository, In } from 'typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './entities/role.entity';
import { connect } from 'http2';
import { resourceLimits } from 'worker_threads';
import { SendGridService } from '@anchan828/nest-sendgrid';
import * as admin from 'firebase-admin';
import { getResponse } from 'src/utils/response';
import e from 'express';
import { CreateByAdmin } from './dto/create-by-admin.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly sendGrid: SendGridService
  ) { }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findById(id: number): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        id
      },
      relations: ['role', 'dept']
    });
  }

  async viewUser(ids: string) {
    console.log('view',typeof(ids[0]));
    var idsToNumber = ids.split(',').map(Number);
    const users = await this.usersRepository.find({
      where: {
        id: In(idsToNumber)
      },
      relations: ['role', 'dept']
    })
    throw new HttpException(getResponse('00', users), HttpStatus.OK);
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
      relations: ['role', 'dept']
    });
    return user;
  }

  async remove(id: number) {
    const user = await this.findById(id);
    const result = await admin.auth().getUserByEmail(user.email);
    await admin.auth().deleteUser(result.uid);
    await this.usersRepository.delete(id);
    throw new HttpException(getResponse('00', null), HttpStatus.OK);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    throw this.usersRepository.save(user);
  }

  async createByAdmin(createByAdmin: CreateByAdmin) {
    for (let i = 0; i < createByAdmin.email.length; i++) {
      const user = this.usersRepository.create({
        email: createByAdmin.email[i],
        status: 'Approved',
        role: createByAdmin.role,
        dept: createByAdmin.dept
      });
      this.usersRepository.save(user);
      throw new HttpException(getResponse('00', null), HttpStatus.OK);
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.save({ ...updateUserDto, id: Number(id) });
  }

  async findRole(id: number) {
    let result = await this.usersRepository.findOne({
      where: { id },
      relations: ['role'],
    });
    return (result.role.role);
  }

  async findByRole(role: string[], dept_id: number) {
    const result = await this.usersRepository.find({
      relations: ['role', 'dept'],
      where: {
        role: {
          role: In(role)
        },
        dept: {
          id: dept_id
        }
      }
    })
    return result;
  }

  async approve(id: number, actorId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: ['dept'],
    });
    if (user.status == 'WaitingForApprove') {
      this.usersRepository.update(id, {
        status: 'Approved'
      });
      this.sendNotiToOne(user.fcm_token);
      this.sendMail(user.email);
      throw new HttpException(getResponse('00', null), HttpStatus.OK);
    }
    else {
      throw new HttpException(getResponse('05', null), HttpStatus.FORBIDDEN);
    }
  }


  async sendMail(email: string): Promise<any> {
    const result = await this.sendGrid.send({
      to: email,
      from: '6101013@kmitl.ac.th',
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    });
    return result;
  }

  async sendNotiToOne(token: string): Promise<any> {
    const message = {
      notification: {
        title: 'test',
        body: '12345'
      },
      token: token
    };
    admin.messaging().send(message)
      .then((response) => {
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
  }

  async block(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: ['dept'],
    });
    if (user.status == 'Blocked') {
      throw new HttpException(getResponse('07', null), HttpStatus.FORBIDDEN);
    }
    else {
      this.updateUser(id, { 'status': 'Blocked' });
      throw new HttpException(getResponse('00', null), HttpStatus.OK);
    }
  }

  async unBlock(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: ['dept'],
    });
    if (user.status == 'Blocked') {
      this.updateUser(id, { 'status': 'SignedOut' });
      throw new HttpException(getResponse('00', null), HttpStatus.OK);
    }
    else {
      throw new HttpException(getResponse('06', null), HttpStatus.FORBIDDEN);
    }
  }
}
