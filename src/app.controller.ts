import { Body, Controller, Get, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppService } from './app.service';
import { Locker } from './entities/locker.entity';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectRepository(Locker)
    private usersRepository: Repository<Locker>,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/create_locker')
  async createLocker(@Body() body): Promise<any> {
    console.log('body:', body);
    const locker = this.usersRepository.create(body);
    await this.usersRepository.save(locker);
    return {
      successful: true,
    };
  }
}
