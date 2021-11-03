import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): Record<string, any> {
    return {
      succcessful: true,
      message: `backend version ${process.env.NODE_ENV}`,
    };
  }
}
