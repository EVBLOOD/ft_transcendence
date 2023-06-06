import { ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatorService } from './authenticator.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {


    constructor(private readonly serviceJWt : JwtService, private readonly serviceToken: AuthenticatorService) { super(); }
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        if (!request.cookies || !request.cookies[process.env.TOKEN_NAME])
            return false;
        request.new_user = this.serviceJWt.decode(request.cookies[process.env.TOKEN_NAME]);
        if (request.new_user)
            return this.serviceToken.IsSame(request.new_user.sub as string || request.user.username, request.cookies[process.env.TOKEN_NAME]);
        return false;
    }
}