import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatorService } from './authenticator.service';

@Injectable()
export class SocketAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly serviceJWt: JwtService,
    private readonly serviceToken: AuthenticatorService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    if (!client.handshake.headers.authorization) return false;
    const xyz: any = this.serviceJWt.decode(
      client.handshake.headers.authorization,
    );
    if (!xyz)
      return this.serviceToken.IsSame(
        xyz.sub || -1,
        client.handshake.headers.authorization,
      );
    return false;
  }
}
