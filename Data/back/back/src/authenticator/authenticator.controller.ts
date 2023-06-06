import { Controller, Get, HttpStatus, Inject, Req, Res, UseGuards } from '@nestjs/common';
import { AuthenticatorService } from './authenticator.service';
import { fortytwoAuthGuard } from './auth.guard';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwtauth.guard';
import { escape } from 'querystring';

@Controller()
export class AuthenticatorController {
  constructor(private readonly jwtService: JwtService, private readonly service: AuthenticatorService) {}

  @Get('login')
  @UseGuards(fortytwoAuthGuard)
  login()
  {}
  
  @Get('auth/callback')
  @UseGuards(fortytwoAuthGuard)
  async callback(@Req() req, @Res( {passthrough: true }) res: Response) {
    var token;
    if (!req.user)
      return "alo?";
    if (!req.cookies || !req.cookies[process.env.TOKEN_NAME])
      token =  this.jwtService.sign({sub: req.user.username, email: req.user.email});
    else
      token = req.cookies[process.env.TOKEN_NAME];
    const tokenUser = await this.service.GenToken(req.user.username, token);
    if (tokenUser)
      res.cookie(process.env.TOKEN_NAME, tokenUser.token);
    return res.redirect('/redirection');
  }

  @UseGuards(JwtAuthGuard)
  @Get('redirection')
  redirection(@Req() req)
  {
    console.log(req.new_user);
    return {msg: 'Hello from the other side'}
  }
}
