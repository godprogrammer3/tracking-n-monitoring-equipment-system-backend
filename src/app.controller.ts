import { Body, Controller, Get, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppService } from './app.service';
import { Locker } from './entities/locker.entity';
import { VideoGateway } from './video/video.gateway';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectRepository(Locker)
    private lockerRepository: Repository<Locker>,
    private readonly videoGateway: VideoGateway,
  ) {}

  @Get()
  getHello(): any {
    return this.appService.getHello();
  }

  @Post('/create_locker')
  async createLocker(@Body() body): Promise<any> {
    console.log('body:', body);
    const locker = this.lockerRepository.create(body);
    await this.lockerRepository.save(locker);
    this.videoGateway.server.emit('locker_update', body);
    return {
      successful: true,
    };
  }

  @Get('/all_locker')
  async getAllLocker(): Promise<any> {
    return await this.lockerRepository.find();
  }
}
