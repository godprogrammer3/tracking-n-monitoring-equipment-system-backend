import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoGateway } from './video.gateway';

@Module({
  providers: [VideoGateway, VideoService]
})
export class VideoModule {}
