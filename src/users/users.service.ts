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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) 
    private usersRepository: Repository<User>,
    private readonly sendGrid: SendGridService
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findById(id: number): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        id
      },
      relations: ['role','dept']
    });
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
      relations: ['role','dept']
    });
    return user;
  }

  async remove(id: number , actor: any) {
    const actorDB = await this.findByEmail(actor.email);
    const user = await this.findById(id);
    if (id !== actorDB.id) {
      if (actor.role != 'super_admin') {
        if (actorDB.dept.id != user.dept.id) {
          throw new HttpException('fdsf',HttpStatus.FORBIDDEN);
        }
      }
    }
    const result = await admin.auth().getUserByEmail(user.email);
    await admin.auth().deleteUser(result.uid);
    await this.usersRepository.delete(id);
    return new HttpException(getResponse('00',null),HttpStatus.OK);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.save({ ...updateUserDto, id: Number(id) });
  }

  async findRole(id: number) {
    let result = await this.usersRepository.findOne({
      where: {id},
      relations: ['role'],
    });
    return(result.role.role);
  }

  async findByRole(role: string[], dept_id: number) {
    const result = await this.usersRepository.find({
      relations: ['role','dept'],
      where: {
        role:{
          role: In(role)
        },
        dept:{
          id: dept_id
        }
      }
    })
    return result;
  }

  async approve(id: number, actor: any) {
    const user = await this.usersRepository.findOne({
      where: {id: id},
      relations: ['dept'],
    });
    if (actor.role != 'super_admin'){
      const actorDB = await this.usersRepository.findOne({
        where: {email: actor.email},
        relations: ['dept']
      })
      if (actorDB.dept.id != user.dept.id) {
        throw new HttpException('dfsdf',HttpStatus.FORBIDDEN);
      }
    }
    this.updateUser(id,{'status': 'Approved'});
    this.sendNotiToOne(user.fcm_token);
    this.sendMail(user.email);
    return new HttpException(getResponse('00',null),HttpStatus.OK);
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

  async block(id: number, actor: any) {
    const user = await this.usersRepository.findOne({
      where: {id: id},
      relations: ['dept'],
    });
    if (actor.role != 'super_admin'){
      const actorDB = await this.usersRepository.findOne({
        where: {email: actor.email},
        relations: ['dept']
      })
      if (actorDB.dept.id != user.dept.id) {
        throw new HttpException('dfsdf',HttpStatus.FORBIDDEN);
      }
    }
    this.updateUser(id,{'status': 'Blocked'});
    return new HttpException(getResponse('00',null),HttpStatus.OK)
  }

  async unBlock(id: number, actor: any) {
    const user = await this.usersRepository.findOne({
      where: {id: id},
      relations: ['dept'],
    });
    if (actor.role != 'super_admin'){
      const actorDB = await this.usersRepository.findOne({
        where: {email: actor.email},
        relations: ['dept']
      })
      if (actorDB.dept.id != user.dept.id) {
        throw new HttpException('dfsdf',HttpStatus.FORBIDDEN);
      }
    }
    this.updateUser(id,{'status': 'Unblocked'});
    return new HttpException(getResponse('00',null),HttpStatus.OK);
  }
}
