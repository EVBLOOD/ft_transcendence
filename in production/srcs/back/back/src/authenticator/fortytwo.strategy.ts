import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { AuthenticatorService } from './authenticator.service';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    @Inject(AuthenticatorService)
    private readonly Auth_Service: AuthenticatorService,
  ) {
    super({
      clientID: process.env.FORTY_TWO_APP_UID,
      clientSecret: process.env.FORTY_TWO_APP_SECRET,
      callbackURL: process.env.FORTY_TWO_CALLBACK_URL,
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ): Promise<any> {
    try {
      return await done(
        null,
        await this.Auth_Service.validating(
          profile._json.id,
          profile.username,
          profile.displayName,
          profile._json.image.link,
        ),
      );
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
}
