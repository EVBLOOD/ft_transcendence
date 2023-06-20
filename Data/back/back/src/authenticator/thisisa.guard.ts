import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatorService } from './authenticator.service';

@Injectable()
export class ThisIsA extends AuthGuard('jwt') {
  constructor(
    private readonly serviceJWt: JwtService,
    private readonly serviceToken: AuthenticatorService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    if (!request.cookies || !request.cookies[process.env.TOKEN_NAME])
      return false;
    const cookieVal = request.cookies[process.env.TOKEN_NAME];
    try {
      request.new_user = this.serviceJWt.decode(cookieVal);
    } catch (err) {
      response.clearCookie(process.env.TOKEN_NAME);
      return false;
    }
    if (request.new_user) {
      const replay = await this.serviceToken.IsSameBut(
        (request.new_user.sub as number) || -1,
        cookieVal,
      );
      if (replay) {
        if (replay !== true)
          request.new_user = { steps: 1, data: request.new_user };
        return true;
      }
    }
    response.clearCookie(process.env.TOKEN_NAME);
    return false;
  }
}
