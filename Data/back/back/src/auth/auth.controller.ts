import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { MyAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  // constructor(private readonly authService: AuthService) {}
  
  @Get()
  @UseGuards(MyAuthGuard)
  async authenticate()
  {
    return {msg: "lol"};
  }
  @Get('callback')
  @UseGuards(MyAuthGuard)
  async callback() {
    // The user will be redirected back to your application after authentication
    return {msg: "3la slama"};
  }
}
