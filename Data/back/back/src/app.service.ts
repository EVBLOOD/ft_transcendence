import { Injectable } from '@nestjs/common';
export const hostSocket = 'http://localhost:4200'
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
