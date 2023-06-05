import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SocketAuthGuard extends AuthGuard('jwt') {


    constructor(private readonly serviceJWt : JwtService) { super(); }
    async canActivate(context: ExecutionContext) {
        console.log("canActivate ?")
        // try {
        //     const can_activate = (await super.canActivate(context)) as boolean;
        //     console.log(can_activate);
        //     if (can_activate == false)
        //         return false;
        // }
        // catch (error)
        // {
        //     console.log("throwing")
        //     throw new UnauthorizedException();
        // }
        const request = context.switchToWs().getClient();
        if (!request.cookies || !request.cookies['access_token'])
            return false;
        request.new_user = this.serviceJWt.decode(request.cookies['access_token']);
        if (!request.new_user)
            return false;
        return true;
    }
}