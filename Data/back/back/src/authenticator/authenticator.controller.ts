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
    console.log("test entering");
    if (!req.user)
    return "alo?";
    const token =  this.jwtService.sign({sub: req.user.username, email: req.user.email});
    console.log("end gen");
    res.cookie('access_token', token)

    // res.cookie('access_token', token, {
    //   maxAge: 2592000000,
    //   sameSite: true,
    //   secure: false,
    // });
    
    console.log("aloha");
    return res.redirect('/redirection');
      // return res.status(HttpStatus.OK);
  }

  @UseGuards(JwtAuthGuard)
  @Get('redirection')
  redirection(@Req() req)
  {
    console.log(req)
    console.log(req.user);
    return {msg: 'Hello from the other side'}
  }
}
