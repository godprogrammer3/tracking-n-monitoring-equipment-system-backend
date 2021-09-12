import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private usersRepository: Repository<User>) { }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
      }
    
    findOne(id: string): Promise<User> {
        return this.usersRepository.findOne(id);
      }
    
    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id);
      }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const user = this.usersRepository.create(createUserDto);
        return this.usersRepository.save(user);

    }

    async updateUser(id: string ,updateUserDto: UpdateUserDto) {
        return this.usersRepository.save({...updateUserDto, id: Number(id)})
    }

}