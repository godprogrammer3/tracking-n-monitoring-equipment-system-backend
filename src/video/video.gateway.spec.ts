import { Test, TestingModule } from '@nestjs/testing';
import { VideoGateway } from './video.gateway';
import { VideoService } from './video.service';

describe('VideoGateway', () => {
  let gateway: VideoGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideoGateway, VideoService],
    }).compile();

    gateway = module.get<VideoGateway>(VideoGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
