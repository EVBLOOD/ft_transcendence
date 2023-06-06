import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, ExecutionContext } from '@nestjs/common';
// import { ConfigType } from '@nestjs/config';
// import config from '../../config/config';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from '../../users/entities/user.entity';

export type JwtPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
  ) {
    const extractJwtFromCookie = (req) => {
      let token = null;

      if (req && req.cookies) {
        token = req.cookies[process.env.TOKEN_NAME];
      }
      return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    };
    
    super({
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      jwtFromRequest: extractJwtFromCookie,
    });
  }

  async validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}