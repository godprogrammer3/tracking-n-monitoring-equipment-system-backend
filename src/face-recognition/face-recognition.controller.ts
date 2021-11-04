import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FaceRecognitionService } from './face-recognition.service';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('face-recognition')
export class FaceRecognitionController {
  constructor(
    private readonly faceRecognitionService: FaceRecognitionService,
  ) {}

  @Post('validate-face-id')
  @UseInterceptors(FileInterceptor('file'))
  async validateFaceId(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    return this.faceRecognitionService.validateFaceId(file);
  }
}
