import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {


    constructor(private readonly serviceJWt : JwtService) { super(); }
    async canActivate(context: ExecutionContext) {
        try {
            const can_activate = (await super.canActivate(context)) as boolean;
            console.log(can_activate);
            if (can_activate == false)
                return false;
        }
        catch (error)
        {
            throw new UnauthorizedException();
        }
        const request = context.switchToHttp().getRequest();
        if (!request.cookies || !request.cookies['access_token'])
            return false;
        request.new_user = this.serviceJWt.decode(request.cookies['access_token']);
        return true;
    }
}