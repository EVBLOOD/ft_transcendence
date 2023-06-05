import { Controller, Get, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { AuthenticatorService } from './authenticator.service';
import { fortytwoAuthGuard } from './auth.guard';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwtauth.guard';

@Controller()
export class AuthenticatorController {
  constructor(private readonly jwtService: JwtService) {}

  @Get('login')
  @UseGuards(fortytwoAuthGuard)
  login()
  {}
  
  @Get('auth/callback')
  @UseGuards(fortytwoAuthGuard)
  callback(@Req() req, @Res( {passthrough: true }) res: Response) {
    // console.log("test entering");
    if (!req.user)
      return "alo?";
    const token =  this.jwtService.sign({sub: req.user.username, email: req.user.email});
    res.cookie('access_token', token)

    return res.redirect('/redirection');
  }

  @UseGuards(JwtAuthGuard)
  @Get('redirection')
  redirection(@Req() req)
  {
    console.log(req.user);
    return {msg: 'Hello from the other side'}
  }
}
