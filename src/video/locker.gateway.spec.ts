import { Test, TestingModule } from '@nestjs/testing';
import { LockerGateway } from './locker.gateway';
import { VideoService } from './video.service';

describe('VideoGateway', () => {
  let gateway: LockerGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LockerGateway, VideoService],
    }).compile();

    gateway = module.get<LockerGateway>(LockerGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
