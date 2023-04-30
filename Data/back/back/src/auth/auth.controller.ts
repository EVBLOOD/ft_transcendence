import { Controller, Get, Request, Session, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MyAuthGuard } from './auth.guard';
import { User } from 'src/user/entities/user.entity';
import { IsauthGuard } from './isauth.guard';

@Controller('auth')
export class AuthController {
  // constructor(private readonly authService: AuthService) {}
  
  @Get()
  @UseGuards(MyAuthGuard)
  async authenticate()
  {
    return {msg: "lol"};
  }
  @UseGuards(MyAuthGuard)
  @Get('callback')
  async callback() {
    // if (session.user)
      // console.log(session);
    // The user will be redirected back to your application after authentication
    return {msg: "3la slama"};
  }
  @UseGuards(IsauthGuard)
  @Get('test')
  testing(@Request() req) : string
  {
    return req.user;
  }
}
