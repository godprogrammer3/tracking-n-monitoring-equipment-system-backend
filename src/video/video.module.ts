import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { LockerGateway } from './locker.gateway';

@Module({
  providers: [LockerGateway, VideoService],
})
export class VideoModule {}
