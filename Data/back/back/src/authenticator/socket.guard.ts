import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SocketAuthGuard extends AuthGuard('jwt') {


    constructor(private readonly serviceJWt : JwtService) { super(); }
    async canActivate(context: ExecutionContext) {
        const request = context.switchToWs().getClient();
        if (!request.cookies || !request.cookies[process.env.TOKEN_NAME])
            return false;
        request.new_user = this.serviceJWt.decode(request.cookies[process.env.TOKEN_NAME]);
        if (!request.new_user)
            return false;
        return true;
    }
}