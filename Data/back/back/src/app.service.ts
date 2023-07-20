import { Injectable } from '@nestjs/common';
export const hostSocket = 'http://10.13.11.1:4200'
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
