import { Body, Controller, Get, HttpStatus, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthenticatorService } from './authenticator.service';
import { fortytwoAuthGuard } from './auth.guard';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwtauth.guard';
import { FactorConfirmDTO, validateConfirmDTO } from './dto/factor-confirm.dto';

@Controller()
export class AuthenticatorController {
  constructor(private readonly jwtService: JwtService, private readonly service: AuthenticatorService) {}

  @Get('login')
  @UseGuards(fortytwoAuthGuard)
  login()
  {}
  
  @Get('auth/callback')
  @UseGuards(fortytwoAuthGuard)
  async CallBack(@Req() req, @Res( {passthrough: true }) res: Response) {
    if (!req.user)
      return "alo?";
    if (await this.service.TwoFactoRequired(req.user.username) == true)
      return {TwoFactor: req.user.username};
    var token;
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
  Redirection(@Req() req)
  {
    console.log(req.new_user);
    return {msg: 'Hello from the other side'}
  }
  @Post('hi')
  hi()
  {
    return {}
  }
  
  // @UseGuards(fortytwoAuthGuard)
  @Post('validate')
  async ValidateTwoFactor(@Req() req, @Res() res,  @Body() data: validateConfirmDTO)
  {
    if ((await this.service.TwoFA_Validate(data.username, data.token)) == null)
      return res.status(403).send({});
    var token;
    if (!req.cookies || !req.cookies[process.env.TOKEN_NAME])
    token =  this.jwtService.sign({sub: data.username, email: req.user.email});
    else
    token = req.cookies[process.env.TOKEN_NAME];
    const tokenUser = await this.service.GenToken(data.username, token);
    if (tokenUser)
      res.cookie(process.env.TOKEN_NAME, tokenUser.token);
    return res.redirect('/redirection');
  }

  @UseGuards(JwtAuthGuard)
  @Get('2factorAnable')
  async EnableTwoFactor(@Req() req)
  {
    return await this.service.TwoFA_SendQr(req.new_user.sub);
  }


  @UseGuards(JwtAuthGuard)
  @Post('confirm')
  async ConfirmTwoFactor(@Req() req, @Body() data: FactorConfirmDTO)
  {
    console.log(data.token);
    console.log(req.new_user.sub);
    return await this.service.TwoFA_Enabling(req.new_user.sub, data.token);
  }
}
