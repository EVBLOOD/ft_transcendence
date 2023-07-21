import { Injectable } from '@nestjs/common';
export const hostSocket = 'http://10.13.7.3:4200'
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
