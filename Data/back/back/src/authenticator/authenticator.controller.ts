import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticatorService } from './authenticator.service';
import { fortytwoAuthGuard } from './auth.guard';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwtauth.guard';
import { FactorConfirmDTO, validateConfirmDTO } from './dto/factor-confirm.dto';
import { retry } from 'rxjs';

@Controller()
export class AuthenticatorController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly service: AuthenticatorService,
  ) {}

  @Get('login')
  @UseGuards(fortytwoAuthGuard)
  login() {}

  @Get('auth/callback')
  @UseGuards(fortytwoAuthGuard)
  async CallBack(@Req() req, @Res({ passthrough: true }) res: Response) {
    if (!req.user)
      throw new HttpException(
        'INTERNAL_SERVER_ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    if ((await this.service.TwoFactoRequired(req.user.username)) == true)
      return { TwoFactor: req.user.username };
    var token: string;
    if (!req.cookies || !req.cookies[process.env.TOKEN_NAME])
      token = this.jwtService.sign({
        sub: req.user.username,
        email: req.user.email,
      });
    else token = req.cookies[process.env.TOKEN_NAME];
    const tokenUser = await this.service.GenToken(req.user.username, token);
    if (tokenUser) res.cookie(process.env.TOKEN_NAME, tokenUser.token);
    return res.redirect('/redirection');
  }

  @UseGuards(JwtAuthGuard)
  @Get('redirection')
  Redirection(@Req() req) {
    return { msg: 'Hello from the other side', user: req.new_user };
  }

  // @UseGuards(fortytwoAuthGuard)
  @Post('validate')
  async ValidateTwoFactor(
    @Req() req,
    @Res() res,
    @Body() data: validateConfirmDTO,
  ) {
    try {
      if (
        (await this.service.TwoFA_Validate(data.username, data.token)) == null
      )
        return res.status(403).send({});
      var token;
      if (!req.cookies || !req.cookies[process.env.TOKEN_NAME])
        token = this.jwtService.sign({
          sub: data.username,
          email: req.user.email,
        });
      else token = req.cookies[process.env.TOKEN_NAME];
      const tokenUser = await this.service.GenToken(data.username, token);
      if (tokenUser) res.cookie(process.env.TOKEN_NAME, tokenUser.token);
      return res.redirect('/redirection');
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'FORBIDDEN',
        },
        HttpStatus.FORBIDDEN,
        { cause: error },
      );
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('2factorAnable')
  async EnableTwoFactor(@Req() req) {
    try {
      const replay = await this.service.TwoFA_SendQr(req.new_user.sub);
      if (replay) return replay;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'FORBIDDEN',
        },
        HttpStatus.FORBIDDEN,
        { cause: error },
      );
    }
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post('confirm')
  async ConfirmTwoFactor(@Req() req, @Body() data: FactorConfirmDTO) {
    try {
      const ret = await this.service.TwoFA_Enabling(
        req.new_user.sub,
        data.token,
      );
      if (ret) return ret;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'FORBIDDEN',
        },
        HttpStatus.FORBIDDEN,
        { cause: error },
      );
    }
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}
