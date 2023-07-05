import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello() {
    // throw new HttpException("SSSS", HttpStatus.EXPECTATION_FAILED)
    return { message: this.appService.getHello() };
  }
}
