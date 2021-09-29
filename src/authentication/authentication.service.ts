import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticationService {
  validateUser(username: string, pass: string): boolean {
    return true;
  }
}
