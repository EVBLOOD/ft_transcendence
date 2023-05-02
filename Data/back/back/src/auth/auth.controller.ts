import { Controller, Get, Req, Request, Res, Session, UseGuards } from '@nestjs/common';
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
  async callback(@Req() req, @Res() res) {
    // The user will be redirected back to your application after authentication
    res.redirect('/auth/test');
  }

  @UseGuards(IsauthGuard)
  @Get('test')
  testing(@Request() req) : string
  {
    return req.user;
  }
}
