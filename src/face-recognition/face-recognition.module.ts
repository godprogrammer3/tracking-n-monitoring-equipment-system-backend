import { Module } from '@nestjs/common';
import { FaceRecognitionService } from './face-recognition.service';
import { FaceRecognitionController } from './face-recognition.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [],
  controllers: [FaceRecognitionController],
  providers: [FaceRecognitionService],
})
export class FaceRecognitionModule {}
