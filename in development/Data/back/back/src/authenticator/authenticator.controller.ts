import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Headers,
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
import { ThisIsA } from './thisisa.guard';

@Controller()
export class AuthenticatorController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly service: AuthenticatorService,
  ) { }

  @Get('login')
  @UseGuards(fortytwoAuthGuard)
  login() { }

  @Get('auth/callback')
  @UseGuards(fortytwoAuthGuard)
  async CallBack(@Req() req, @Res({ passthrough: true }) res: Response) {
    if (!(req.user))
      throw new HttpException(
        'INTERNAL_SERVER_ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    var token: string;
    if (!req.cookies || !req.cookies[process.env.TOKEN_NAME])
      token = this.jwtService.sign({
        sub: req.user.id,
        user_name: req.user.username,
      });
    else token = req.cookies[process.env.TOKEN_NAME];
    const tokenUser = await this.service.GenToken(req.user.id, token);
    if (tokenUser) res.cookie(process.env.TOKEN_NAME, tokenUser.token);
    return res.redirect(process.env.HOST + ':4200');
  }

  @UseGuards(JwtAuthGuard)
  @Get('redirection')
  Redirection(@Req() req) {
    return { user: req.new_user };
  }

  @UseGuards(ThisIsA)
  @Get('isItLogged')
  isItLogged(@Req() req) {
    return req.new_user;
  }

  @UseGuards(ThisIsA)
  @Post('validate')
  async ValidateTwoFactor(
    @Req() req,
    @Res() res,
    @Body() data: validateConfirmDTO,
  ) {
    try {
      if (
        (await this.service.TwoFA_Validate(
          req.new_user.data.sub,
          data.token,
        )) == null
      )
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
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
      if (replay) return { Qr: replay };
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

  @UseGuards(ThisIsA)
  @Get('logout')
  async logout(@Req() req, @Res() response) {
    if (req?.new_user?.sub) {
      await this.service.removeToken(req.new_user.sub);
    }
    response.clearCookie(process.env.TOKEN_NAME);
    response.send({});

    return {};
  }
}
