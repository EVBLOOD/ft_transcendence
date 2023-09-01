import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatorService } from './authenticator.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
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
    try {
      request.new_user = this.serviceJWt.decode(
        request.cookies[process.env.TOKEN_NAME],
      );
    } catch (err) {
      response.clearCookie(process.env.TOKEN_NAME);
      return false;
    }
    if (request.new_user) {
      const replay = await this.serviceToken.IsSameBut(
        (request.new_user.sub as number) || -1,
        request.cookies[process.env.TOKEN_NAME],
      );
      if (replay === true) return true;
      else if (replay) return false;
    }
    response.clearCookie(process.env.TOKEN_NAME);
    return false;
  }
}
